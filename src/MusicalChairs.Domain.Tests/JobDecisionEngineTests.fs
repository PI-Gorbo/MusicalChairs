module MusicalChairs.Domain.Tests.JobDecisionEngineTests

open System
open MusicalChairs.Domain.Job
open MusicalChairs.Domain.JobDecisionEngine
open MusicalChairs.Domain.JobFactEngine
open MusicalChairs.Domain.JobCommands
open VerifyTests
open Argon
open FsToolkit.ErrorHandling
open MusicalChairs.Domain.Email
open MusicalChairs.Domain.Jobs.JobFacts
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

type ProcessCommandDeps(jobId: Guid, plannedJob: DraftJob, startJobCommand: StartJobCommand) =

    let mutable commands = [ StartJob startJobCommand ]
    let mutable facts = []
    let mutable job: Job Option = None
    let mutable deletePlannedJobCalled = false
    member val CommandsToProcess = 1 with get, set
    member val CommandsProcessed = 0 with get, set
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
                this.CommandsProcessed <- this.CommandsProcessed + 1
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
                | JobStarted fact ->
                    JobFactEngine(this).applyFact fact
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
        member this.generateMessageId () = Guid.NewGuid()
        member this.enqueueEmail emailId =
            // Mock the email sending by just enqueing a fact.
            let contact =
                job
                |> function
                    | Some job -> job.tryFindContactByMessageId emailId
                    | None -> failwith "Job should be some."
                |> function
                    | Some contact -> contact
                    | None -> failwith "Contact should be some."

            (this :> IProcessCommandsDeps).storeFact (JobFact.JobContactEmailStatusUpdated {ContactId = contact.Id; MessageId = emailId; State = ContactState.Contacting ContactingOutcome.Sent})

type JobDecisionEngineTests() =

    let jobId = Guid.CreateVersion7()
    let alexUserId = Guid.CreateVersion7()
    let templateId = Guid.CreateVersion7()

    let plannedJob: DraftJob =
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
    let TestProcessedStartJobCommandAndQueuedGenerateMessageCommand () =
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
    let TestProcessedGenerateMessageCommandAndQueuedSendMessage () =
        task {
            // Enforce no commands are actually processed.
            testProcessCommandDeps.CommandsToProcess <- 2
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
    let TestSentFirstMessage () =
        task {
            // Enforce no commands are actually processed.
            testProcessCommandDeps.CommandsToProcess <- 3
            let! result = processCommands testProcessCommandDeps
            result.IsOk.ShouldBeTrue(
                result
                |> Result.either (fun _ -> "") (fun err -> err)
            )
            let jobState = testProcessCommandDeps.getState ()
            do! (Verifier.Verify (jobState, verifySettings)) .ToTask() |> Task.ignore
            return ()
        }