namespace MusicalChairs.Api
open GP.MartenIdentity
open Microsoft.AspNetCore.Identity
open System

type UserId = Guid

[<AllowNullLiteral>]
type UserRole() =
    inherit MartenIdentityRole()


[<AllowNullLiteral>]
type User() =
    inherit MartenIdentityUser<UserRole>() 
    member val JoinCode: string     