module MusicalChairs.Api.Domain.Jobs.JobFacts

open System
open MusicalChairs.Api.Domain.Email
open MusicalChairs.Api.Domain.Job

type JobStartedFact =
    {
        UserId: Guid
        CreatorId: Guid
        Templates: Template List
        Positions: Position List
    }

type JobContactCreatedEmailMessageInfo =
    {
        Body: HtmlData
        To: EmailAddress list
        ReplyTo: EmailAddress list
        Bcc: EmailAddress list
        Cc: EmailAddress list
     }

type JobContactCreatedEmailFact =
    {
        ContactId: Guid
        MessageId: Guid
        Message: JobContactCreatedEmailMessageInfo
    }

type JobContactEmailStatusUpdatedFact =
    {
        ContactId: Guid
        MessageId: Guid
        State: ContactState
    }

type JobFact =
    | JobStarted of JobStartedFact
    | JobContactCreatedEmail of JobContactCreatedEmailFact
    | JobContactEmailStatusUpdated of JobContactEmailStatusUpdatedFact
