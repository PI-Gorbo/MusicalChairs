namespace MusicalChairs.Api.Domain

open System

// Contact Method
type TemplateStyle = Email of EmailTemplate

type EmailDetails =
    {
        EmailAddress: string
        TemplateId: Guid
    }

type ContactMethod = Email of EmailDetails

// Planned Jobs
type PlannedContact =
    {
        Name: string
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
        BaseEmailTemplate: EmailTemplate
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
    | CompletedBeforeContact
    | Contacted of ContactOutcome

type Contact =
    {
        ContactId: Guid
        UserId: Guid
        ContactMethods: ContactMethod list
        State: ContactState
    }

type Template =
    {
        TemplateId: Guid
        TemplateStyle: TemplateStyle
    }

type Job =
    {
        CreatorId: Guid
        Templates: Template list
        Positions: PlannedPosition list
    }

module Sample =
    let plannedJob: PlannedJob =
        {
            CreatorId = Guid.NewGuid()
            BaseEmailTemplate =
                {
                    templatedHtml =
                        Raw
                            """
This is a sample email template.
Hi {{name}}, im looking for  a {{position}} for Friday the 16th, a church gig.
"""
                    schema = [ "name"; "position" ]
                }
            Positions =
                [
                    {
                        PositionName = "Tenor"
                        PositionsAvailable = uint 1
                        Contacts =
                            [
                                {
                                    Name = "Alex Gorbatov"
                                    ContactMethods =
                                        [
                                            ContactMethod.Email { EmailAddress = "alex@gorbatov.com" }
                                        ]
                                }
                            ]
                    }
                ]
        }
