namespace MusicalChairs.Api

open System
open User
open System.Security.Claims
open System.Threading.Tasks
open Microsoft.AspNetCore.Http
open Microsoft.AspNetCore.Routing
open Microsoft.AspNetCore.Builder
open Marten
open FsToolkit.ErrorHandling
open FluentValidation
open Microsoft.AspNetCore.Identity
open Microsoft.AspNetCore.Authentication.Cookies
open Microsoft.AspNetCore.Authentication
open FluentValidation.Results
open System.Threading

module Auth =

    let mapIdentityResult (res: Task<IdentityResult>) : Task<Result<unit, string>> =
        res
        |> TaskResult.ofTask
        |> TaskResult.bind (fun res ->
            if res.Succeeded then
                TaskResult.ok ()
            else
                let identityErrorsAsString =
                    res.Errors
                    |> Seq.map (fun x -> x.Description)
                    |> (fun x -> String.Join(", ", x))

                identityErrorsAsString |> TaskResult.error)

    let mapValidationResult (taskRes: Task<ValidationResult>) =
        taskRes
        |> TaskResult.ofTask
        |> TaskResult.bind (fun res ->
            if res.IsValid then
                TaskResult.ok ()
            else
                TaskResult.error (
                    res.Errors
                    |> Seq.map (fun err -> err.ErrorMessage)
                    |> (fun errors -> String.Join(", ", errors))
                ))

    module RegisterUser =

        type RegisterUserRequest = { Email: string; Password: string }

        type RegisterUserRequestValidator() =
            inherit AbstractValidator<RegisterUserRequest>()

            do
                base
                    .RuleFor(fun x -> x.Email)
                    .NotEmpty()
                    .EmailAddress()
                |> ignore

                base.RuleFor(fun x -> x.Password).NotEmpty()
                |> ignore


        let verifyPassword (userManager: UserManager<User>) (user: User) (password: string) =
            userManager.PasswordValidators
            |> Seq.fold
                (fun result passwordValidator ->
                    result
                    |> TaskResult.bind (fun _ ->
                        passwordValidator.ValidateAsync(userManager, user, password)
                        |> mapIdentityResult))
                (TaskResult.ok ())

        let RegisterUser
            (cancellationToken: CancellationToken)
            (httpContext: HttpContext)
            (userManager: UserManager<User>)
            (validator: IValidator<RegisterUserRequest>)
            (req: RegisterUserRequest)
            =
            let user = User()

            validator.ValidateAsync(req, cancellationToken)
            |> mapValidationResult
            |> TaskResult.bind (fun _ ->
                userManager.FindByEmailAsync(req.Email)
                |> TaskResult.ofTask)
            |> TaskResult.bindRequireEqual null "Email already in use by another account."
            |> TaskResult.bind (fun _ -> verifyPassword userManager user req.Password)
            |> TaskResult.bind (fun _ ->
                userManager.SetUserNameAsync(user, req.Email)
                |> TaskResult.ofTask
                |> TaskResult.ignore)
            |> TaskResult.bind (fun _ ->
                userManager.SetEmailAsync(user, req.Email)
                |> TaskResult.ofTask
                |> TaskResult.ignore)
            |> TaskResult.bind (fun _ -> 
                userManager.CreateAsync(user) |> mapIdentityResult)
            |> TaskResult.bind (fun _ ->
                let claims =
                    [ Claim(ClaimTypes.Email, user.Email)
                      Claim(ClaimTypes.Actor, user.Id.ToString()) ]

                let claimsIdentity =
                    new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)

                taskResult {
                    // TODO: For Now, On register automatically authenticates, but we need to follow the confirm email path.
                    return!
                        httpContext.SignInAsync(
                            CookieAuthenticationDefaults.AuthenticationScheme,
                            new ClaimsPrincipal(claimsIdentity)
                        )
                })
            |> TaskResult.foldResult (fun userDto -> Results.Ok userDto) (fun error -> Results.BadRequest(error))

        let Apply (groupBuilder: RouteGroupBuilder) =
            groupBuilder
                .MapPost("/register", Func<_, _, _, _, _, Task<IResult>>(RegisterUser))
                .AllowAnonymous()

    module GetUser =
        type IGetUser = UserId -> Task<User>

        [<CLIMutable>]
        type UserDto =
            { Id: UserId
              Name: string
              Email: string }

        let GetUserIdFromClaim (c: ClaimsPrincipal) : Result<Guid, IResult> =
            c.Claims
            |> Seq.tryFind (fun c -> c.Type = ClaimTypes.Actor)
            |> function
                | Some foundClaim ->
                    try
                        Ok(Guid.Parse(foundClaim.Value))
                    with
                    | ex -> Error(Results.Unauthorized())
                | None -> Error(Results.Unauthorized())

        let FetchUserById (getUser: IGetUser) (userId: UserId) =
            getUser userId
            |> TaskResult.ofTask
            |> TaskResult.bindRequireNotNull ("There is no user with the provided id.")
            |> TaskResult.map (fun (user: User) ->
                { Id = user.Id
                  Name = user.UserName
                  Email = user.Email })
            |> TaskResult.mapError (fun err -> Results.BadRequest err)

        let GetUser (claim: ClaimsPrincipal) (session: IDocumentSession) =
            claim
            |> GetUserIdFromClaim
            |> Task.FromResult
            |> TaskResult.bind (FetchUserById session.LoadAsync<User>)
            |> TaskResult.foldResult (fun userDto -> Results.Ok userDto) (fun error -> error)

        let Apply (groupBuilder: RouteGroupBuilder) =
            groupBuilder
                .MapGet("/user/", Func<_, _, _>(GetUser))
                .RequireAuthorization()
            |> ignore

            groupBuilder
