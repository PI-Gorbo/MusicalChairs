namespace MusicalChairs.Api.Domain

open System
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open MusicalChairs.Api.Domain.Job

module JobFactEngine =

    type IStartJobDeps =
        abstract member JobId: Unit -> Guid

    let start (deps: IStartJobDeps) (fact: JobStartedFact) : TaskResult<Job, string> =
        TaskResult.ok
            { Id = deps.JobId()
              CreatorId = fact.CreatorId
              Positions = fact.Positions
              Templates = fact.Templates
              JobState = JobState.Started }

    let applyFact (fact: JobFact) (job: Job) : TaskResult<Job, string> =
        match fact with
        | JobStarted _ ->
            failwith
                "This is a developer error. Cannot use apply method with the JobStarted fact as there is no job to apply the update to."
        | CreatedContactMessage messageGeneratedForContactFact ->
            TaskResult.ok
                { job with
                    Positions =
                        job.Positions
                        |> List.map (fun pos ->
                            { pos with
                                Contacts =
                                    pos.Contacts
                                    |> List.map (fun contact ->
                                        if contact.ContactId = messageGeneratedForContactFact.ContactId then
                                            { contact with
                                                State = ContactState.Contacting ContactingOutcome.GeneratedMessage }
                                        else
                                            contact) }) }

    let applyFacts (job: Job) (facts: JobFact seq) : TaskResult<Job, string> =
        facts |> Seq.fold (fun seed fact -> seed >>= applyFact fact) (TaskResult.ok job)
