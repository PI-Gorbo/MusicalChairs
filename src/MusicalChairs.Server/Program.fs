open System
open System.Text.Json.Serialization
open System.Threading.Tasks
open GP.MartenIdentity
open Marten
open Microsoft.AspNetCore.Authentication.Cookies
open Microsoft.AspNetCore.Authorization
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Http
open Microsoft.AspNetCore.Identity
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Fable.Remoting.Server
open Fable.Remoting.AspNetCore
open MusicalChairs.Domain.User
open MusicalChairs.Server
open MusicalChairs.Server.Features.UserApi
open Weasel.Core

[<EntryPoint>]
let main args =

    let builder = WebApplication.CreateBuilder(args)

    builder.Configuration
        .AddJsonFile("appsettings.json", false)
        .AddJsonFile("appsettings.Development.json", true)
        .AddEnvironmentVariables()
        |> ignore

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
    ).UseIdentitySessions()
    |> ignore

    // Add Aspnet Identity
    builder.Services.AddIdentityCore<User>(fun opts ->
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
    builder
        .Services
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

    // // Add Authorization - What you have access to
    // builder.Services.AddScoped<IAuthorizationHandler, RegisteredUserAuthRequirement.IsRegisteredUserAuthorizationHandler>() |> ignore
    // builder.Services.AddAuthorization(fun cfg ->
    //     cfg.AddPolicy(
    //         "IsRegisteredUser",
    //         fun policyCfg ->
    //             policyCfg
    //                 .RequireAuthenticatedUser()
    //                 .AddRequirements(RegisteredUserAuthRequirement.IsRegisteredUserRequirement())
    //             |> ignore)
    //     ) |> ignore

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

    app.UseRemoting(webApp)
    app.Run()
    0 // Exit code
