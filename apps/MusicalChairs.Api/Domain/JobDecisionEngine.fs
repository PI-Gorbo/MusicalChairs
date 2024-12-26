namespace MusicalChairs.Api.Domain

open System

open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open MusicalChairs.Api.Domain.Job
open MusicalChairs.Api.Domain.MessageEngine

module JobDecisionEngine =

    let tryFindContactables (position: Position) : Contact List Option =
        // If the number of positions available is equal to the number of people currently contacted and not passed on, then
        // we can find another person to contact.
        let currentlyContacted =
            position.Contacts
            |> Seq.filter (fun x ->
                match x.State with
                | ContactState.Contacted outcome ->
                    match outcome with
                    | ContactConfirmed -> true
                    | _ -> false
                | _ -> false)
            |> Seq.length

        let notYetContacted =
            position.Contacts
            |> Seq.filter (fun x -> x.State.IsNotContacted)

        if currentlyContacted = int position.PositionsAvailable
           || Seq.isEmpty notYetContacted then
            None
        else
            notYetContacted
            |> Seq.take (
                int position.PositionsAvailable
                - currentlyContacted
            )
            |> Seq.toList
            |> Some

    let generateNextContacts jobId (positions: Position List) : CreateContactMessageCommand List =
        positions
        |> List.choose (fun position -> // List.choose takes only Some values from the List<Option>
            position
            |> tryFindContactables // Find, for each position, if anyone is contactable.
            |> Option.map (fun res -> (position, res)))
        |> List.map (fun (position, contactables) ->
            contactables
            |> List.map (fun contact -> // Map all containable individuals to a start contact command.
                { ContactId = contact.ContactId }))
        |> List.concat

    type JobDecisions =
        {
            Facts: JobFact List
            Commands: JobCommand List
        }

    type StartJobDto =
        {
            JobId: Guid
            Decisions: JobDecisions
        }

    type IStartJobDependencies =
        abstract generateGuid: Unit -> Guid
        abstract createExternalUsers: PlannedContact list -> TaskResult<List<Guid>, string>

    let StartJob (deps: IStartJobDependencies) userId (plannedJob: PlannedJob) : TaskResult<StartJobDto, string> =
        taskResult {

            let jobId = deps.generateGuid ()

            // Collect all the unidentified contacts together
            let unidentifiedContacts =
                plannedJob.Positions
                |> List.mapi (fun positionIndex position -> // Flatmap the Positions list to a list of (PositionIndex, ContactIndex, Contact)
                    position.Contacts
                    |> List.mapi (fun contactIndex contact -> (positionIndex, contactIndex, contact)))
                |> List.concat
                // Only take users that have no provided id
                |> List.filter (fun (positionIdx, contactIdx, plannedContact) -> plannedContact.UserId.IsNone)

            // Identify the unidentified by creating user ids for them.
            let! mappedContacts =
                unidentifiedContacts
                |> List.map (fun (_, _, pc) -> pc)
                |> deps.createExternalUsers

            // Now we can create positions from planned positions.
            // Create a new list of Contacts with the newly identified contacts.
            let positions: Position List =
                mappedContacts
                |> List.mapi (fun index userId -> (userId, unidentifiedContacts[index]))
                |> List.groupBy (fun (_, (posIndex, _, _)) -> posIndex)
                |> List.map (fun (posIndex, contactsGroupedByPosition) ->
                    {
                        PositionId = deps.generateGuid ()
                        PositionName = plannedJob.Positions[posIndex].PositionName
                        PositionsAvailable = plannedJob.Positions[posIndex].PositionsAvailable
                        Contacts =
                            contactsGroupedByPosition
                            |> List.sortBy (fun (_, (_, contactIdx, plannedContact)) -> contactIdx)
                            |> List.map (fun (userId, (_, _, plannedContact)) ->
                                {
                                    ContactId = deps.generateGuid ()
                                    UserId = userId
                                    ContactMethod = plannedContact.ContactMethod
                                    State = NotContacted NotActioned
                                })
                    })

            let nextContacts = generateNextContacts jobId positions

            return
                {
                    StartJobDto.JobId = jobId
                    StartJobDto.Decisions =
                        {
                            Facts =
                                [
                                    JobStarted
                                        {
                                            UserId = userId
                                            CreatorId = plannedJob.CreatorId
                                            Templates = plannedJob.Templates
                                            Positions = positions
                                        }
                                ]
                            Commands =
                                nextContacts
                                |> List.map (fun command -> CreateContactMessage command)

                        }
                }
        }

    type IGenerateMessageForContactDependencies =
        abstract generateMessage: Job -> Position -> Contact -> TaskResult<JobMessage, string>

    type GenerateMessageForContactError =
        | NoContactFound of ContactId: Guid
        | FailedToGenerateMessage of ErrorMessage: string

    let GenerateMessageForContact
        (deps: IGenerateMessageForContactDependencies)
        (job: Job)
        (command: CreateContactMessageCommand)
        : TaskResult<JobDecisions, GenerateMessageForContactError> =

        // Get the contact
        job.Positions
        |> Seq.map (fun pos ->
            pos.Contacts
            |> Seq.ofList
            |> Seq.tryFind (fun contact -> contact.ContactId = command.ContactId)
            |> Option.map (fun contact -> pos, contact))
        |> Seq.choose id
        |> Seq.tryHead
        // return an error result if the contact is not found.
        |> Option.either
            (fun pair -> TaskResult.ok pair)
            (fun () -> TaskResult.error (NoContactFound command.ContactId))
        >>= fun (position, contact) ->
                // Generate the message
                deps.generateMessage job position contact
                |> TaskResult.mapError FailedToGenerateMessage
                |> TaskResult.map (fun jobMsg -> contact, jobMsg)
        |> TaskResult.map (fun (contact, jobMsg) ->
            {
                Facts =
                    [
                        CreatedContactMessage
                            {
                                MessageId = jobMsg.GetId()
                                ContactId = contact.ContactId
                                Message = jobMsg
                            }
                    ]
                Commands =
                    [
                        match jobMsg with
                        | JobMessage.Email emailMessage ->
                            SendContactMessage(SendContactMessageCommand.Email emailMessage.Id)
                    ]
            })

