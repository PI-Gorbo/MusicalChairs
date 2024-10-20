namespace MusicalChairs.Api

module MartenDbBootstrap =
    open Marten
    open Microsoft.AspNetCore.Identity
    open System.Threading.Tasks
    open System
    open System.Linq
    open System.Collections
    open User

    let tryIdentityOperation operation cancellationToken (session: IDocumentSession) =
        task {
            try
                operation ()
                do! session.SaveChangesAsync(cancellationToken)
                return IdentityResult.Success
            with ex ->
                return IdentityResult.Failed(IdentityError(Description = ex.Message))
        }

    type RoleStore(session: IDocumentSession) =
        interface IRoleStore<UserRole> with
            member self.CreateAsync
                (role: UserRole, cancellationToken: Threading.CancellationToken)
                : Task<IdentityResult> =
                tryIdentityOperation (fun c -> session.Store(role)) cancellationToken session

            member self.DeleteAsync
                (role: UserRole, cancellationToken: Threading.CancellationToken)
                : Task<IdentityResult> =
                tryIdentityOperation (fun c -> session.Delete<UserRole>(role)) cancellationToken session

            member self.UpdateAsync
                (role: UserRole, cancellationToken: Threading.CancellationToken)
                : Task<IdentityResult> =
                tryIdentityOperation (fun c -> session.Update<UserRole>(role)) cancellationToken session

            member self.FindByIdAsync(roleId: string, cancellationToken: Threading.CancellationToken) : Task<UserRole> =
                session.LoadAsync<UserRole>(roleId)

            member self.FindByNameAsync
                (normalizedRoleName: string, cancellationToken: Threading.CancellationToken)
                : Task<UserRole> =
                    session
                        .Query<UserRole>()
                        .SingleOrDefaultAsync(fun x -> x.NormalizedName = normalizedRoleName)

            member self.GetNormalizedRoleNameAsync
                (role: UserRole, cancellationToken: Threading.CancellationToken)
                : Task<string> =
                role.NormalizedName |> Task.FromResult

            member self.GetRoleIdAsync(role: UserRole, cancellationToken: Threading.CancellationToken) : Task<string> =
                role.Id.ToString() |> Task.FromResult

            member self.GetRoleNameAsync
                (role: UserRole, cancellationToken: Threading.CancellationToken)
                : Task<string> =
                role.Name |> Task.FromResult

            member self.SetNormalizedRoleNameAsync
                (role: UserRole, normalizedName: string, cancellationToken: Threading.CancellationToken)
                : Task =
                role.NormalizedName <- normalizedName
                Task.CompletedTask

            member self.SetRoleNameAsync
                (role: UserRole, roleName: string, cancellationToken: Threading.CancellationToken)
                : Task =
                role.Name <- roleName
                Task.CompletedTask

        interface IDisposable with
            member self.Dispose() : unit = ()


    type UserStore(session: IDocumentSession) =

        interface IUserStore<User> with
            member self.GetNormalizedUserNameAsync(user: User, cancellationToken) : Task<string> =
                Task.FromResult(user.NormalizedUserName)

            member self.SetUserNameAsync(user: User, userName: string, cancellationToken) : Task =
                user.UserName <- userName
                Task.CompletedTask

            member self.GetUserNameAsync(user: User, cancellationToken) : Task<string> =
                Task.FromResult(user.NormalizedUserName)

            member self.GetUserIdAsync(user, cancellationToken) : Task<string> = Task.FromResult(user.Id.ToString())

            member self.SetNormalizedUserNameAsync(user, normalizedName, cancellationToken) =
                user.NormalizedUserName <- normalizedName
                Task.CompletedTask

            member self.CreateAsync(user, cancellationToken) =
                tryIdentityOperation (fun () -> session.Store(user)) cancellationToken session

            member self.UpdateAsync(user, cancellationToken) =
                tryIdentityOperation (fun () -> session.Update(user)) cancellationToken session

            member self.DeleteAsync(user, cancellationToken) : Task<IdentityResult> =
                tryIdentityOperation (fun () -> session.Delete<User>(user)) cancellationToken session

            member self.FindByIdAsync(userId, cancellationToken) : Task<User> =
                session.LoadAsync(Guid.Parse(userId), cancellationToken)

            member self.FindByNameAsync(normalizedUserName, cancellationToken) : Task<User> =
                session
                    .Query<User>()
                    .Where(fun x -> x.NormalizedUserName = normalizedUserName)
                    .SingleOrDefaultAsync(cancellationToken)

        interface IUserEmailStore<User> with
            member self.FindByEmailAsync(normalizedEmail: string, cancellationToken) : Task<User> =
                session
                    .Query<User>()
                    .Where(fun x -> x.NormalizedEmail = normalizedEmail)
                    .SingleOrDefaultAsync(cancellationToken)

            member self.GetEmailConfirmedAsync(user: User, cancellationToken) : Task<bool> =
                Task.FromResult(user.EmailConfirmed)

            member self.GetNormalizedEmailAsync(user: User, cancellationToken) : Task<string> =
                Task.FromResult(user.NormalizedEmail)

            member self.SetEmailAsync(user: User, email: string, cancellationToken) : Task =
                user.Email <- email
                Task.CompletedTask

            member self.SetEmailConfirmedAsync(user: User, confirmed: bool, cancellationToken) : Task =
                user.EmailConfirmed <- confirmed
                Task.CompletedTask

            member self.SetNormalizedEmailAsync(user: User, normalizedEmail: string, cancellationToken) : Task =
                user.NormalizedEmail <- normalizedEmail
                Task.CompletedTask

            member self.GetEmailAsync(user: User, cancellationToken) : Task<string> = Task.FromResult(user.Email)

        interface IUserRoleStore<User> with
            member self.AddToRoleAsync
                (user: User, roleName: string, cancellationToken: Threading.CancellationToken)
                : Task =
                task {
                    let! role =
                        session
                            .Query<UserRole>()
                            .Where(fun x -> x.NormalizedName = roleName)
                            .SingleAsync(cancellationToken)

                    user.Roles <- role.Id :: user.Roles
                }

            member self.GetRolesAsync
                (user: User, cancellationToken: Threading.CancellationToken)
                : Task<Collections.Generic.IList<string>> =
                task {
                    let! roles =
                        session
                            .Query<UserRole>()
                            .Where(fun x -> x.Id.IsOneOf(user.Roles.ToList()))
                            .Select(fun x -> x.Name)
                            .ToListAsync(cancellationToken)

                    return roles.ToList() :> Generic.IList<string>
                }

            member self.GetUsersInRoleAsync
                (roleName: string, cancellationToken: Threading.CancellationToken)
                : Task<Collections.Generic.IList<User>> =
                task {
                    // Get role Id
                    let! roleId =
                        session
                            .Query<UserRole>()
                            .Where(fun x -> x.NormalizedName = roleName)
                            .Select(fun x -> x.Id)
                            .SingleAsync(cancellationToken)

                    let! users =
                        session
                            .Query<User>()
                            .Where(fun x -> x.Roles.Contains(roleId))
                            .ToListAsync(cancellationToken)

                    return users.ToList() :> Generic.IList<User>
                }

            member self.IsInRoleAsync
                (user: User, roleName: string, cancellationToken: Threading.CancellationToken)
                : Task<bool> =
                task {
                    let! roleId =
                        session
                            .Query<UserRole>()
                            .Where(fun x -> x.NormalizedName = roleName)
                            .Select(fun x -> x.Id)
                            .SingleAsync(cancellationToken)

                    return user.Roles.Contains(roleId)
                }

            member self.RemoveFromRoleAsync
                (user: User, roleName: string, cancellationToken: Threading.CancellationToken)
                : Task =
                task {
                    let! roleId =
                        session
                            .Query<UserRole>()
                            .Where(fun x -> x.NormalizedName = roleName)
                            .Select(fun x -> x.Id)
                            .SingleAsync(cancellationToken)

                    user.Roles <- user.Roles |> List.filter (fun x -> x <> roleId)
                }

        interface IQueryableUserStore<User> with
            member self.Users: IQueryable<User> = session.Query<User>()

        interface IUserPasswordStore<User> with
            member self.GetPasswordHashAsync
                (user: User, cancellationToken: Threading.CancellationToken)
                : Task<string> =
                user.PasswordHash |> Task.FromResult

            member self.SetPasswordHashAsync
                (user: User, passwordHash: string, cancellationToken: Threading.CancellationToken)
                : Task =
                user.PasswordHash <- passwordHash
                Task.CompletedTask

            member self.HasPasswordAsync(user: User, cancellationToken: Threading.CancellationToken) : Task<bool> =
                user.PasswordHash <> null |> Task.FromResult


        interface IDisposable with
            member self.Dispose() : unit = ()
