open System.Text.Json.Serialization
open GP.MartenIdentity
open Marten
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Fable.Remoting.Server
open Fable.Remoting.AspNetCore
open MusicalChairs.Api.Domain.User
open MusicalChairs.Server.Features.UserApi
open Weasel.Core

[<EntryPoint>]
let main args =

    let builder = WebApplication.CreateBuilder(args)

    // Add Database Reference
    builder.Services.AddMarten(
        let storeOptions = Marten.StoreOptions()
        storeOptions.Connection(builder.Configuration.GetConnectionString("Marten"))

        storeOptions.UseSystemTextJsonForSerialization(
            configure =
                fun opts ->
                    JsonFSharpOptions
                        .Default()
                        .WithUnionAdjacentTag()
                        .WithUnionNamedFields()
                        .AddToJsonSerializerOptions(opts)
        )

        storeOptions.RegisterIdentityModels<User, UserRole>()
        |> ignore

        if builder.Environment.IsDevelopment() then
            storeOptions.AutoCreateSchemaObjects <- AutoCreate.All

        storeOptions
    ) |> ignore

    // Configure Cors
    builder.Services.AddCors(
        _.AddDefaultPolicy(fun defaultPolicy -> defaultPolicy.AllowAnyHeader().AllowAnyOrigin() |> ignore)
    )
    |> ignore

    let app = builder.Build()

    app.UseCors() |> ignore

    let webApp =
        Remoting.createApi ()
        |> Remoting.fromContext (fun ctx ->
            createUserApiDeps ctx (ctx.GetService<IDocumentSession>())
            |> createUserApi
        )


    app.UseRemoting webApp
    app.Run()
    0 // Exit code
