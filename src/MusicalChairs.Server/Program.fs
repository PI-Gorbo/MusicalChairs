open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Fable.Remoting.Server
open Fable.Remoting.AspNetCore
open MusicalChairs.Server.Features.UserApi

[<EntryPoint>]
let main args =

    let builder = WebApplication.CreateBuilder(args)

    // Configure Cors
    builder.Services.AddCors(
        _.AddDefaultPolicy(fun defaultPolicy -> defaultPolicy.AllowAnyHeader().AllowAnyOrigin() |> ignore)
    )
    |> ignore

    let app = builder.Build()

    app.UseCors() |> ignore

    let webApp =
        Remoting.createApi ()
        |> Remoting.fromContext (fun ctx -> createUserApi ctx)


    app.UseRemoting webApp
    app.Run()
    0 // Exit code
