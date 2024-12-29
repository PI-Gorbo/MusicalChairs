namespace MusicalChairs.Api.Domain

open System
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open MusicalChairs.Api.Domain.Email
open MusicalChairs.Api.Domain.Job

module JobDecisionEngineV2 =
    let jobId = Guid.CreateVersion7()
    let alexUserId = Guid.CreateVersion7()
    let templateId = Guid.CreateVersion7()
    let plannedJob: PlannedJob =
        { CreatorId = alexUserId
          Positions =
            [ { PositionName = "Tennor"
                PositionsAvailable = uint 1
                Contacts =
                  [ { TemplateId = templateId
                      Name = "Alex"
                      UserId = Some alexUserId
                      ContactMethod = ContactMethod.Email { EmailAddress = "a.j.gorbatov@gmail.com" } } ] } ]
          Templates =
            [ { TemplateId = templateId
                TemplateDetails =
                  TemplateContactMethod.EmailTemplate { TemplatedHtml = HtmlData.Raw "<html>{{Content}</html>" } } ] }

    type JobDecisions = JobFact list * JobCommand list

    let startJob (plannedJob: PlannedJob) : TaskResult<(JobStartedFact * JobCommand list), string> =
        failwith "Not Implemented"

    let apply (job: Job) (command: JobCommand) : TaskResult<JobDecisions, string> = failwith "Ahh"

    type IProcessCommandsDeps =
        abstract dequeueCommand: unit -> JobCommand Option
        abstract enqueueCommand: JobCommand -> TaskResult<unit, string>
        abstract storeFact: JobFact -> TaskResult<unit, string>

    let rec processCommands (deps: IProcessCommandsDeps) (job: Job) : TaskResult<unit, string> =
        match deps.dequeueCommand() with
        | None -> TaskResult.ok ()
        | Some command ->
            apply job command
            >>= (fun (facts, commands) ->
                facts
                |> List.map deps.storeFact
                |> List.fold (fun seed item -> seed >>= (fun _ -> item)) (TaskResult.ok ())
                |> TaskResult.map (fun _ -> commands)
            )
            >>= (fun (commands) ->
                commands
                |> List.map (deps.enqueueCommand)
                |> List.fold (fun seed item -> seed >>= (fun _ -> item)) (TaskResult.ok ())
            )
            >>= (fun _ -> processCommands deps job)

    type ProcessCommandDeps() =

        let mutable commands = []
        let mutable facts = []

        interface IProcessCommandsDeps with
            member this.dequeueCommand () = List.tryHead commands
            member this.enqueueCommand cmd =
                commands <- commands @ [cmd]
                TaskResult.ok ()
            member this.storeFact fact =
                facts <- facts @ [fact]
                TaskResult.ok ()


    let sandbox () =
        taskResult {
            let! job, commands =
                startJob plannedJob
                >>= fun (startJobFact, startContactCommands) ->
                    let startJobDeps =
                        { new JobFactEngine.IStartJobDeps with
                            member this.JobId() = jobId }

                    JobFactEngine.start startJobDeps startJobFact
                    |> TaskResult.map (fun job -> (job, startContactCommands))

            let processCommandsDeps =
                {


                    new IProcessCommandsDeps with
                        member this.dequeueCommand() =
                        member this.enqueueCommand() =
                        member this.storeFact() =

                }
        }









    // let queue = []
    // let enqueue (command: JobCommand) = queue @ [command]
    // let dequeue () = queue |> List.tryHead
    //
    //
    // let rec processCommands (job: Job) : TaskResult<Job * JobFact list * JobCommand list, string> =
    //     match dequeueCommand() with
    //     | None -> TaskResult.ok (job, [], [])  // No more commands to process
    //     | Some command ->
    //         taskResult {
    //             let! newFacts, newCommands = apply job command
    //             storeFact newFacts
    //             // Add new commands to the queue for further processing
    //             newCommands |> List.iter enqueueCommand
    //             return! processCommands job  // Continue processing with the next command
    //         }
    //
    //
    //
    // let sandBox () =
    //
    //
    //
    //
    //
    //
    //
    //

    //     >>= fun (job, startContactCommands) ->
    //         // Apply all the commands and collect the results.
    //         startContactCommands
    //         |> List.fold
    //             (fun seed command ->
    //                 seed
    //                 >>= fun (facts, commands) ->
    //                     taskResult {
    //                         let! newFacts, newCommands = apply job command
    //                         return facts @ newFacts, commands @ newCommands
    //                     })
    //             (TaskResult.ok (List.empty, List.Empty))
    //         |> TaskResult.map (fun (facts, commands) -> job, facts, commands)
    //     >>= fun (job, facts, commands) ->
    //         JobFactEngine.applyFacts job facts
    //         |> TaskResult.map (fun newJob -> newJob, commands)
    //     >>= fun (job, commands) ->
    //         // Apply commands again.
    //
    //
    //
    //
    //
    //
    //     ()
