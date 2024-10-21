namespace MusicalChairs.Api

open Microsoft.AspNetCore.Routing
open Microsoft.AspNetCore.Builder

module HealthCheck =

    type HealthCheck =
        interface IRouterEndpoint with
            member self.Apply(builder: RouteGroupBuilder) : RouteGroupBuilder =
                raise (System.NotImplementedException())
