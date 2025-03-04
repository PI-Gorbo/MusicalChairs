module MusicalChairs.Shared.Apis.JobApi

open System
open MusicalChairs.Shared.Apis.Job
type ActiveJobDto = { id: Guid; name: string }

type DraftJobDto = { id: Guid; name: string option }

type MyJobsResponse =
    { activeJobs: ActiveJobDto list
      draftJobs: DraftJobDto list }

type UpdateJobDraftRequest =
    { id: Guid
      name: string Option
      templates: DraftTemplate list Option
      positions: DraftPosition list Option }

type IJobApi =
    { myJobs: unit -> Async<Result<MyJobsResponse, unit>>
      getJob: Guid -> Async<Result<ActiveJobDto, string>>
      getDraftJob: Guid -> Async<Result<DraftJobDto, string>>
      createDraft: unit -> Async<Result<DraftJobDto, string>>
      updateDraft: UpdateJobDraftRequest -> Async<Result<unit, string>>
      startJob: Guid -> Async<Result<unit, string>> }
