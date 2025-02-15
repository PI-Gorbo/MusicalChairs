module MusicalChairs.Server.Features.UserApi

open System
open System.Threading.Tasks
open GP.IdentityEndpoints.Email
open GP.IdentityEndpoints.Operations
open GP.IdentityEndpoints.Operations.EmailPasswordLogin
open GP.IdentityEndpoints.Operations.RegisterEndpoint
open GP.IdentityEndpoints.Operations.ResetPassword
open Marten
open Microsoft.AspNetCore.Http
open Microsoft.AspNetCore.Identity
open Microsoft.Extensions.Logging
open MusicalChairs.Domain.User
open MusicalChairs.Server.Utils.AuthUtils
open MusicalChairs.Shared.UserApi
open FsToolkit.ErrorHandling
open System.Linq

type IUserApiDeps =
    inherit IAuthenticateDeps
    abstract member getUserDtoById: Guid -> Async<UserDto>
    abstract member getUserManager: Unit -> UserManager<User>
    abstract member getSignInManager: Unit -> SignInManager<User>
    abstract member getHttpContext: Unit -> HttpContext
    abstract member getLogger: Unit -> ILogger<IUserApi>

type UserMap = { UserName: string; Email: string }

let createUserApiDeps (httpContext: HttpContext) (session: IDocumentSession) : IUserApiDeps =
    let authDeps = authenticateDeps httpContext session
    let signInManager = httpContext.GetService<SignInManager<User>>()

    { new IUserApiDeps with
        member this.getUserDtoById(userId) =
            session
                .Query<User>()
                .Where(fun user -> user.Id = userId)
                .FirstAsync()
            |> Async.AwaitTask
            |> Async.map (fun u ->
                { UserDto.id = userId
                  email = u.Email
                  username = u.UserName })

        member this.userExistsAndCanLogin id = authDeps.userExistsAndCanLogin id
        member this.getClaims() = authDeps.getClaims ()
        member this.getUserManager() = signInManager.UserManager
        member this.getSignInManager() = signInManager
        member this.getHttpContext() = httpContext

        member this.getLogger() =
            httpContext.GetService<ILogger<IUserApi>>() }

let createUserApi (deps: IUserApiDeps) : IUserApi =
    { me =
        fun _ ->
            asyncResult {
                let! userId =
                    authenticate deps
                    |> AsyncResult.mapError (fun _ -> "Unauthorized")

                return! deps.getUserDtoById userId
            }

      login =
          fun req ->
              asyncResult {
                  let! user =
                      login
                          { Email = req.email
                            Password = req.password }
                          (deps.getUserManager ())
                          (deps.getSignInManager ())
                      |> Async.AwaitTask
                      |> AsyncResult.mapError (fun err ->
                          match err with
                          | InvalidCredentiails -> "Incorrect Username or Password")

                  do! CookieOperations.AttachCookieToContext (deps.getHttpContext ()) user.Id []
              }

      register =
          fun req ->
              asyncResult {
                  let! user =
                      Register
                          { Username = req.email
                            Email = req.email
                            Password = req.password }
                          (deps.getUserManager ())
                          id
                      |> Async.AwaitTask
                      |> AsyncResult.mapError (fun error ->
                          match error with
                          | GeneralFailure reason ->
                              failwith $"Something went wrong while trying to register : {reason}"
                          | RegisterEndpoint.EmailAlreadyRegistered -> EmailAlreadyRegistered
                          | UsernameAlreadyRegistered -> EmailAlreadyRegistered
                          | RegisterEndpoint.PasswordInvalid reason -> PasswordInvalid reason)

                  do! CookieOperations.AttachCookieToContext (deps.getHttpContext ()) user.Id []
              }

      requestResetPasswordToken =
          fun req ->
              async {
                  let emailSender =
                      { new IResetPasswordSender<User> with
                          member this.SendEmail req =
                              deps
                                  .getLogger()
                                  .LogInformation($"PASSWORD RESET TOKEN for {req.user.Email} - {req.token}")

                              TaskResult.ok () }

                  let logger = deps.getLogger ()
                  let userManager = deps.getUserManager ()
                  logger.LogInformation("TESTING DEBUG")
                  // Find by email
                  let! user =
                      req.email
                      |> userManager.FindByEmailAsync
                      |> Async.AwaitTask

                  if user = null then
                      logger.LogInformation(
                          $"IP {deps.getHttpContext().Connection.RemoteIpAddress} attempted to reset the password of a non-existent user with the email {req.email}"
                      )

                      return ()
                  else

                      match! ResetPassword.send userManager user emailSender
                             |> Async.AwaitTask
                          with
                      | Ok _ -> ()
                      | Error err -> logger.LogError("failed to reset password {err}", err)

              }
      resetPassword =
        fun req ->
            async {
                let logger = deps.getLogger ()
                let userManager = deps.getUserManager ()

                return!
                    reset
                        userManager
                        { email = req.email
                          password = req.newPassword
                          token = req.token }
                    |> Async.AwaitTask
                    |> AsyncResult.foldResult
                        (fun _ -> Ok())
                        (fun err ->
                            match err with
                            | UserNotFound -> Ok()
                            | FailedToSetPassword error ->
                                logger.LogError("User with email {email} failed to reset password.", req.email)

                                ResetPasswordError.InvalidNewPassword error
                                |> Error)
            }
      logout =
        fun _ ->
            async {
                do!
                    CookieOperations.RemoveCookieFromContext(deps.getHttpContext ())
                    |> Async.AwaitTask
            } }
