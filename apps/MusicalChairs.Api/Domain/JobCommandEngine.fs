namespace MusicalChairs.Api.Domain.JobCommandEngine

open System
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open MusicalChairs.Api.Domain.Job

module JobCommandEngine =
    type JobCommandEngineResult =
        {
            Facts: IJobFact List
        }

    type IJobCommandEngineDeps =
        abstract member GetJob : Guid -> TaskResult<Job, unit>
        abstract member PublishMessage : INotification

    type StartContactCommandError =
        | JobNotFound
        | ContactNotFound

    let startContactCommand (deps: IJobCommandEngineDeps) (command: StartContactCommand)  : TaskResult<JobCommandEngineResult, StartContactCommandError> =
        // Get the contact details
        command.JobId
        |> deps.GetJob
        |> TaskResult.withError JobNotFound
        >>= (fun job ->
            // Find the contact
            let contact =
                job.Positions
                |> List.tryFind (fun pos -> pos.PositionId = command.PositionId)
                |> Option.map _.Contacts
                |> Option.bind (fun contacts -> contacts |> List.tryFind (fun contact -> contact.ContactId = command.ContactId))

            match contact with
                | None -> TaskResult.error ContactNotFound
                | Some contact -> TaskResult.ok contact
            )
        >>= (fun contact ->
            // Map the contact to a valid contact method & send communication along that method.
            // TODO : make more complex, but for now we are just going to take the fist contact method.
            let contactMethod = contact.ContactMethods.Head

            )


