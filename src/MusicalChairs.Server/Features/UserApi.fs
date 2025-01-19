module MusicalChairs.Server.Features.UserApi

open System
open Marten
open Microsoft.AspNetCore.Http
open MusicalChairs.Domain.User
open MusicalChairs.Server.Utils.AuthUtils
open MusicalChairs.Shared.UserApi
open FsToolkit.ErrorHandling
open System.Linq

type IUserApiDeps =
    inherit IAuthenticateDeps
    abstract member getUserDtoById: Guid -> Async<UserDto>

let createUserApiDeps (httpContext: HttpContext) (session: IDocumentSession) : IUserApiDeps =
    let authDeps = authenticateDeps httpContext session
    {
        new IUserApiDeps with
            member this.getUserDtoById(userId) =
                session
                    .Query<User>()
                    .Where(fun user -> user.Id = userId)
                    .Select(fun u ->
                        {| Username = u.UserName
                           Email = u.Email |})
                    .FirstAsync()
                    |> Async.AwaitTask
                    |> Async.map (fun partial -> { UserDto.id = userId; email = partial.Email; username = partial.Username })
            member this.userExistsAndCanLogin id= authDeps.userExistsAndCanLogin id
            member this.getClaims() = authDeps.getClaims()

    }

let createUserApi (deps: IUserApiDeps) : IUserApi =
    { me =
        fun _ ->
            asyncResult {
                let! userId = authenticate deps |> AsyncResult.mapError (fun _ -> ())
                return! deps.getUserDtoById userId
            }

      login = failwith "todo"
      register = failwith "todo"
      requestResetPasswordToken = failwith "todo"
      resetPassword = failwith "todo" }
