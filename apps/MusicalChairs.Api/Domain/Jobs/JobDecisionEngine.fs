namespace MusicalChairs.Api.Domain

open System
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open MusicalChairs.Api.Domain.Email
open MusicalChairs.Api.Domain.Job
open MusicalChairs.Api.Domain.Jobs
open MusicalChairs.Api.Domain.Jobs.JobCommands
open MusicalChairs.Api.Domain.Jobs.JobFacts
open MusicalChairs.Api.Utilities

module JobDecisionEngine =
    type IApplyJobDependencies =
        abstract member generateJobId: unit -> Guid
        abstract member generateContactId: unit -> Guid
        abstract member generatePositionId: unit -> Guid
        abstract member generateMessageId : unit -> Guid

        abstract member getPlannedJob: Guid -> TaskResult<PlannedJob, string>
        abstract member deletePlannedJob: Guid -> TaskResult<unit, string>

        abstract member getJob: Guid -> TaskResult<Job, string>
        abstract member enqueueEmail: Guid -> TaskResult<unit, string>


    type JobDecisions = JobFact list * JobCommand list

    let apply (deps: IApplyJobDependencies) (command: JobCommand) : TaskResult<JobDecisions, string> =
        match command with
        | StartJob command ->
            deps.getPlannedJob command.PlannedJobId

            // Validate the planned job
            >>= (fun plannedJob ->
                match plannedJob with
                | plannedJob when
                    plannedJob.Positions
                    |> List.filter (fun pos -> pos.Contacts.Length = 0)
                    |> List.isEmpty
                    |> not
                    ->
                    TaskResult.error "Cannot start planned job. Requires at least one contact per position."
                | _ -> TaskResult.ok plannedJob)

            // Map the planned job to a Job Started Fact &  Commands.
            >>= (fun plannedJob ->
                plannedJob.Positions
                |> List.map (fun plannedPosition ->
                    taskResult {
                        let! contacts =
                            plannedPosition.Contacts
                            |> List.map (Contact.tryFromPlannedContact deps.generateContactId)
                            |> TaskResult.combine

                        return
                            { Position.PositionId = deps.generatePositionId ()
                              PositionName = plannedPosition.PositionName
                              PositionsAvailable = plannedPosition.PositionsAvailable
                              Contacts = contacts }
                    })
                |> TaskResult.combine
                |> TaskResult.map (fun positions ->
                    let jobId = deps.generateJobId ()

                    let jobStartedFact: JobStartedFact =
                        { UserId = command.UserId
                          CreatorId = plannedJob.CreatorId
                          Templates = plannedJob.Templates
                          Positions = positions }

                    let createContactMessageCommands =
                        jobStartedFact.Positions
                        |> List.map (fun position -> position.Contacts |> List.head)
                        |> List.map (fun contact ->
                            CreateContactMessage
                                { JobId = jobId
                                  ContactId = contact.Id })

                    [ JobStarted jobStartedFact ], createContactMessageCommands))

            |> TaskResult.bind (fun decisions ->
                deps.deletePlannedJob command.PlannedJobId
                |> TaskResult.map (fun _ -> decisions))
        | CreateContactMessage command ->
            deps.getJob command.JobId
            >>= (fun job ->
                // validate the contact is in the correct state.
                job.tryFindContact command.ContactId
                |> function
                    | None -> TaskResult.error "There is no contact with the provided id."
                    | Some contact ->
                        match contact.State with
                        | NotContacted _ -> TaskResult.ok contact
                        | _ -> TaskResult.error "The contact must be in the Not Contacted state in order to generate a contact message."
            >>= fun contact ->
                    job.Templates
                    |> List.tryFind (fun template -> template.TemplateId = contact.TemplateId)
                    |> Option.either TaskResult.ok (fun _ -> TaskResult.error "There is no template with the provided id.")
                    |> TaskResult.map (fun template ->
                        match template.TemplateDetails, contact.ContactMethod with
                        | TemplateContactMethod.EmailTemplate emailTemplate, ContactMethod.Email userEmailInfo ->
                            {
                                To = [userEmailInfo.EmailAddress]
                                ReplyTo = [];
                                Bcc = [];
                                Cc = [];
                                Body = emailTemplate.applyTemplate ()
                            })
                    |> TaskResult.map (fun message ->
                        // Return the ContactMessageCreatedFact.
                        {
                            JobContactCreatedEmailFact.ContactId = contact.Id
                            MessageId = deps.generateMessageId()
                            Message = message
                        })
                    |> TaskResult.map (fun fact ->
                        // Store the created message fact & send a command
                        [JobContactCreatedEmail fact], [JobCommand.SendContactMessage {JobId = job.Id; ContactId = contact.Id;}]
                    ))
        | SendContactMessage command ->
            taskResult {
                let! job = deps.getJob command.JobId
                let! contact = job.tryFindContact command.ContactId |> Option.either TaskResult.ok (fun _ -> TaskResult.error "There is no contact with the given id.")
                let! messageId =
                    match contact.MessageId with
                    | None -> TaskResult.error "There is no message associated with this contact."
                    | Some id ->
                        match contact.State with
                        | Failed _ -> TaskResult.ok id
                        | Contacting state when state.IsGeneratedMessage -> TaskResult.ok id
                        | _ -> TaskResult.error $"The contact is not in the expected state for sending a message. It is in state: {contact.State}"

                let fact =
                    match contact.ContactMethod with
                    | Email emailDetails ->
                        deps.enqueueEmail messageId
                        |> TaskResult.map (fun _ -> JobContactEmailStatusUpdated {ContactId = contact.Id; MessageId = messageId; State =  })

                return [JobFacts.JobContactEmailStatusUpdated]
            }


    type IProcessCommandsDeps =
        inherit IApplyJobDependencies
        abstract dequeueCommand: unit -> JobCommand Option
        abstract enqueueCommand: JobCommand -> TaskResult<unit, string>
        abstract storeFact: JobFact -> TaskResult<unit, string>
        abstract getFacts: unit -> JobFact list
        abstract clearFacts: unit -> unit

    let rec processCommands (deps: IProcessCommandsDeps) : TaskResult<unit, string> =
        match deps.dequeueCommand () with
        | None -> TaskResult.ok ()
        | Some command ->
            apply deps command
            >>= (fun (facts, commands) ->
                facts
                |> List.map deps.storeFact
                |> TaskResult.combine
                |> TaskResult.map (fun _ -> commands))
            >>= (fun commands ->
                commands
                |> List.map deps.enqueueCommand
                |> TaskResult.combine
                |> TaskResult.ignore)
            >>= (fun _ -> processCommands deps)
