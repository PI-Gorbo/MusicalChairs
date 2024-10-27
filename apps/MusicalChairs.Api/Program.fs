namespace MusicalChairs.Api

#nowarn "20"

open GP.MartenIdentity
open MusicalChairs.Api.Router
open System.Text.Json.Serialization
open System
open System.Threading.Tasks
open Marten
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Microsoft.AspNetCore.Authentication.Cookies
open Microsoft.AspNetCore.Authentication
open Microsoft.AspNetCore.Http

module Program =
    open MartenDbBootstrap
    open Microsoft.AspNetCore.Identity
    open FluentValidation
    open Weasel.Core
    open Microsoft.AspNetCore.Authorization

    [<EntryPoint>]
    let main args =

        let builder = WebApplication.CreateBuilder(args)

        // Set where configuration should be sourced from.
        builder.Configuration.AddJsonFile("appsettings.json")
        builder.Configuration.AddJsonFile("appsettings.Development.json")
        builder.Configuration.AddEnvironmentVariables()

        builder.Services.ConfigureHttpJsonOptions(fun opts -> 
            JsonFSharpOptions
                .Default()
                .WithUnionAdjacentTag()
                .WithUnionNamedFields()
                .AddToJsonSerializerOptions(opts.SerializerOptions)
        )

        // Add Marten ORM.
        builder
            .Services
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

                storeOptions.RegisterIdentityModels<User.User, User.UserRole>()
                    |> ignore

                if builder.Environment.IsDevelopment() then
                    storeOptions.AutoCreateSchemaObjects <- AutoCreate.All
                
                storeOptions
            )
            .UseIdentitySessions()

        // Configure Identity
        let identityBuilder =
            builder.Services.AddIdentityCore<User.User> (fun opts ->
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

        identityBuilder.AddRoles<User.UserRole>()
        identityBuilder.AddRoleStore<MartenRoleStore<User.UserRole>>()
        identityBuilder.AddUserStore<MartenUserStore<User.User, User.UserRole>>()
        identityBuilder.AddSignInManager()
        identityBuilder.AddDefaultTokenProviders()
        builder.Services.AddCors()

        // Authentication - "Who are you"
        let authBuilder =
            builder.Services.AddAuthentication(fun opts ->
                opts.DefaultAuthenticateScheme <- CookieAuthenticationDefaults.AuthenticationScheme)
        authBuilder.AddCookie(fun opts ->
            opts.Events.OnRedirectToLogin <-
                fun (c: RedirectContext<CookieAuthenticationOptions>) ->
                    task {
                        c.Response.StatusCode <- StatusCodes.Status401Unauthorized
                        return Task.CompletedTask
                    }

            opts.Events.OnRedirectToAccessDenied <-
                fun (c: RedirectContext<CookieAuthenticationOptions>) ->
                    task {
                        c.Response.StatusCode <- StatusCodes.Status401Unauthorized
                        return Task.CompletedTask
                    }

            opts.SlidingExpiration <- true
            opts.ExpireTimeSpan <- TimeSpan.FromHours(24)

            opts.Cookie.Domain <-
                builder.Configuration.GetValue<string>("MS:CookieDomain")
                |> function
                    | x when String.IsNullOrEmpty x -> failwith "Error" // Default to localhost.
                    | x -> x)

        // Authorization - "Who has access to what"
        builder.Services.AddScoped<IAuthorizationHandler, AuthBootstrap.IsRegisteredUserAuthorizationHandler>()
        builder.Services.AddAuthorization(fun cfg ->
            cfg.AddPolicy("IsRegisteredUser", fun policyCfg -> 
                policyCfg
                    .RequireAuthenticatedUser()
                    .AddRequirements(AuthBootstrap.IsRegisteredUserRequirement()) 
                    |> ignore ))

        // Add Swagger - The OpenApi document generator.
        builder.Services.AddEndpointsApiExplorer()
        builder.Services.AddSwaggerGen()

        // Register validators
        builder.Services.AddValidatorsFromAssemblyContaining<Auth.RegisterUser.RegisterUserRequestValidator>()

        let app = builder.Build()

        app.UseHttpsRedirection()
        app.UseAuthorization()
        app.UseAuthentication()
        app.UseCors(fun (builder) -> builder.AllowAnyOrigin() |> ignore)
        app.RegisterRoutes() |> ignore

        if app.Environment.IsDevelopment() then
            app.UseSwagger()
            app.UseSwaggerUI() |> ignore

        app.Run()

        0
