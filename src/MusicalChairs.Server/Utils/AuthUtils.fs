module MusicalChairs.Server.Utils.AuthUtils

open System
open System.Security.Claims
open System.Threading
open FsToolkit.ErrorHandling
open Marten
open Microsoft.AspNetCore.Http
open MusicalChairs.Domain.User
open System.Linq

type IAuthenticateDeps =
    abstract member getClaims: unit -> seq<Claim>
    abstract member userExistsAndCanLogin: Guid -> Async<bool>

let authenticateDeps (ctx: HttpContext) (session: IDocumentSession) : IAuthenticateDeps =
    { new IAuthenticateDeps with
        member self.getClaims() = ctx.User.Claims

        member self.userExistsAndCanLogin id =
            session.Query<User>().Where(fun x -> x.Id = id).AnyAsync() |> Async.AwaitTask
    }

let authenticate (deps: IAuthenticateDeps) : Async<Result<Guid, unit>> =
    asyncResult {

        let! userId =
            deps.getClaims ()
            |> Seq.tryFind (fun claim -> claim.Type = "USERID")
            |> Option.bind (fun claim ->
                let mutable id = Guid.Empty
                if Guid.TryParse(claim.Value, &id) then Some id else None)
            |> Option.either Ok (fun _ -> Error ())

        return!
            deps.userExistsAndCanLogin userId
            |> Async.map (fun validUser -> if validUser then Ok userId else Error ())
    }
