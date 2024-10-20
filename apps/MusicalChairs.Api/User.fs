namespace MusicalChairs.Api
open Microsoft.AspNetCore.Identity
open System

module User = 
    type UserId = Guid

    type UserClaim = {
        Type: string
        Value: string
    }

    type UserRole() =
        member val Id: Guid = Guid.Empty with get, set
        member val Name: string = "" with get, set
        member val NormalizedName: string = "" with get, set
        member val Claims: Guid List = [] with get, set
    

    [<AllowNullLiteral>]
    type User() =
        inherit IdentityUser<UserId>()
        member val JoinCode: string 
        member val Roles : Guid List  = [] with get, set