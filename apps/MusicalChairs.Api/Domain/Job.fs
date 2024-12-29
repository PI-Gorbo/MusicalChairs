namespace MusicalChairs.Api.Domain.Job

open System
open MusicalChairs.Api.Domain
open MusicalChairs.Api.Domain.Email
open MusicalChairs.Api.Domain.MessageEngine

// Contact Method
type EmailDetails = { EmailAddress: string }
type TemplateContactMethod = EmailTemplate of EmailTemplate
type ContactMethod = Email of EmailDetails

type Template =
    {
        TemplateId: Guid
        TemplateDetails: TemplateContactMethod
    }

// Planned Jobs
type PlannedContact =
    {
        Name: string
        UserId: Guid Option
        TemplateId: Guid
        ContactMethod: ContactMethod
    }

type PlannedPosition =
    {
        PositionName: string
        PositionsAvailable: uint
        Contacts: PlannedContact list
    }

type PlannedJob =
    {
        CreatorId: Guid
        Templates: Template list
        Positions: PlannedPosition list
    }

// Jobs
type ContactedOutcome =
    | Failed
    | ContactPassed
    | ContactConfirmed

type ContactingOutcome =
    | GeneratedMessage
    | Queued
    | PendingInteraction
    | ContactRequestedDelay of DelayUntil: DateTimeOffset
    | Delayed of DelayUntil: DateTimeOffset

type NotContactedReason =
    | NotActioned
    | PositionFilled

type ContactState =
    | NotContacted of NotContactedReason
    | Queued
    | Contacting of ContactingOutcome
    | Contacted of ContactedOutcome

type Contact =
    {
        ContactId: Guid
        UserId: Guid
        ContactMethod: ContactMethod
        State: ContactState
    }

type Position =
    {
        PositionId: Guid
        PositionName: string
        PositionsAvailable: uint
        Contacts: Contact list
    }

type JobState =
    | Started
    | Complete

type Job =
    {
        Id: Guid
        CreatorId: Guid
        Templates: Template list
        Positions: Position list
        JobState: JobState
    }

// Job Facts

type IJobFact =
    abstract member Id: Guid
type JobStartedFact =
    {
        UserId: Guid
        CreatorId: Guid
        Templates: Template List
        Positions: Position List
    }

type CreatedContactMessageFact =
    {
        ContactId: Guid
        MessageId: Guid
        Message: JobMessage
    }



type JobFact =
    | JobStarted of JobStartedFact
    | CreatedContactMessage of CreatedContactMessageFact
    | ContactMessageActioned of MessageFact

// Job Commands
type CreateContactMessageCommand = { ContactId: Guid; }

type JobCommand =
    | CreateContactMessage of CreateContactMessageCommand
    | SendContactMessage of SendContactMessageCommand
