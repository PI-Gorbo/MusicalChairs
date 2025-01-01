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
        Provider: EmailProvider
        Source: EmailSource
        Body: HtmlData
        From: EmailAddress
        Recipients: EmailAddress list
        ReplyTo: EmailAddress list
        Bcc: EmailAddress list
        Cc: EmailAddress list
     }

type JobContactCreatedMessageInfo =
    | Email of JobContactCreatedEmailMessageInfo

type JobContactMessageCreatedFact =
    {
        ContactId: Guid
        MessageId: Guid
        Message: JobContactCreatedMessageInfo
    }

type JobContactActionedState =
    | Email of EmailState

type JobContactActionedMessageFact =
    {
        ContactId: Guid
        MessageId: Guid
        State: JobContactActionedState
    }

type JobFact =
    | JobStarted of JobStartedFact
    | JobContactCreatedMessage of JobContactMessageCreatedFact
    | JobContactActionedMessage of JobContactActionedMessageFact
