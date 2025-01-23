module MusicalChairs.Server.Features.UserApi

open System
open GP.IdentityEndpoints.Operations
open GP.IdentityEndpoints.Operations.EmailPasswordLogin
open GP.IdentityEndpoints.Operations.RegisterEndpoint
open Marten
open Microsoft.AspNetCore.Http
open Microsoft.AspNetCore.Identity
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

let createUserApiDeps (httpContext: HttpContext) (session: IDocumentSession) : IUserApiDeps =
    let authDeps = authenticateDeps httpContext session
    let signInManager = httpContext.GetService<SignInManager<User>>()

    { new IUserApiDeps with
        member this.getUserDtoById(userId) =
            session
                .Query<User>()
                .Where(fun user -> user.Id = userId)
                // .Select(fun u ->
                //     {| Username = u.UserName
                //        Email = u.Email |})
                .FirstAsync()
            |> Async.AwaitTask
            |> Async.map (fun partial ->
                { UserDto.id = userId
                  email = partial.Email
                  username = partial.UserName })

        member this.userExistsAndCanLogin id = authDeps.userExistsAndCanLogin id
        member this.getClaims() = authDeps.getClaims ()
        member this.getUserManager() = signInManager.UserManager
        member this.getSignInManager() = signInManager
        member this.getHttpContext() = httpContext

    }

let createUserApi (deps: IUserApiDeps) : IUserApi =
    { me =
        fun _ ->
            asyncResult {
                let! userId = authenticate deps |> AsyncResult.mapError (fun _ -> "Unauthorized")
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
                        | GeneralFailure reason -> failwith $"Something went wrong while trying to register : {reason}"
                        | RegisterEndpoint.EmailAlreadyRegistered -> EmailAlreadyRegistered
                        | UsernameAlreadyRegistered -> EmailAlreadyRegistered
                        | RegisterEndpoint.PasswordInvalid reason -> PasswordInvalid reason)

                do! CookieOperations.AttachCookieToContext (deps.getHttpContext ()) user.Id []
            }

      requestResetPasswordToken = fun _ -> failwith "todo"
      resetPassword = fun _ -> failwith "todo" }
