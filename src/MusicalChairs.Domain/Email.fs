module MusicalChairs.Domain.Email

open System

type EmailAddress = string

type HtmlData =
    | Raw of string
    | Reference of BucketReference: string

type EmailTemplate =
    {
        TemplatedHtml: HtmlData
    }

    member self.applyTemplate () = self.TemplatedHtml

type EmailSource =
    | Contact of JobId: Guid * ContactId: Guid
    | ConfirmEmail of UserId: Guid
    | ResetPassword of UserId: Guid

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
    {
        Id: Guid
        Source: EmailSource
        State: EmailState
        Body: HtmlData
        From: EmailAddress
        Recipients: EmailAddress list
        ReplyTo: EmailAddress list
        Bcc: EmailAddress list
        Cc: EmailAddress list
    }
