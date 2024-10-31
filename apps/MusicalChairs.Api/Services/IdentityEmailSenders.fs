namespace MusicalChairs.Api.Email

open GP.IdentityEndpoints.Email
open MusicalChairs.Api
open User

module IdentityEmailSenders =

    type ConfirmEmailSender() =
        interface IConfirmEmailSender<User> with
            member this.SendEmail dto = failwith "todo"
    
    type ResetPasswordEmailSender() =
        interface IResetPasswordSender<User> with
            member this.SendEmail dto = failwith "todo"
