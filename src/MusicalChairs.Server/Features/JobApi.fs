module MusicalChairs.Server.Features.JobApi

open System
open System.Linq
open FsToolkit.ErrorHandling
open Marten
open MusicalChairs.Domain.Job
open MusicalChairs.Server.Utils.AuthUtils
open MusicalChairs.Shared.Apis.JobApi

type IJobApiDeps =
    inherit IAuthenticateDeps
    abstract getSession: unit -> IDocumentSession


let createJobApi (deps: IJobApiDeps) : IJobApi =
    { myJobs =
        fun _ ->
            asyncResult {
                let! userId = authenticate deps

                // Get all the draft jobs.
                let! draftJobs =
                    deps
                        .getSession()
                        .Query<DraftJob>()
                        .Where(fun job -> job.CreatorId = userId)
                        .Select(fun job ->
                            { DraftJobDto.id = job.Id
                              DraftJobDto.name = job.Name })
                        .ToListAsync()

                return
                    { activeJobs = []
                      draftJobs = draftJobs |> Seq.toList }
            }
      getJob = fun id -> failwith "Not Implemented"
      getDraftJob =
        fun id ->
            asyncResult {
                let! _ =
                    authenticate deps
                    |> AsyncResult.mapError (fun _ -> "Unauthorized")

                let session = deps.getSession ()

                return!
                    session
                        .Query<DraftJob>()
                        .Where(fun job -> job.Id = id)
                        .Select(fun job ->
                            { DraftJobDto.id = job.Id
                              name = job.Name })
                        .SingleOrDefaultAsync()
                    |> AsyncResult.ofTask
                    |> AsyncResult.mapError (fun _ -> $"Failed to fetch draft job with id {id}")
            }

      createDraft =
          fun _ ->
              asyncResult {
                  let session = deps.getSession ()

                  let! userId =
                      authenticate deps
                      |> AsyncResult.mapError (fun _ -> "Unauthorized")

                  let newDraft =
                      { DraftJob.Id = Guid.NewGuid()
                        Name = None
                        Positions = []
                        Templates = []
                        CreatorId = userId }

                  session.Store(newDraft)
                  do! session.SaveChangesAsync()

                  return
                      { id = newDraft.Id
                        name = newDraft.Name }

              }
      updateDraft = fun req -> failwith "Not Implemented"
      startJob = fun req -> failwith "Not Implemented" }
