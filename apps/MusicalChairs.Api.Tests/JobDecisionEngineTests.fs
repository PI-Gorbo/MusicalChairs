module MusicalChairs.Api.Tests.JobDecisionEngineTests

open System
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open MusicalChairs.Api.Domain
open MusicalChairs.Api.Domain.Email
open MusicalChairs.Api.Domain.Job
open MusicalChairs.Api.Utilities.GenericErrors
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
                                    ContactMethod = ContactMethod.Email { EmailAddress = "alex@gorbatov.com" }
                                }
                            ]
                    }
                ]
        }

    [<Fact>]
    member self.CanStartJob() =

        let startJobDeps =
            { new JobDecisionEngine.IStartJobDependencies with
                member this.createExternalUsers(plannedContacts) =
                    taskResult {
                        return
                            plannedContacts
                            |> List.map (fun contact ->
                                match contact.ContactMethod with
                                | ContactMethod.Email emailDetails ->
                                    if emailDetails.EmailAddress = "alex@gorbatov.com" then
                                        AlexUserId
                                    else
                                        Guid.NewGuid())
                    }

                member this.generateGuid() = Guid.NewGuid()
            }

        task {
            //// Start the job
            let! startJobResult =
                JobDecisionEngine.StartJob startJobDeps AlexUserId simpleJob
                |> Task.map (Result.valueOr failwith )

            //// Assert
            startJobResult.JobId.ShouldNotBe(Guid.Empty)

            // Facts.
            let jobStartedFact = startJobResult.Decisions.Facts.Head.ShouldBeOfType<JobStartedFact>()
            jobStartedFact.UserId.ShouldBe(AlexUserId)
            jobStartedFact.CreatorId.ShouldBe(AlexUserId)
            jobStartedFact.Templates.Length.ShouldBe(1)
            jobStartedFact.Positions.Length.ShouldBe(1)

            let position = jobStartedFact.Positions[0]
            position.Contacts.Length.ShouldBe(1)

            // Commands.
            startJobResult.Decisions.Commands.Length.ShouldBe(1)
            let startContactCommand =
                match startJobResult.Decisions.Commands[0] with
                | CreateContactMessage enqueueContactCommand ->
                    enqueueContactCommand.ContactId.ShouldBe(jobStartedFact.Positions.Head.Contacts.Head.ContactId)
                | _ -> failwith "Expected first command to be a start combat command."


            let! startedJob, commands =



                // Process the job started fact.
                let startedJobDeps =
                    { new JobFactEngine.IStartJobDeps with
                        member this.JobId() = startJobResult.JobId
                    }
                task {
                    let! startedJobResult = JobFactEngine.start startedJobDeps jobStartedFact
                    match startedJobResult with
                    | Ok startedJob ->
                        startedJob.Id.ShouldBe(startJobResult.JobId)
                        jobStartedFact.CreatorId.ShouldBeEquivalentTo(jobStartedFact.CreatorId)
                        jobStartedFact.Templates.ShouldBeEquivalentTo(jobStartedFact.Templates)
                        jobStartedFact.Positions.ShouldBeEquivalentTo(jobStartedFact.Positions)
                        return startedJob, startJobResult.Decisions.Commands
                    | Error errorValue ->
                        return failwith $"Expected result to be Ok. Error was: {errorValue}"
                }

            // Process the commands.
            let (CreateContactMessage command) = commands[0]
            let messageId = Guid.NewGuid()
            let message =
                {
                    EmailMessage.Id = messageId
                    Provider = EmailProvider.SendGrid
                    Source = EmailSource.Contact(startedJob.Id, command.ContactId)
                    State = EmailState.NotSent
                    Body = Raw "AHHH"
                    From = "sam.gorbatov@gmail.com"
                    Recipients = [ "sam.gorbatov+test@gmail.com" ]
                    ReplyTo = []
                    Bcc = []
                    Cc = []
                }

            let generateMessagesDeps =
                { new JobDecisionEngine.IGenerateMessageForContactDependencies with
                    member this.generateMessage job position contact =
                        TaskResult.ok (
                            match contact.ContactMethod with
                            | ContactMethod.Email emailDetails ->
                                JobMessage.Email message
                        )
                }

            // Generate email
            let! generateMessagesResult =
                JobDecisionEngine.GenerateMessageForContact generateMessagesDeps startedJob command

            let! result =
                JobDecisionEngine.GenerateMessageForContact generateMessagesDeps startedJob command
                |> TaskResult.mapError _.ToString()
                >>= fun decisions ->
                        decisions.Facts.Length.ShouldBe(1)

                        decisions
                            .Facts[ 0 ]
                            .ShouldBeEquivalentTo(
                                JobFact.CreatedContactMessage
                                    {
                                        ContactId = command.ContactId
                                        MessageId = messageId
                                        Message =
                                            JobMessage.Email
                                                {
                                                    EmailMessage.Id = messageId
                                                    Provider = EmailProvider.SendGrid
                                                    Source = EmailSource.Contact(startedJob.Id, command.ContactId)
                                                    State = EmailState.NotSent
                                                    Body = Raw "AHHH"
                                                    From = "sam.gorbatov@gmail.com"
                                                    Recipients = [ "sam.gorbatov@gmail.com" ]
                                                    ReplyTo = []
                                                    Bcc = []
                                                    Cc = []
                                                }
                                    }
                            )

                        decisions.Commands.Length.ShouldBe(1)

                        decisions
                            .Commands[ 0 ]
                            .ShouldBeEquivalentTo(
                                JobCommand.SendContactMessage(SendContactMessageCommand.Email messageId)
                            )


                        TaskResult.ok (decisions.Facts[0], decisions.Commands[0])
                >>= fun (fact, command) ->
                        JobFactEngine.apply fact startedJob
                        |> TaskResult.map (fun job -> (job ,command))
                >>= fun (_, JobCommand.SendContactMessage command) ->
                        let sendMessageDeps =
                            {
                                new MessageEngine.ISendMessageDependencies with
                                    member this.getEmail(id) =
                                        if id = messageId then TaskResult.ok message else (TaskResult.error DatabaseError.FailedToContact)
                                    member this.sendEmail(email) = TaskResult.ok ()

                            }

                        MessageEngine.SendMessage sendMessageDeps command
                        |> TaskResult.ofTask
                // Use the fact engine to process the created contact message fact.





            return ()

        }
