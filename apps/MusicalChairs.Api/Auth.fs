namespace MusicalChairs.Api
open Microsoft.AspNetCore.Identity
open System
open System.Security.Claims
open System.Threading.Tasks
open Microsoft.AspNetCore.Http
open Microsoft.AspNetCore.Routing
open Microsoft.AspNetCore.Builder
open Marten
open FsToolkit.ErrorHandling

module Auth =

    type UserId = Guid

    [<AllowNullLiteral>]
    type User() =
        inherit IdentityUser<UserId>()
        member val JoinCode: string

    module GetUser = 
        type IGetUser = UserId -> Task<User>

        [<CLIMutable>]
        type UserDto = {
            Id: UserId
            Name: string
            Email: string
        }
        
        let GetUserIdFromClaim (c : ClaimsPrincipal) : Result<Guid, IResult> =
                c.Claims 
                    |> Seq.tryFind (fun c -> c.Type = ClaimTypes.Actor)
                    |> function
                        | Some foundClaim -> 
                            try 
                                Ok (Guid.Parse (foundClaim.Value))
                            with 
                                ex -> Error (Results.Unauthorized())
                        | None -> Error (Results.Unauthorized())
            
        let GetUserById (getUser : IGetUser) (userId : UserId) : Task<Result<UserDto, string>> =
            getUser userId
                |> TaskResult.ofTask
                |> TaskResult.bindRequireNotNull ("There is no user with the provided id.")
                |> TaskResult.map (fun (user : User) -> { Id = user.Id; Name = user.UserName; Email = user.Email; })

        let Apply (groupBuilder: RouteGroupBuilder) = 
            groupBuilder
                .MapGet("/user/", Func<ClaimsPrincipal, IDocumentSession, Task<IResult>>( fun claim session ->    
                    claim 
                        |> GetUserIdFromClaim
                        |> Task.FromResult
                        |> TaskResult.bind (GetUserById session.LoadAsync<User> >> TaskResult.mapError (fun err -> Results.BadRequest err))
                        |> TaskResult.foldResult (fun userDto -> Results.Ok userDto) (fun error -> error)
                ))
                .RequireAuthorization()