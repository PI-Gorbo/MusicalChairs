namespace MusicalChairs.Api.Domain

open System
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open MusicalChairs.Api.Domain.Email
open MusicalChairs.Api.Domain.Job
open MusicalChairs.Api.Domain.Jobs.JobCommands
open MusicalChairs.Api.Domain.Jobs.JobFacts
open MusicalChairs.Api.Utilities

module JobDecisionEngine =
    type IApplyJobDependencies =
        abstract member generateJobId: unit -> Guid
        abstract member generateContactId: unit -> Guid
        abstract member generatePositionId: unit -> Guid
        abstract member generateMessageId: unit -> Guid

        abstract member getPlannedJob: Guid -> TaskResult<PlannedJob, string>
        abstract member deletePlannedJob: Guid -> TaskResult<unit, string>

        abstract member getJob: Guid -> TaskResult<Job, string>

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

            // Map the planned job to a Job Started Fact & Commands.
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
                deps.deletePlannedJob (command.PlannedJobId)
                |> TaskResult.map (fun _ -> decisions))
        | CreateContactMessage command ->
            deps.getJob command.JobId
            >>= (fun job ->
                // Find the contact.
                job.Positions
                |> Seq.map _.Contacts
                |> Seq.concat
                |> Seq.tryFind (fun contact -> contact.Id = command.ContactId)

                // validate the contact is in the correct state.
                |> function
                    | None -> TaskResult.error "There is no contact with the provided id."
                    | Some contact ->
                        match contact.State with
                        | NotContacted notContactedReason -> TaskResult.ok (job, contact)
                        | _ ->
                            TaskResult.error
                                "The contact must be in the Not Contacted state in order to generate a contact message.")

            // Generate the message from the template & contact.
            >>= (fun (job, contact) ->
                job.Templates
                |> List.tryFind (fun template -> template.TemplateId = contact.TemplateId)
                |> Option.either TaskResult.ok (fun _ -> TaskResult.error "There is no template with the provided id.")
                >>= fun template ->
                    match (template.TemplateDetails, contact.ContactMethod) with
                    | TemplateContactMethod.EmailTemplate template, ContactMethod.Email userEmailInfo ->
                        let messageInfo =
                            JobContactCreatedMessageInfo.Email
                                { To = [ userEmailInfo.EmailAddress ]
                                  ReplyTo = []
                                  Bcc = []
                                  Cc = []
                                  Body = template.applyTemplate(userEmailInfo) }
                        TaskResult.ok (
                            JobFact.JobContactCreatedMessage {
                                ContactId = contact.Id
                                MessageId = deps.generateMessageId()
                                Message = messageInfo
                            })
                    | _ -> TaskResult.error $"Template and contact method do not match for contact {contact.Id}")
                |> TaskResult.map (fun fact -> job, contact, fact)

            // Map to final Job Decisions
            >>= (fun (job, contact, fact) ->

                [fact], []

                )



        | SendContactMessage command -> failwith "todo"


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
