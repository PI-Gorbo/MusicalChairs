module MusicalChairs.Domain.Job

open System
open MusicalChairs.Domain.Email

// Contact Method
type EmailDetails = { EmailAddress: string }
type TemplateContactMethod = | EmailTemplate of EmailTemplate
type ContactMethod = | Email of EmailDetails

type Template =
    { TemplateId: Guid
      TemplateDetails: TemplateContactMethod }

// Planned Jobs
type DraftContact =
    { Name: string
      UserId: Guid
      TemplateId: Guid
      ContactMethod: ContactMethod }

type DraftPosition =
    { PositionName: string
      PositionsAvailable: uint
      Contacts: DraftContact list }

type DraftJob(
        Id,
        Name,
        CreatorId,
        Templates,
        Positions,
        CreatedAt,
        LastModifiedAt) =
      member val Id: Guid = Id with get, set
      member val Name: string option = Name with get, set
      member val CreatorId: Guid = CreatorId with  get, set
      member val Templates: Template list = Templates with get, set
      member val Positions: DraftPosition list = Positions with get, set
      member val CreatedAt: DateTimeOffset  = CreatedAt with get, set
      member val LastModifiedAt: DateTimeOffset = LastModifiedAt with get, set
      new() = DraftJob(Guid.Empty, None, Guid.Empty, [], [], DateTimeOffset.MinValue, DateTimeOffset.MinValue)

// Jobs
type ContactedOutcome =
    | ContactPassed
    | ContactConfirmed

type ContactingOutcome =
    | GeneratedMessage
    | Sent
    | PendingInteraction
    | ContactRequestedDelay of DelayUntil: DateTimeOffset
    | Delayed of DelayUntil: DateTimeOffset

type NotContactedReason =
    | NotActioned
    | PositionFilled

type ContactState =
    | NotContacted of NotContactedReason
    | Contacting of ContactingOutcome
    | Failed of failureReason: string
    | Contacted of ContactedOutcome

type Contact =
    { Id: Guid
      UserId: Guid
      TemplateId: Guid
      MessageId: Guid Option
      ContactMethod: ContactMethod
      State: ContactState }

    static member tryFromPlannedContact
        (generateId: unit -> Guid)
        (plannedContact: DraftContact)
        : Result<Contact, string> =
        Ok
            { Id = generateId ()
              UserId = plannedContact.UserId
              State = ContactState.NotContacted NotContactedReason.NotActioned
              ContactMethod = plannedContact.ContactMethod
              TemplateId = plannedContact.TemplateId
              MessageId = None }

type Position =
    { PositionId: Guid
      PositionName: string
      PositionsAvailable: uint
      Contacts: Contact list }

type JobState =
    | Started
    | Complete

[<CLIMutable>]
type Job =
    { Id: Guid
      CreatorId: Guid
      Templates: Template list
      Positions: Position list
      JobState: JobState }

    member self.tryFindContact contactId =
        self.Positions
        |> Seq.map _.Contacts
        |> Seq.concat
        |> Seq.tryFind (fun contact -> contact.Id = contactId)

    member self.tryFindContactByMessageId messageId =
        self.Positions
        |> Seq.map _.Contacts
        |> Seq.concat
        |> Seq.tryFind
               (fun contact ->
                    match contact.MessageId with
                    | None -> false
                    | Some value -> value = messageId)

    member self.mapContacts mapper =
        { self with
            Positions =
                self.Positions
                |> List.map (fun pos ->
                    { pos with
                        Contacts =
                            pos.Contacts
                            |> List.map mapper }) }