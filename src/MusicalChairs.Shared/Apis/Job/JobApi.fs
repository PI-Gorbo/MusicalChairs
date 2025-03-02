
module MusicalChairs.Shared.Apis.JobApi
open MusicalChairs.Shared.Apis.Email

open System


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
    positions:
}

type IJobApi = {
    myJobs: unit -> Async<Result<MyJobsResponse, unit>>
    createDraft: unit -> Async<Result<Guid, unit>>

}