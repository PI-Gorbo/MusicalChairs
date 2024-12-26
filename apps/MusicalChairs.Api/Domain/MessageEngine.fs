namespace MusicalChairs.Api.Domain

open System
open System.Threading.Tasks
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open Microsoft.FSharp.Core
open MusicalChairs.Api.Domain.Email
open MusicalChairs.Api.Utilities.GenericErrors

[<RequireQualifiedAccess>]
type SendContactMessageCommand =
    | Email of EmailId: Guid

[<RequireQualifiedAccess>]
type JobMessage =
    | Email of EmailMessage

    member this.GetId () =
        match this with
        | Email emailMessage -> emailMessage.Id

module MessageEngine =

    [<RequireQualifiedAccess>]
    type SendMessageFact =
        | Sent
        | FailedToSendMessage of errorMessage: string
        | MessageRequiresNotSentState
        | DatabaseError of DatabaseError

    type ISendMessageDependencies =
        abstract getEmail: Guid -> TaskResult<EmailMessage, DatabaseError>
        abstract sendEmail: EmailMessage -> TaskResult<unit, string>

    let SendMessage (deps : ISendMessageDependencies) (command: SendContactMessageCommand) : Task<SendMessageFact> =
        // Fetch the email, and send the message.
        let result : TaskResult<unit, SendMessageFact> =
            match command with
            | SendContactMessageCommand.Email emailId ->
                emailId
                |> deps.getEmail
                |> TaskResult.mapError SendMessageFact.DatabaseError
                >>= (fun email ->
                    match email.State with
                    | NotSent ->
                        deps.sendEmail email
                        |> TaskResult.mapError SendMessageFact.FailedToSendMessage
                    | _ -> TaskResult.error SendMessageFact.MessageRequiresNotSentState
                )

        result
        |> TaskResult.foldResult (fun () -> SendMessageFact.Sent) id