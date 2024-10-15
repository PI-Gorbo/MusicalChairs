namespace MusicalChairs.Api

module Router =
    open Microsoft.AspNetCore.Routing
    open Microsoft.AspNetCore.Builder
    open System
    open System.Security.Claims
    open System.Threading.Tasks
    open Microsoft.AspNetCore.Http
    open Microsoft.AspNetCore.Http.HttpResults



    type WebApplication with
        member self.RegisterRoutes() = 
            self.MapGroup("/api/auth")
                |> Auth.GetUser.Apply