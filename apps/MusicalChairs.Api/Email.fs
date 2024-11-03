namespace MusicalChairs.Api

open System

type HtmlTemplate = HtmlData

type HtmlData =
    | Raw of string
    | Reference of bucketReference: string

type Email = string

type EmailSource =
    | Callout of CalloutId: Guid * ContactId: Guid
    | ConfirmEmail of UserId: Guid
    | ResetPassword of UserId: Guid

type EmailProvider = | SendGrid

type ClickLinkInfo = { Url: string; UrlIndex: uint }

type EmailInteraction =
    | Opened
    | Clicked of ClickLinkInfo

type EmailState =
    | NotSent
    | Queued
    | DeliveredToProvider
    | Dropped of Reason: string
    | Bounced of Reason: string
    | DeliveredToRecipient of Interactions: EmailInteraction list
    | ReportedAsSpam
    | Unsubscribed

type EmailMessage =
    { Id: Guid
      Provider: EmailProvider
      Source: EmailSource
      State: EmailState
      Body: HtmlData
      From: Email
      Recipients: Email list
      ReplyTo: Email list
      Bcc: Email list
      Cc: Email list }
