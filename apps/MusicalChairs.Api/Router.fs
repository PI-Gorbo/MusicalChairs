namespace MusicalChairs.Api

module Router =
    open Microsoft.AspNetCore.Builder
    open Microsoft.AspNetCore.Routing
    open Microsoft.AspNetCore.Http

    type WebApplication with
        member self.RegisterRoutes() = 

            // Custom Auth endpoints.
            self.MapGroup("/api/v1/auth")
                .WithTags("Auth")
                |> Auth.GetUser.Apply
                |> Auth.RegisterUser.Apply
                |> ignore

                
            