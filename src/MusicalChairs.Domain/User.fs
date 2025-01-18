namespace MusicalChairs.Api.Domain.User
open GP.MartenIdentity
open System

type UserId = Guid

[<AllowNullLiteral>]
type UserRole() =
    inherit MartenIdentityRole()


[<AllowNullLiteral>]
type User() =
    inherit MartenIdentityUser<UserRole>() 
    member val JoinCode: string     