namespace MusicalChairs.Api
open Microsoft.AspNetCore.Identity
open System

type User() =
    inherit IdentityUser<Guid>()
    member val JoinCode: string
    

module Auth =

    open System.Security.Claims
    type ClaimsPrincipal with
        member self.GetUserId () : Result<Guid, string> =

            let unauthorizedErrorMessage = 
                "Unauthorizied."

            self.Claims
                |> Seq.tryFind (fun c -> c.Type = ClaimTypes.Actor)
                |> function
                    | Some foundClaim -> 
                        try 
                            Ok (Guid.Parse (foundClaim.Value))
                        with 
                            ex -> Error unauthorizedErrorMessage
                    | None -> Error unauthorizedErrorMessage
    // let GetUser (claim : ClaimsPrincipal) =

        
        
        
