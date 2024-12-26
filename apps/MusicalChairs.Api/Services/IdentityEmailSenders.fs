namespace MusicalChairs.Api.Services.Email

open FsToolkit.ErrorHandling
open GP.IdentityEndpoints.Email
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Logging
open MusicalChairs.Api
open MusicalChairs.Api.Domain

// module IdentityEmailSenders = end

    // type ConfirmEmailSender(hostingEnvironment: IHostEnvironment, logger: ILogger<ConfirmEmailSender>) =
    //     interface IConfirmEmailSender<User> with
    //         member this.SendEmail dto =
    //             if hostingEnvironment.IsDevelopment() then
    //                 logger.LogInformation $"Confirm email for user {dto.user.Email} is {dto.token}"
    //                 TaskResult.ok ()
    //             else
    //                 TaskResult.error "Email not implemented"
    //
    // type ResetPasswordEmailSender(hostingEnvironment: IHostEnvironment, logger: ILogger<ResetPasswordEmailSender>) =
    //     interface IResetPasswordSender<User> with
    //         member this.SendEmail dto  =
    //             if hostingEnvironment.IsDevelopment() then
    //                 logger.LogInformation $"Confirm email for user {dto.user.Email} is {dto.token}"
    //                 TaskResult.ok ()
    //             else
    //                 TaskResult.error "Email not implemented"
