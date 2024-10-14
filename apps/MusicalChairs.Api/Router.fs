namespace MusicalChairs.Api

module Router =
    open Microsoft.AspNetCore.Builder
    open Microsoft.AspNetCore.Routing
    open System
    open Auth


    type RouteGroupBuilder with
        member self.MapAuth() =
            self
                .MapGet("/user/", Func<string>(Auth.))
                .RequireAuthorization()

    type WebApplication with
        member self.RegisterRoutes() = self.MapGroup("/api/auth").MapAuth()
