namespace MusicalChairs.Api.Domain.Job

open System
open MusicalChairs.Api.Domain.Email

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
        ContactMethods: ContactMethod list
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
type ContactOutcome =
    | Failed
    | PendingContactResponse
    | ContactRequestedDelay of DelayUntil: DateTimeOffset
    | Delayed of DelayUntil: DateTimeOffset
    | ContactPassed
    | ContactConfirmed

type ContactState =
    | NotContacted
    | JobCompletedBeforeContact
    | Contacted of ContactOutcome

type Contact =
    {
        ContactId: Guid
        UserId: Guid
        ContactMethods: ContactMethod list
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
    interface
    end

type JobStartedFact =
    {
        UserId: Guid
        CreatorId: Guid
        Templates: Template List
        Positions: Position List
    }
    interface IJobFact


// Job Commands
type IJobCommand =
    interface
    end

type StartContactCommand =
    {
        JobId: Guid
        PositionId: Guid
        ContactId: Guid
    }
    interface IJobCommand
