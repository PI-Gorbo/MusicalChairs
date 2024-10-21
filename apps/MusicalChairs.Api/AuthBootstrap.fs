namespace MusicalChairs.Api

module AuthBootstrap =
    open Microsoft.AspNetCore.Authorization
    open System.Threading.Tasks
    open Marten
    open System.Security.Claims
    open System.Linq
    open System
    open FsToolkit.ErrorHandling

    type IsRegisteredUserRequirement() =
        interface IAuthorizationRequirement

    type IsRegisteredUserAuthorizationHandler(session: IDocumentSession) =
        inherit AuthorizationHandler<IsRegisteredUserRequirement>()

        override self.HandleRequirementAsync(context, requirement) : Task =
            task {
                return!
                    context.User.Claims
                    |> Seq.tryFind (fun x -> x.Type = ClaimTypes.Actor)
                    |> function
                        | None -> Error()
                        | Some claim -> Ok claim
                    |> Result.bind (fun claim ->
                        try
                            Guid.Parse(claim.Value) |> Ok
                        with
                        | ex -> Error())
                    |> TaskResult.ofResult
                    |> TaskResult.bind (fun potentialUserId ->
                        session
                            .Query<User.User>()
                            .Where(fun x -> x.Id = potentialUserId)
                            .AnyAsync()
                        |> TaskResult.ofTask)
                    |> TaskResult.bindRequireTrue ()
                    |> TaskResult.foldResult
                        (fun () -> ())
                        (fun () -> context.Fail(AuthorizationFailureReason(self, "Unauthorized.")))
            }
