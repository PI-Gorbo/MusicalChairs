module MusicalChairs.Server.RegisteredUserAuthRequirement

    open Marten
    open Microsoft.AspNetCore.Authorization

    type IsRegisteredUserRequirement() =
        interface IAuthorizationRequirement

        type IsRegisteredUserAuthorizationHandler(session: IDocumentSession) =
            inherit AuthorizationHandler<IsRegisteredUserRequirement>()

            override self.HandleRequirementAsync(context, requirement) : Task =
                task {
                    // FOr now.
                    return context.Succeed(requirement)
                        // context.User.GetUserId()
                        // |> TaskResult.ofResult
                        // |> TaskResult.bind (fun potentialUserId ->
                        //     session
                        //         .Query<User>()
                        //         .Where(fun x -> x.Id = potentialUserId)
                        //         .FirstOrDefaultAsync()
                        //     |> TaskResult.ofTask)
                        // |> TaskResult.bindRequireNotNull ()
                        // |> TaskResult.map (fun user ->
                        //     (context.User.Identity :?> ClaimsIdentity)
                        //         .AddClaims(
                        //             user.Roles
                        //             |> Seq.map (fun (role: UserRole) -> Claim(ClaimTypes.Role, role.Name))
                        //         ))
                        // |> TaskResult.foldResult
                        //     (fun () -> context.Succeed(requirement))
                        //     (fun () -> context.Fail(AuthorizationFailureReason(self, "Unauthorized.")))
                }
