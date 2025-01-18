open System
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Fable.Remoting.Server
open Fable.Remoting.AspNetCore
open Microsoft.OpenApi.Models
open MusicalChairs.Shared.Shared

[<EntryPoint>]
let main args =
    let mutable count = 0

    let server: Server =
        { count =
            fun () ->
                async {
                    let currentValue = count
                    count <- count + 1
                    raise (System.ArgumentException("AHH"))
                    return currentValue
                } }

    let builder = WebApplication.CreateBuilder(args)

    // Configure Cors
    builder.Services.AddCors(_.AddDefaultPolicy(fun defaultPolicy -> defaultPolicy.AllowAnyHeader().AllowAnyOrigin() |> ignore)) |> ignore

    let app = builder.Build()

    app.UseCors() |> ignore

    let webApp = Remoting.createApi () |> Remoting.fromValue server
    app.UseRemoting webApp
    app.Run()
    0 // Exit code
