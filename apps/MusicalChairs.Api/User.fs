namespace MusicalChairs.Api
open GP.MartenIdentity
open Microsoft.AspNetCore.Identity
open System

module User = 
    type UserId = Guid
    
    [<AllowNullLiteral>]
    type UserRole() =
        inherit MartenIdentityRole()
    

    [<AllowNullLiteral>]
    type User() =
        inherit MartenIdentityUser<UserRole>() 
        member val JoinCode: string 