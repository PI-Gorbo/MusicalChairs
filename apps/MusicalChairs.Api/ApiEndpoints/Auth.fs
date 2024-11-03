namespace MusicalChairs.Api

open Marten
open FluentValidation
open System.Threading
open System.Security.Claims
open System.Threading.Tasks
open GP.IdentityEndpoints.Operations.RegisterEndpoint
open GP.IdentityEndpoints.Email
open GP.IdentityEndpoints.Operations.CookieOperations
open GP.IdentityEndpoints.Operations
open GP.IdentityEndpoints.Utils
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open Microsoft.AspNetCore.Identity
open Microsoft.AspNetCore.Http
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Http.HttpResults
open FSharp.MinimalApi.Builder

open type TypedResults

module Auth =

    type IGetUser = UserId -> Task<User>

    [<CLIMutable>]
    type UserDto =
        { Id: UserId
          Name: string
          Email: string
          Roles: string seq }

    let getUser =
        let FetchUserById (getUser: IGetUser) (userId: UserId) =
            getUser userId
            |> TaskResult.ofTask
            |> TaskResult.bindRequireNotNull "There is no user with the provided id."
            |> TaskResult.map (fun (user: User) ->
                { Id = user.Id
                  Name = user.UserName
                  Email = user.Email
                  Roles = user.Roles
                          |> Seq.map (_.Name) })

        endpoints {
            get
                "/user"
                produces<BadRequest<string>, Ok<UserDto>>
                (fun (input: {| claim: ClaimsPrincipal
                                session: IDocumentSession |}) ->
                    input.claim.GetUserId()
                    |> Task.FromResult
                    |> TaskResult.mapError (fun err -> !! BadRequest("Failed to get user by Id"))
                    >>= fun userId ->
                            FetchUserById input.session.LoadAsync<User> userId
                            |> TaskResult.mapError (fun err -> !! BadRequest(err))
                    |> TaskResult.foldResult (fun userDto -> !! Ok(userDto)) (fun error -> error))
                (fun (opts : RouteHandlerBuilder) -> opts.RequireAuthorization())
        }

    type LoginRequest = { Email: string; Password: string }

    type LoginRequestValidator() =
        inherit AbstractValidator<LoginRequest>()

        do
            ``base``
                .RuleFor(fun x -> x.Email)
                .NotEmpty()
                .EmailAddress()
            |> ignore

            base.RuleFor(fun x -> x.Password).NotEmpty()
            |> ignore

    let login =
        endpoints {
            post
                "/login"
                produces<BadRequest<string>, Ok>
                (fun (input: {| httpContext: HttpContext
                                signInManager: SignInManager<User>
                                userManager: UserManager<User>
                                loginRequestValidator: IValidator<LoginRequest>
                                req: LoginRequest |}) ->
                    input.loginRequestValidator.ValidateAsync(input.req)
                    |> mapValidationResult
                    |> TaskResult.mapError (fun err -> !! BadRequest(err))
                    >>= fun _ ->
                            EmailPasswordLogin.login
                                { Email = input.req.Email
                                  Password = input.req.Password }
                                input.userManager
                                input.signInManager
                            |> TaskResult.mapError (fun err ->
                                match err with
                                | EmailPasswordLogin.LoginFailure.InvalidCredentiails ->
                                    (!! BadRequest("Invalid username or Password")))
                    |> TaskResult.bind (fun user ->
                        taskResult { return! AttachCookieToContext input.httpContext user.Id [] })
                    |> TaskResult.foldResult (fun _ -> !! Ok()) (fun err -> err))
        }

    type RegisterUserRequest = { Email: string; Password: string }

    type RegisterUserRequestValidator() =
        inherit AbstractValidator<RegisterUserRequest>()

        do
            ``base``
                .RuleFor(fun x -> x.Email)
                .NotEmpty()
                .EmailAddress()
            |> ignore

            base.RuleFor(fun x -> x.Password).NotEmpty()
            |> ignore


    let register =
        endpoints {
            put
                "/register"
                produces<Ok, BadRequest<string>>
                (fun (input: {| userManager: UserManager<User>
                                validator: IValidator<RegisterUserRequest>
                                req: RegisterUserRequest
                                cancellationToken: CancellationToken |}) ->
                    input.validator.ValidateAsync(input.req, input.cancellationToken)
                    |> mapValidationResult
                    |> TaskResult.mapError (fun err -> BadRequest(err))
                    >>= fun _ ->
                            Register
                                { Email = input.req.Email
                                  Password = input.req.Password
                                  Username = input.req.Email }
                                input.userManager
                                (fun u -> u)
                            |> TaskResult.mapError (fun err ->
                                match err with
                                | EmailAlreadyRegistered -> BadRequest("Email already registered.")
                                | UsernameAlreadyRegistered -> BadRequest("Email already registered.")
                                | PasswordInvalid errorMessage -> BadRequest($"Invalid Password. {errorMessage}")
                                | GeneralFailure errorMessage -> BadRequest($"Something went wrong! {errorMessage}"))
                    |> TaskResult.foldResult (fun _ -> !! Ok()) (fun err -> !!err))
        }

    let resetPassword =
        endpoints {
            put
                "/reset-password/send"
                produces<Ok, BadRequest<string>>
                (fun (input: {| userManager: UserManager<User>
                                resetPasswordSender: IResetPasswordSender<User>
                                request: {| email: string |} |}) ->
                    // Fetch user by email.
                    input.userManager.FindByEmailAsync(input.request.email)
                    |> TaskResult.ofTask
                    |> TaskResult.bindRequireNotNull (!! BadRequest("There is no user with the provided email."))

                    // Attempt to send a reset password email.
                    >>= fun user ->
                            ResetPassword.send input.userManager user input.resetPasswordSender
                            |> TaskResult.mapError (fun err ->
                                !! BadRequest($"Failed to send confirmation email. {err}"))
                    |> TaskResult.foldResult (fun _ -> !! Ok()) (fun err -> err))

            put
                "/reset-password"
                produces<Ok, BadRequest<string>>
                (fun (input: {| userManager: UserManager<User>
                                request: {| email: string
                                            password: string
                                            token: string |} |}) ->
                    ResetPassword.reset
                        input.userManager
                        { email = input.request.email
                          password = input.request.password
                          token = input.request.token }
                    |> TaskResult.mapError (fun err ->
                        match err with
                        | ResetPassword.ResetPasswordError.UserNotFound -> !! BadRequest("User not found")
                        | ResetPassword.ResetPasswordError.FailedToSetPassword error ->
                            !! BadRequest($"Something went wrong while trying to reset password. {error}"))
                    |> TaskResult.foldResult (fun _ -> !! Ok()) (fun err -> err))
        }


    let confirmEmail =
        endpoints {
            put
                "/confirm-email/send"
                produces<Ok, BadRequest<string>, UnauthorizedHttpResult>
                (fun (input: {| userManager: UserManager<User>
                                userIdentity: ClaimsPrincipal
                                emailSender: IConfirmEmailSender<User> |}) ->
                    input.userIdentity.GetUserId()
                    |> TaskResult.ofResult
                    |> TaskResult.mapError (fun _ -> !! Unauthorized())
                    >>= (fun userId ->
                        input.userManager.FindByIdAsync(userId.ToString())
                        |> TaskResult.ofTask)
                    >>= fun user ->
                            ConfirmEmail.send input.userManager user input.emailSender
                            |> TaskResult.mapError (fun err -> !! BadRequest(err))
                    |> TaskResult.foldResult (fun _ -> !! Ok()) (fun error -> error))

            put
                "/confirm-email"
                produces<Ok, UnauthorizedHttpResult, BadRequest<string>>
                (fun (input: {| claims: ClaimsPrincipal
                                userManager: UserManager<User>
                                request: {| token: string |} |}) ->
                    input.claims.GetUserId()
                    |> TaskResult.ofResult
                    |> TaskResult.mapError (fun _ -> !! Unauthorized())
                    >>= fun userId ->
                            ConfirmEmail.confirm
                                input.userManager
                                { userId = userId
                                  ConfirmEmailToken = input.request.token }
                            |> TaskResult.mapError (fun err ->
                                match err with
                                | ConfirmEmail.ConfirmEmailError.UserNotFound -> !! BadRequest("User not found")
                                | ConfirmEmail.ConfirmEmailError.FailedToConfirm error ->
                                    !! BadRequest($"Failed to send confirmation email. {error}"))
                    |> TaskResult.foldResult (fun _ -> !! Ok()) (fun err -> err))
        }

    let endpoints =
        endpoints {
            endpoints {
                requireAthorization "IsRegisteredUser"
                getUser
                confirmEmail
            }

            endpoints {
                allowAnonymous
                login
                register
                resetPassword
            }
        }
