namespace MusicalChairs.Api.Domain

open System
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open MusicalChairs.Api.Domain.Email
open MusicalChairs.Api.Domain.Job
open MusicalChairs.Api.Domain.Jobs.JobCommands
open MusicalChairs.Api.Domain.Jobs.JobFacts
open MusicalChairs.Api.Utilities
open NetTopologySuite.GeometriesGraph


// module JobDecisionEngine =
//
//     let tryFindContactables (position: Position) : Contact List Option =
//         // If the number of positions available is equal to the number of people currently contacted and not passed on, then
//         // we can find another person to contact.
//         let currentlyContacted =
//             position.Contacts
//             |> Seq.filter (fun x ->
//                 match x.State with
//                 | ContactState.Contacted outcome ->
//                     match outcome with
//                     | ContactConfirmed -> true
//                     | _ -> false
//                 | _ -> false)
//             |> Seq.length
//
//         let notYetContacted =
//             position.Contacts |> Seq.filter (fun x -> x.State.IsNotContacted)
//
//         if
//             currentlyContacted = int position.PositionsAvailable
//             || Seq.isEmpty notYetContacted
//         then
//             None
//         else
//             notYetContacted
//             |> Seq.take (int position.PositionsAvailable - currentlyContacted)
//             |> Seq.toList
//             |> Some
//
//     let generateNextContacts jobId (positions: Position List) : CreateContactMessageCommand List =
//         positions
//         |> List.choose (fun position -> // List.choose takes only Some values from the List<Option>
//             position
//             |> tryFindContactables // Find, for each position, if anyone is contactable.
//             |> Option.map (fun res -> (position, res)))
//         |> List.map (fun (position, contactables) ->
//             contactables
//             |> List.map (fun contact -> // Map all containable individuals to a start contact command.
//                 { ContactId = contact.ContactId }))
//         |> List.concat
//
//     type JobDecisions =
//         { Facts: JobFact List
//           Commands: JobCommand List }
//
//     type StartJobDto =
//         { JobId: Guid; Decisions: JobDecisions }
//
//     type IStartJobDependencies =
//         abstract generateGuid: Unit -> Guid
//         abstract createExternalUsers: PlannedContact list -> TaskResult<List<Guid>, string>
//
//     let StartJob (deps: IStartJobDependencies) userId (plannedJob: PlannedJob) : TaskResult<StartJobDto, string> =
//         taskResult {
//
//             let jobId = deps.generateGuid ()
//
//             // Collect all the unidentified contacts together
//             let unidentifiedContacts =
//                 plannedJob.Positions
//                 |> List.mapi (fun positionIndex position -> // Flatmap the Positions list to a list of (PositionIndex, ContactIndex, Contact)
//                     position.Contacts
//                     |> List.mapi (fun contactIndex contact -> (positionIndex, contactIndex, contact)))
//                 |> List.concat
//                 // Only take users that have no provided id
//                 |> List.filter (fun (positionIdx, contactIdx, plannedContact) -> plannedContact.UserId.IsNone)
//
//             // Identify the unidentified by creating user ids for them.
//             let! mappedContacts =
//                 unidentifiedContacts
//                 |> List.map (fun (_, _, pc) -> pc)
//                 |> deps.createExternalUsers
//
//             // Now we can create positions from planned positions.
//             // Create a new list of Contacts with the newly identified contacts.
//             let positions: Position List =
//                 mappedContacts
//                 |> List.mapi (fun index userId -> (userId, unidentifiedContacts[index]))
//                 |> List.groupBy (fun (_, (posIndex, _, _)) -> posIndex)
//                 |> List.map (fun (posIndex, contactsGroupedByPosition) ->
//                     { PositionId = deps.generateGuid ()
//                       PositionName = plannedJob.Positions[posIndex].PositionName
//                       PositionsAvailable = plannedJob.Positions[posIndex].PositionsAvailable
//                       Contacts =
//                         contactsGroupedByPosition
//                         |> List.sortBy (fun (_, (_, contactIdx, plannedContact)) -> contactIdx)
//                         |> List.map (fun (userId, (_, _, plannedContact)) ->
//                             { ContactId = deps.generateGuid ()
//                               UserId = userId
//                               ContactMethod = plannedContact.ContactMethod
//                               State = NotContacted NotActioned }) })
//
//             let nextContacts = generateNextContacts jobId positions
//
//             return
//                 { StartJobDto.JobId = jobId
//                   StartJobDto.Decisions =
//                     { Facts =
//                         [ JobStarted
//                               { UserId = userId
//                                 CreatorId = plannedJob.CreatorId
//                                 Templates = plannedJob.Templates
//                                 Positions = positions } ]
//                       Commands = nextContacts |> List.map (fun command -> CreateContactMessage command)
//
//                     } }
//         }
//
//     type IGenerateMessageForContactDependencies =
//         abstract generateMessage: Job -> Position -> Contact -> TaskResult<JobMessage, string>
//
//     type GenerateMessageForContactError =
//         | NoContactFound of ContactId: Guid
//         | FailedToGenerateMessage of ErrorMessage: string
//
//     let GenerateMessageForContact
//         (deps: IGenerateMessageForContactDependencies)
//         (job: Job)
//         (command: CreateContactMessageCommand)
//         : TaskResult<JobDecisions, GenerateMessageForContactError> =
//
//         // Get the contact
//         job.Positions
//         |> Seq.map (fun pos ->
//             pos.Contacts
//             |> Seq.ofList
//             |> Seq.tryFind (fun contact -> contact.ContactId = command.ContactId)
//             |> Option.map (fun contact -> pos, contact))
//         |> Seq.choose id
//         |> Seq.tryHead
//         // return an error result if the contact is not found.
//         |> Option.either (fun pair -> TaskResult.ok pair) (fun () ->
//             TaskResult.error (NoContactFound command.ContactId))
//         >>= fun (position, contact) ->
//             // Generate the message
//             deps.generateMessage job position contact
//             |> TaskResult.mapError FailedToGenerateMessage
//             |> TaskResult.map (fun jobMsg -> contact, jobMsg)
//         |> TaskResult.map (fun (contact, jobMsg) ->
//             { Facts =
//                 [ CreatedContactMessage
//                       { MessageId = jobMsg.GetId()
//                         ContactId = contact.ContactId
//                         Message = jobMsg } ]
//               Commands =
//                 [ match jobMsg with
//                   | JobMessage.Email emailMessage ->
//                       SendContactMessage(SendContactMessageCommand.Email emailMessage.Id) ] })


module JobDecisionEngine =
    type IApplyJobDependencies =
        abstract member getPlannedJob: Guid -> TaskResult<PlannedJob, string>
        abstract member deletePlannedJob: Guid -> TaskResult<unit, string>
        abstract member getJob: Guid -> TaskResult<Job, string>
        abstract member generateJobId: unit -> Guid
        abstract member generateContactId: unit -> Guid
        abstract member generatePositionId: unit -> Guid

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
                                  ContactId = contact.ContactId })

                    [ JobStarted jobStartedFact ], createContactMessageCommands))
        | CreateContactMessage contactMessageCommand -> failwith "todo"
        | SendContactMessage sendContactMessageCommand -> failwith "todo"


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
