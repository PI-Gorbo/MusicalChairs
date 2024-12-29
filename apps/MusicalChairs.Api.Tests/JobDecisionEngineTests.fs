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

    // let AlexUserId = Guid.NewGuid()

    // let simpleJob: PlannedJob =
    //     { CreatorId = AlexUserId
    //       Templates =
    //         [ { TemplateId = Guid.NewGuid()
    //             TemplateDetails =
    //               EmailTemplate
    //                   { TemplatedHtml = Raw "Testing {{testing}} 123"
    //                     Schema = [ "testing" ] } } ]
    //       Positions =
    //         [ { PositionName = "Tenor"
    //             PositionsAvailable = uint 1
    //             Contacts =
    //               [ { UserId = None
    //                   Name = "Alex Gorbatov"
    //                   ContactMethod = ContactMethod.Email { EmailAddress = "alex@gorbatov.com" } } ] } ] }

    // [<Fact>]
    // member self.Sandbox() =
    //
    //     task {
    //         let startJobDeps =
    //             { new JobDecisionEngine.IStartJobDependencies with
    //                 member this.createExternalUsers(plannedContacts) =
    //                     taskResult {
    //                         return
    //                             plannedContacts
    //                             |> List.map (fun contact ->
    //                                 match contact.ContactMethod with
    //                                 | ContactMethod.Email emailDetails ->
    //                                     if emailDetails.EmailAddress = "alex@gorbatov.com" then
    //                                         AlexUserId
    //                                     else
    //                                         Guid.NewGuid())
    //                     }
    //
    //                 member this.generateGuid() = Guid.NewGuid() }
    //
    //         //// Start the job
    //         let! startJobResult =
    //             JobDecisionEngine.StartJob startJobDeps AlexUserId simpleJob
    //             |> Task.map (Result.valueOr failwith)
    //
    //         //// Assert
    //         startJobResult.JobId.ShouldNotBe(Guid.Empty)
    //
    //         // Facts.
    //         let jobStartedFact =
    //             startJobResult.Decisions.Facts.Head.ShouldBeOfType<JobStartedFact>()
    //
    //         jobStartedFact.UserId.ShouldBe(AlexUserId)
    //         jobStartedFact.CreatorId.ShouldBe(AlexUserId)
    //         jobStartedFact.Templates.Length.ShouldBe(1)
    //         jobStartedFact.Positions.Length.ShouldBe(1)
    //
    //         let position = jobStartedFact.Positions[0]
    //         position.Contacts.Length.ShouldBe(1)
    //
    //         // Commands.
    //         startJobResult.Decisions.Commands.Length.ShouldBe(1)
    //
    //         // Process the facts
    //         let startedJobDeps =
    //             { new JobFactEngine.IStartJobDeps with
    //                 member this.JobId() = startJobResult.JobId }
    //
    //         let! startedJob =
    //             JobFactEngine.start startedJobDeps jobStartedFact
    //             |> Task.map (Result.valueOr failwith)
    //
    //         startedJob.Id.ShouldBe(startJobResult.JobId)
    //         jobStartedFact.CreatorId.ShouldBeEquivalentTo(jobStartedFact.CreatorId)
    //         jobStartedFact.Templates.ShouldBeEquivalentTo(jobStartedFact.Templates)
    //         jobStartedFact.Positions.ShouldBeEquivalentTo(jobStartedFact.Positions)
    //
    //         // Process the create contact message command.
    //         let (CreateContactMessage command) = startJobResult.Decisions.Commands[0]
    //
    //         let messageId = Guid.NewGuid()
    //
    //         let message =
    //             { EmailMessage.Id = messageId
    //               Provider = EmailProvider.SendGrid
    //               Source = EmailSource.Contact(startedJob.Id, command.ContactId)
    //               State = EmailState.NotSent
    //               Body = Raw "AHHH"
    //               From = "sam.gorbatov@gmail.com"
    //               Recipients = [ "sam.gorbatov+test@gmail.com" ]
    //               ReplyTo = []
    //               Bcc = []
    //               Cc = [] }
    //
    //         let generateMessagesDeps =
    //             { new JobDecisionEngine.IGenerateMessageForContactDependencies with
    //                 member this.generateMessage job position contact =
    //                     TaskResult.ok (
    //                         match contact.ContactMethod with
    //                         | ContactMethod.Email emailDetails -> JobMessage.Email message
    //                     ) }
    //
    //         //// Generate email
    //         let! generateMessageDecisions =
    //             JobDecisionEngine.GenerateMessageForContact generateMessagesDeps startedJob command
    //             |> TaskResult.mapError _.ToString()
    //             |> Task.map (Result.valueOr failwith)
    //
    //         // Facts
    //         generateMessageDecisions.Facts.Length.ShouldBe(1)
    //
    //         generateMessageDecisions.Facts[0]
    //             .ShouldBeEquivalentTo(
    //                 JobFact.CreatedContactMessage
    //                     { ContactId = command.ContactId
    //                       MessageId = messageId
    //                       Message =
    //                         JobMessage.Email
    //                             { EmailMessage.Id = messageId
    //                               Provider = EmailProvider.SendGrid
    //                               Source = EmailSource.Contact(startedJob.Id, command.ContactId)
    //                               State = EmailState.NotSent
    //                               Body = Raw "AHHH"
    //                               From = "sam.gorbatov@gmail.com"
    //                               Recipients = [ "sam.gorbatov@gmail.com" ]
    //                               ReplyTo = []
    //                               Bcc = []
    //                               Cc = [] } }
    //             )
    //
    //         // Commands.
    //         generateMessageDecisions.Commands.Length.ShouldBe(1)
    //
    //         generateMessageDecisions.Commands[0]
    //             .ShouldBeEquivalentTo(JobCommand.SendContactMessage(SendContactMessageCommand.Email messageId))
    //
    //         let (SendContactMessage sendContactCommand) = generateMessageDecisions.Commands[0]
    //
    //         // Process the facts.
    //         let! generatedMessageJob =
    //             JobFactEngine.applyFact generateMessageDecisions.Facts[0] startedJob
    //             |> Task.map (Result.valueOr failwith)
    //
    //         generatedMessageJob.Id.ShouldBe(startedJob.Id)
    //         generatedMessageJob.Templates.ShouldBe(startedJob.Templates)
    //         generatedMessageJob.CreatorId.ShouldBe(startedJob.CreatorId)
    //         generatedMessageJob.JobState.ShouldBe(startedJob.JobState)
    //         generatedMessageJob.Positions.ShouldNotBeSameAs(startedJob.Positions)
    //         let generatedMessageJobChangedContact =
    //             generatedMessageJob.Positions
    //             |> Seq.map (_.Contacts)
    //             |> Seq.concat
    //             |> Seq.find (fun x -> x.ContactId = command.ContactId)
    //         match generatedMessageJobChangedContact.State with
    //             | Contacting contactingOutcome -> contactingOutcome.IsGeneratedMessage.ShouldBeTrue()
    //             | _ -> generatedMessageJobChangedContact.State.IsContacting.ShouldBeTrue()
    //
    //         // Process the Command
    //         let sendMessageDeps =
    //             { new MessageEngine.ISendMessageDependencies with
    //                 member this.getEmail(id) =
    //                     if id = messageId then
    //                         TaskResult.ok message
    //                     else
    //                         (TaskResult.error DatabaseError.FailedToContact)
    //
    //                 member this.sendEmail(email) = TaskResult.ok () }
    //
    //         let! sendMessageCommandDecision = MessageEngine.SendMessage sendMessageDeps sendContactCommand
    //         sendMessageCommandDecision.IsSent.ShouldBeTrue()
    //
    //         // Process the fact.
    //         let! sentMessageJob =
    //             JobFactEngine.applyFact sendMessageCommandDecision generatedMessageJob
    //
    //
    //
    //
    //
    //         return ()
    //
    //     }

    // type JobFact =



    [<Fact>]
    member self.Sandbox() =
        task {
            // Plan a job

            // C: Start the job
            // F: Started the job

            // C: Generate Contact Messages
            // F: Generated Contact Messages

            // C: Send Contact Messages
            // F: Sent & Waiting for response.
        }