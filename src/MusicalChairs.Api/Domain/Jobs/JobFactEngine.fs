namespace MusicalChairs.Api.Domain

open System
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open MusicalChairs.Api.Domain.Job
open MusicalChairs.Api.Domain.Jobs.JobFacts

module JobFactEngine =
    type IJobFactDeps =
        abstract member getJobId: Unit -> Guid

    type JobFactEngine(deps: IJobFactDeps) =
        member this.applyFact(fact: JobStartedFact) : TaskResult<Job, string> =
            TaskResult.ok
                { Id = deps.getJobId ()
                  CreatorId = fact.CreatorId
                  Positions = fact.Positions
                  Templates = fact.Templates
                  JobState = JobState.Started }

        member this.applyFact(fact: JobFact, job: Job) : TaskResult<Job, string> =
            match fact with
            | JobStarted _ -> TaskResult.error "Job has already been started."
            | JobContactCreatedEmail fact ->
                TaskResult.ok (
                    job.mapContacts (fun contact ->
                        if contact.Id = fact.ContactId then
                            { contact with
                                MessageId = Some fact.ContactId
                                State = ContactState.Contacting ContactingOutcome.GeneratedMessage }
                        else
                            contact)
                )
            | JobContactEmailStatusUpdated fact ->
                TaskResult.ok (
                    job.mapContacts (fun contact ->
                        if contact.Id = fact.ContactId then
                            { contact with State = fact.State }
                        else
                            contact)
                )

        member this.applyFacts (job: Job) (facts: JobFact seq) : TaskResult<Job, string> =
            facts
            |> Seq.fold
                (fun acc fact ->
                    acc
                    >>= fun accumulatedJob -> this.applyFact (fact, accumulatedJob))
                (TaskResult.ok job)
