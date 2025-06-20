﻿open System
open System.Text.Json.Serialization
open System.Threading.Tasks
open GP.MartenIdentity
open Marten
open Microsoft.AspNetCore.Authentication.Cookies
open Microsoft.AspNetCore.Authorization
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.AspNetCore.Http
open Microsoft.AspNetCore.Identity
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Fable.Remoting.Server
open Fable.Remoting.AspNetCore
open Microsoft.Extensions.Logging
open MusicalChairs.Domain.Job
open MusicalChairs.Domain.User
open MusicalChairs.Server
open MusicalChairs.Server.Configuration
open MusicalChairs.Server.Features.JobApi
open MusicalChairs.Server.Features.UserApi
open MusicalChairs.Server.Utils.LambdaUtils
open Weasel.Core
open Microsoft.FSharp.Linq.RuntimeHelpers.LeafExpressionConverter

[<EntryPoint>]
let main args =

    let builder = WebApplication.CreateBuilder(args)

    builder.Configuration
        .AddJsonFile("appsettings.json", false)
        .AddJsonFile("appsettings.Development.json", true)
        .AddEnvironmentVariables()
    |> ignore

    let environment =
        builder.Configuration.GetValue<string>("ASPNET_ENVIRONMENT")

    // Add Database Reference
    builder.Services
        .AddMarten(
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

            storeOptions.RegisterIdentityModels<User, UserRole>() |> ignore
            MartenConfiguration.AddSchemaConfiguration(storeOptions) |> ignore

            // if builder.Environment.IsDevelopment() then
            storeOptions.AutoCreateSchemaObjects <- AutoCreate.All

            storeOptions
        )
        .UseIdentitySessions()
    |> ignore

    // Add Aspnet Identity
    builder.Services
        .AddIdentityCore<User>(fun opts ->
            opts.SignIn.RequireConfirmedAccount <- false
            opts.User.RequireUniqueEmail <- true

            opts.Password <-
                PasswordOptions(
                    RequireDigit = true,
                    RequiredLength = 6,
                    RequireLowercase = true,
                    RequireUppercase = true,
                    RequireNonAlphanumeric = true
                ))
        .AddRoles<UserRole>()
        .AddUserStore<MartenUserStore<User, UserRole>>()
        .AddRoleStore<MartenRoleStore<UserRole>>()
        .AddSignInManager()
        .AddDefaultTokenProviders()
    |> ignore

    // Add Authentication - Who are you
    builder.Services
        .AddAuthentication(fun opts ->
            opts.DefaultAuthenticateScheme <- CookieAuthenticationDefaults.AuthenticationScheme
            opts.DefaultChallengeScheme <- CookieAuthenticationDefaults.AuthenticationScheme
            opts.DefaultScheme <- CookieAuthenticationDefaults.AuthenticationScheme)
        .AddCookie(fun opts ->
            opts.Events.OnRedirectToLogin <-
                fun c ->
                    task {
                        c.Response.StatusCode <- StatusCodes.Status401Unauthorized
                        return Task.CompletedTask
                    }

            opts.Events.OnRedirectToAccessDenied <-
                fun c ->
                    task {
                        c.Response.StatusCode <- StatusCodes.Status401Unauthorized
                        return Task.CompletedTask
                    }

            opts.SlidingExpiration <- true
            opts.ExpireTimeSpan <- TimeSpan.FromHours(24)

            if builder.Environment.IsDevelopment() then
                opts.Cookie.Domain <-
                    builder.Configuration.GetValue<string>("MC:CookieDomain")
                    |> function
                        | x when String.IsNullOrEmpty x -> failwith "Error" // Default to localhost.
                        | x -> x)
    |> ignore

    // Configure Cors
    builder.Services.AddCors(
        _.AddDefaultPolicy(fun defaultPolicy ->
            defaultPolicy
                .WithOrigins(builder.Configuration.GetValue<string>("MC:CorsOrigins").Split(";"))
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
            |> ignore)
    )
    |> ignore

    // Add Logger
    builder.Logging.AddConsole() |> ignore

    // TODO: MUST CHANGE.
    builder.Logging.SetMinimumLevel(if environment = "Development" then LogLevel.Debug else LogLevel.Information) |> ignore

    let app = builder.Build()


    let errorHandler (logger: ILogger) (ex: Exception) (routeInfo: RouteInfo<HttpContext>) =
        // Do some logging
        logger.LogError $"Error at {routeInfo.path} on method {routeInfo.methodName} : ${ex}"

        // Propagate a general error to the client.
        Propagate $"Error at {routeInfo.path} on method {routeInfo.methodName}"


    // Grab a logger.
    let userApi =
        Remoting.createApi ()
        |> Remoting.fromContext (fun ctx -> createUserApiDeps ctx (ctx.GetService<IDocumentSession>()) |> createUserApi)
        |> Remoting.withErrorHandler (errorHandler app.Logger)

    let jobApi =
        Remoting.createApi ()
        |> Remoting.fromContext (fun ctx -> createJobDeps ctx (ctx.GetService<IDocumentSession>()) |> createJobApi)
        |> Remoting.withErrorHandler (errorHandler app.Logger)

    app.UseCors() |> ignore
    app.UseRemoting(userApi)
    app.UseRemoting(jobApi)
    app.Run()
    0 // Exit code
