
module MusicalChairs.Shared.Apis.JobApi

open System
open MusicalChairs.Shared.Apis.Job


type ActiveJobDto = {
    id: Guid
}

type DraftJobDto = {
    id: Guid
}

type MyJobsResponse = {
    activeJobs: ActiveJobDto list
    draftJobs: DraftJobDto list
}

type UpdateJobDraftRequest = {
    id: Guid
    name: string Option
    templates: DraftTemplate list Option
    positions: DraftPosition list Option
}

type GetJobResponse =
    | Draft of DraftJobDto
    | Active of ActiveJobDto

type IJobApi = {
    myJobs: unit -> Async<Result<MyJobsResponse, unit>>
    getJob: Guid -> Async<Result<GetJobResponse, string>>
    createDraft: unit -> Async<Result<Guid, string>>
    updateDraft: UpdateJobDraftRequest -> Async<Result<unit, string>>
    startJob: Guid -> Async<Result<unit, string>>
}