namespace MusicalChairs.Api.Domain.Job

open System
open FsToolkit.ErrorHandling
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
        UserId: Guid
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
        Id: Guid
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
    | Contacting of ContactingOutcome
    | Contacted of ContactedOutcome

type Contact =
    {
        ContactId: Guid
        UserId: Guid
        TemplateId: Guid
        ContactMethod: ContactMethod
        State: ContactState
    }
    static member tryFromPlannedContact (generateId: unit -> Guid) (plannedContact: PlannedContact) : TaskResult<Contact, string> =
        TaskResult.ok {
            ContactId = generateId ()
            UserId = plannedContact.UserId
            State = ContactState.NotContacted NotContactedReason.NotActioned
            ContactMethod = plannedContact.ContactMethod
            TemplateId = plannedContact.TemplateId
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

