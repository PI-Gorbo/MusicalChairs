namespace MusicalChairs.Api.Domain.JobFactEngine

open System
open MusicalChairs.Api.Domain.Job

module JobFactEngine =

    type IStartJobDeps =
        abstract member JobId: Unit -> Guid

    let startJob (deps: IStartJobDeps) (fact: JobStartedFact) : Job =
        {
            Id = deps.JobId()
            CreatorId = fact.CreatorId
            Positions = fact.Positions
            Templates = fact.Templates
            JobState = JobState.Started
        }
