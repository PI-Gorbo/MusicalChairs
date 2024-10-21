namespace MusicalChairs.Api
open Microsoft.AspNetCore.Routing

type IRouterEndpoint = 
    abstract Apply: builder: RouteGroupBuilder -> RouteGroupBuilder