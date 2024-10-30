namespace MusicalChairs.Api

open User
open Marten
open GP.IdentityEndpoints.Operations
open GP.IdentityEndpoints.Utils
open System
open System.Threading
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult
open GP.IdentityEndpoints.Operations.RegisterEndpoint
open System.Security.Claims
open System.Threading.Tasks
open Microsoft.AspNetCore.Http
open Microsoft.AspNetCore.Routing
open Microsoft.AspNetCore.Builder
open FluentValidation
open Microsoft.AspNetCore.Identity
open FSharp.MinimalApi
open FSharp.MinimalApi.Builder
open GP.IdentityEndpoints.Operations.CookieOperations

open type TypedResults

module Auth =
    module RegisterUser =

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

        let RegisterUser
            (cancellationToken: CancellationToken)
            (httpContext: HttpContext)
            (userManager: UserManager<User>)
            (validator: IValidator<RegisterUserRequest>)
            (req: RegisterUserRequest)
            : Task<IResult>
            =
            validator.ValidateAsync(req, cancellationToken)
            |> mapValidationResult
            |> TaskResult.mapError (fun err -> BadRequest(err))
            >>= fun _ ->
                    Register
                        { Email = req.Email
                          Password = req.Password
                          Username = req.Email }
                        userManager
                        (fun u -> u)
                    |> TaskResult.mapError (fun err ->
                        match err with
                        | EmailAlreadyRegistered -> BadRequest("Email already registered.") 
                        | UsernameAlreadyRegistered -> BadRequest("Email already registered.") 
                        | PasswordInvalid errorMessage -> BadRequest($"Invalid Password. {errorMessage}") 
                        | GeneralFailure errorMessage -> BadRequest($"Something went wrong! {errorMessage}") )
            |> TaskResult.foldResult (fun _ -> Ok()) (fun err -> err)

    module Login =
    
        type LoginRequest =
            { Email: string
              Password: string
            }
    
        type LoginRequestValidator() =
            inherit AbstractValidator<LoginRequest>()
    
            do
                base
                    .RuleFor(fun x -> x.Email)
                    .NotEmpty()
                    .EmailAddress()
                |> ignore
    
                base.RuleFor(fun x -> x.Password).NotEmpty()
                |> ignore
    
        let Login
            (httpContext: HttpContext)
            (signInManager: SignInManager<User>)
            (userManager: UserManager<User>)
            (cancellationToken : CancellationToken)
            (loginRequestValidator: IValidator<LoginRequest>)
            (req: LoginRequest)
            =
            loginRequestValidator.ValidateAsync(req, cancellationToken) 
            |> mapValidationResult
            |> TaskResult.mapError (fun err -> !! BadRequest(err))
            >>= fun _ ->
                EmailPasswordLogin.login {Email = req.Email; Password = req.Password } userManager signInManager
                |> TaskResult.mapError(fun err ->
                    match err with
                    | EmailPasswordLogin.LoginFailure.InvalidCredentiails -> (!! BadRequest("Invalid username or Password")))
            |> TaskResult.bind (fun user -> taskResult { return! CookieOperations.AttachCookieToContext httpContext user.Id [] } ) 
            |> TaskResult.foldResult (fun _ -> Results.Ok()) (fun err -> err)
    
        let Apply (groupBuilder: RouteGroupBuilder) =
            groupBuilder
                .MapPut("/login", Func<_, _, _, _, _>(Login))
                .AllowAnonymous()
            |> ignore
    
            groupBuilder

    module GetUser =
        type IGetUser = UserId -> Task<User>

        [<CLIMutable>]
        type UserDto =
            { Id: UserId
              Name: string
              Email: string }

        let FetchUserById (getUser: IGetUser) (userId: UserId) =
            getUser userId
            |> TaskResult.ofTask
            |> TaskResult.bindRequireNotNull (!! BadRequest("There is no user with the provided id."))
            |> TaskResult.map (fun (user: User) ->
                { Id = user.Id
                  Name = user.UserName
                  Email = user.Email })
            |> TaskResult.mapError (fun err -> !! BadRequest(err))

        let GetUser (claim: ClaimsPrincipal) (session: IDocumentSession) =
            claim.GetUserId()
            |> Task.FromResult
            |> TaskResult.mapError (fun err -> !! BadRequest(err))
            >>= (FetchUserById session.LoadAsync<User>)
            |> TaskResult.foldResult (fun userDto -> Results.Ok userDto) (fun error -> error)

        let Apply (groupBuilder: RouteGroupBuilder) =
            groupBuilder
                .MapGet("/user/", Func<_, _, _>(GetUser))
                .RequireAuthorization()
            |> ignore

            groupBuilder

    let routes =
        endpoints {
            post "/register" RegisterUser.RegisterUser _.AllowAnonymous()
        // put "/login" (fun)
        // get "/user" (fun)
        }
