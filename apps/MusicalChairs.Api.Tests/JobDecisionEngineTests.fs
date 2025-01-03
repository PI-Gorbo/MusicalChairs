module MusicalChairs.Api.Tests.JobDecisionEngineTests

open System
open MusicalChairs.Api.Domain.Job
open MusicalChairs.Api.Domain.JobDecisionEngine
open MusicalChairs.Api.Domain.JobFactEngine
open MusicalChairs.Api.Domain.Jobs.JobCommands
open VerifyTests
open Argon
open FsToolkit.ErrorHandling
open MusicalChairs.Api.Domain.Email
open MusicalChairs.Api.Domain.Jobs.JobFacts
open Shouldly
open VerifyXunit
open Xunit

let verifySettings =
    let settings = VerifySettings()
    settings.UseDirectory("JobDecisionEngineTestsSnapshots")
    settings.DontIgnoreEmptyCollections()
    settings.AddExtraSettings(fun jsonSerializerSettings ->
        jsonSerializerSettings.AddFSharpConverters()
        jsonSerializerSettings.NullValueHandling <- NullValueHandling.Include
    )
    settings

type ProcessCommandDeps(jobId: Guid, plannedJob: PlannedJob, startJobCommand: StartJobCommand) =

    let mutable commands = [ StartJob startJobCommand ]
    let mutable facts = []
    let mutable job: Job Option = None
    let mutable deletePlannedJobCalled = false
    member val CommandsToProcess = 1 with get, set

    member self.getState() =
        {| Commands = commands
           Facts = facts
           Job = job
           DeletedPlannedJob = deletePlannedJobCalled |}

    interface IJobFactDeps with
        member this.getJobId() = jobId

    interface IProcessCommandsDeps with
        member this.dequeueCommand() =
            if this.CommandsToProcess <> 0 then
                this.CommandsToProcess <- this.CommandsToProcess - 1
                match commands with
                | [] -> None
                | [ item ] ->
                    commands <- []
                    Some item
                | head :: rest ->
                    commands <- rest
                    Some head
            else None

        member this.enqueueCommand cmd =
            commands <- commands @ [ cmd ]
            TaskResult.ok ()

        member this.storeFact fact =
            match job with
            | None ->
                match fact with
                | JobStarted fact -> JobFactEngine(this).applyFact fact
                | _ -> TaskResult.error "First fact stored should be a JobStarted fact."

            | Some job -> JobFactEngine(this).applyFact (fact, job)
            |> TaskResult.map (fun updatedJob ->
                facts <- facts @ [ fact ]
                job <- Some updatedJob)

        member this.getFacts() = facts

        member this.clearFacts() =
            facts <- []
            job <- None

        member this.getPlannedJob id = TaskResult.ok plannedJob

        member this.getJob id =
            match job with
            | None -> TaskResult.error "No job found"
            | Some job -> TaskResult.ok job

        member this.generateJobId() = Guid.CreateVersion7()

        member this.deletePlannedJob(var0) =
            deletePlannedJobCalled <- true
            TaskResult.ok ()

        member this.generateContactId() = Guid.NewGuid()
        member this.generatePositionId() = Guid.NewGuid()

type JobDecisionEngineTests() =

    let jobId = Guid.CreateVersion7()
    let alexUserId = Guid.CreateVersion7()
    let templateId = Guid.CreateVersion7()

    let plannedJob: PlannedJob =
        { Id = Guid.CreateVersion7()
          CreatorId = alexUserId
          Positions =
            [ { PositionName = "Tennor"
                PositionsAvailable = uint 1
                Contacts =
                  [ { TemplateId = templateId
                      Name = "Alex"
                      UserId = alexUserId
                      ContactMethod = ContactMethod.Email { EmailAddress = "a.j.gorbatov@gmail.com" } } ] } ]
          Templates =
            [ { TemplateId = templateId
                TemplateDetails =
                  TemplateContactMethod.EmailTemplate { TemplatedHtml = HtmlData.Raw "<html>{{Content}</html>" } } ] }

    let testProcessCommandDeps =
        ProcessCommandDeps(
            jobId,
            plannedJob,
            { UserId = alexUserId
              PlannedJobId = plannedJob.Id }
        )

    [<Fact>]
    let TestQueuedStartJobCommandButHaveNotProcessedIt () =
        task {
            // Enforce no commands are actually processed.
            testProcessCommandDeps.CommandsToProcess <- 0
            let! result = processCommands testProcessCommandDeps
            result.IsOk.ShouldBeTrue(
                result
                |> Result.either (fun _ -> "") (fun err -> err)
            )
            let jobState = testProcessCommandDeps.getState ()
            do! (Verifier.Verify (jobState, verifySettings)) .ToTask() |> Task.ignore
            return ()
        }

    [<Fact>]
    let TestProcessedStartJobCommand () =
        task {
            // Enforce no commands are actually processed.
            testProcessCommandDeps.CommandsToProcess <- 1
            let! result = processCommands testProcessCommandDeps
            result.IsOk.ShouldBeTrue(
                result
                |> Result.either (fun _ -> "") (fun err -> err)
            )
            let jobState = testProcessCommandDeps.getState ()
            do! (Verifier.Verify (jobState, verifySettings)) .ToTask() |> Task.ignore
            return ()
        }

    [<Fact>]
    let TestProcessedStartJobAndGenerateContactsCommand () =
        task {
            // Enforce no commands are actually processed.
            testProcessCommandDeps.CommandsToProcess <- -1
            let! result = processCommands testProcessCommandDeps
            result.IsOk.ShouldBeTrue(
                result
                |> Result.either (fun _ -> "") (fun err -> err)
            )
            let jobState = testProcessCommandDeps.getState ()
            do! (Verifier.Verify (jobState, verifySettings)) .ToTask() |> Task.ignore
            return ()
        }