module MusicalChairs.Shared.Apis.Job

open System
open MusicalChairs.Shared.Apis.Email

type EmailDetails = { EmailAddress: string }
type TemplateContent = Email of EmailTemplate

type DraftTemplate =
    { name: string
      content: TemplateContent }

type ContactMethod = Email of EmailDetails

type DraftContact =
    { Name: string
      UserId: Guid
      TemplateId: Guid
      ContactMethod: ContactMethod }

type DraftPosition =
    { PositionName: string
      PositionsAvailable: uint
      Contacts: DraftContact list }
