namespace MusicalChairs.Api

open System

type ContactDetails =
    { EmailAddress: string }

type CommunicationOptions = {
    CalloutExpirationTimeInMinutes: float
}

// Planned Callout
type CalloutChainPlan =
    { RoleName: string
      PositionsAvailable: uint
      Contacts: ContactDetails list }

type CalloutPlan =
    { Creator: Guid
      BaseTemplate: HtmlTemplate
      CommunicationOptions: CommunicationOptions
      CalloutChains: CalloutChainPlan list }

// Callout
type ContactOutcome =
    | Pending
    | RequestedDelay of DelayUntil: DateTimeOffset
    | Delayed of DelayUntil: DateTimeOffset
    | PassedOn
    | Confirmed

type ContactState =
    | NotContacted
    | CompletedBeforeContact
    | Contacted of ContactOutcome

type Contact =
    { ContactId: Guid
      Details: ContactDetails
      State: ContactState }

type CalloutChain =
    { RoleName: string
      PositionsAvailable: uint
      Contacts: Contact list }

type Callout =
    { Creator: Guid
      BaseTemplate: HtmlTemplate
      CalloutChains: CalloutChain list }
    
module CallOutEvent =
    type Created = {
        UserId: Guid
        Plan: CalloutPlan
    }
    
    
