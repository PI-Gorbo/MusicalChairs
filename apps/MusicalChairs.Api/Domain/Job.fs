namespace MusicalChairs.Api.Domain

open System

// Contact Method
type EmailDetails = { EmailAddress: string }
type ContactMethod = Email of EmailDetails
type TemplateStyle = Email of EmailTemplate

type Template =
    { TemplateId: Guid
      TemplateDetails: TemplateStyle }

// Planned Jobs
type PlannedContact =
    { Name: string
      UserId: Guid Option
      ContactMethods: ContactMethod list }

type PlannedPosition =
    { PositionName: string
      PositionsAvailable: uint
      Contacts: PlannedContact list }

type PlannedJob =
    { CreatorId: Guid
      Templates: Template list
      Positions: PlannedPosition list }

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
    { UserId: Guid
      ContactMethods: ContactMethod list
      State: ContactState }

type Position =
    { PositionName: string
      PositionsAvailable: uint
      Contacts: Contact list }

type JobState =
    | Started
    | Complete

type Job =
    { CreatorId: Guid
      Templates: Template list
      Positions: Position list
      JobState: JobState }

// Job Events
type IJobEvent = interface end

type JobStarted(userId: Guid, creatorId: Guid, templates: Template list, positions: Position list) =
    member _.UserId = userId
    member _.CreatorId = creatorId
    member _.Templates = templates
    member _.Positions = positions
    interface IJobEvent

// type JobContacted
