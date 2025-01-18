namespace MusicalChairs.Api.Domain

// open System
// open System.Threading.Tasks
// open FsToolkit.ErrorHandling
// open FsToolkit.ErrorHandling.Operator.TaskResult
// open Microsoft.FSharp.Core
// open MusicalChairs.Api.Domain.Email
// open MusicalChairs.Api.Utilities.GenericErrors
//
// [<RequireQualifiedAccess>]
// type SendContactMessageCommand = Email of EmailId: Guid
// module MessageEngine =
//     type FailedToSendFact = { ErrorMessage: string }
//
//     [<RequireQualifiedAccess>]
//     type MessageFact =
//         | Sent
//         | FailedToSendMessage of FailedToSendFact
//         | DatabaseError of DatabaseError
//
//     type ISendMessageDependencies =
//         abstract getEmail: Guid -> TaskResult<EmailMessage, DatabaseError>
//         abstract sendEmail: EmailMessage -> TaskResult<unit, string>
//
//     let SendMessage (deps: ISendMessageDependencies) (command: SendContactMessageCommand) : Task<MessageFact> =
//         // Fetch the email, and send the message.
//         let result: TaskResult<unit, MessageFact> =
//             match command with
//             | SendContactMessageCommand.Email emailId ->
//                 emailId
//                 |> deps.getEmail
//                 |> TaskResult.mapError MessageFact.DatabaseError
//                 >>= (fun email ->
//                     match email.State with
//                     | NotSent -> deps.sendEmail email |> TaskResult.mapError (fun err -> MessageFact.FailedToSendMessage { ErrorMessage = err})
//                     | _ -> TaskResult.error (MessageFact.FailedToSendMessage {ErrorMessage = "Message not in the 'Not Sent' state."}))
//
//         result |> TaskResult.foldResult (fun _ -> MessageFact.Sent) id
