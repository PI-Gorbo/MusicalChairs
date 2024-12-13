module MusicalChairs.Api.Tests.JobDecisionEngineTests

open System
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open MusicalChairs.Api.Domain
open MusicalChairs.Api.Domain.JobDecisionEngine
open MusicalChairs.Api.Domain.JobFactEngine
open Shouldly
open Xunit

type JobDecisionEngineTests() =

    let AlexUserId = Guid.NewGuid()

    let simpleJob: PlannedJob =
        {
            CreatorId = AlexUserId
            Templates =
                [
                    {
                        TemplateId = Guid.NewGuid()
                        TemplateDetails =
                            EmailTemplate
                                {
                                    TemplatedHtml = Raw "Testing {{testing}} 123"
                                    Schema = [ "testing" ]
                                }
                    }
                ]
            Positions =
                [
                    {
                        PositionName = "Tenor"
                        PositionsAvailable = uint 1
                        Contacts =
                            [
                                {
                                    UserId = None
                                    Name = "Alex Gorbatov"
                                    ContactMethods =
                                        [
                                            ContactMethod.Email { EmailAddress = "alex@gorbatov.com" }
                                        ]
                                }
                            ]
                    }
                ]
        }

    [<Fact>]
    member self.CanStartJob() =

        let startJobDeps = {
            new JobDecisionEngine.IStartJobDependencies with
                member this.createExternalUsers(plannedContacts) =
                    taskResult {
                        return
                            plannedContacts
                            |> List.map (fun contact ->
                                match contact.ContactMethods.Head with
                                | Email emailDetails ->
                                    if emailDetails.EmailAddress = "alex@gorbatov.com" then
                                        AlexUserId
                                    else
                                        Guid.NewGuid())
                    }
                member this.generateGuid() = Guid.NewGuid() }

        task {
            // Start the job
            let! startJobResult = JobDecisionEngine.StartJob startJobDeps AlexUserId simpleJob

            match startJobResult with
            | Error err -> startJobResult.IsOk.ShouldBeTrue(err)
            | Ok dto ->
                dto.JobId.ShouldNotBe(Guid.Empty)

                // Facts.
                let jobStartedFact = dto.Decisions.Events.Head.ShouldBeOfType<JobStartedFact>()
                jobStartedFact.UserId.ShouldBe(AlexUserId)
                jobStartedFact.CreatorId.ShouldBe(AlexUserId)
                jobStartedFact.Templates.Length.ShouldBe(1)
                jobStartedFact.Positions.Length.ShouldBe(1)

                let position = jobStartedFact.Positions[0]
                position.Contacts.Length.ShouldBe(1)

                // Commands.
                dto.Decisions.Commands.Length.ShouldBe(1)

                let startContactCommand =
                    dto.Decisions.Commands.Head.ShouldBeOfType<StartContactCommand>()

                startContactCommand.JobId.ShouldBe(dto.JobId)
                startContactCommand.PositionId.ShouldBe(jobStartedFact.Positions.Head.PositionId)
                startContactCommand.ContactId.ShouldBe(jobStartedFact.Positions.Head.Contacts.Head.ContactId)

                // Process the job started fact.
                let startedJobDeps =
                    { new JobFactEngine.IStartJobDeps with
                        member this.JobId() = dto.JobId
                    }
                let startedJob = JobFactEngine.startJob startedJobDeps jobStartedFact
                startedJob.Id.ShouldBe(dto.JobId)

        }

// [<Fact>]
// member self.JobUpdatesAfterSentEmail() =
//     let startJobDeps = StartJobDeps(AlexUserId)
//
//     task {
//         // Start the job
//         let! startJobResult = JobDecisionEngine.StartJob startJobDeps AlexUserId simpleJob
//         match startJobResult with
//         | Error err -> startJobResult.IsOk.ShouldBeTrue(err)
//         | Ok dto ->
//
//     }
