
module MusicalChairs.Shared.JobApi

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

type IJobApi = {
    myJobs: unit -> Async<Result<MyJobsResponse, unit>>
}