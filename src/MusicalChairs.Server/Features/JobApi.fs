module MusicalChairs.Server.Features.JobApi

open System
open MusicalChairs.Shared.Apis.JobApi

type IJobApiDeps =
    abstract member getUserDtoById: Guid -> Async<unit>


let createJobApi (deps: IJobApiDeps) : IJobApi =
    { myJobs = failwith "todo"
      getJob = failwith "todo"
      createDraft = failwith "todo"
      updateDraft = failwith "todo"
      startJob = failwith "todo"
    }
