namespace MusicalChairs.Api

#nowarn "20"

// open Auth
open System
open Marten
open MusicalChairs.Api.Domain
// open MusicalChairs.Api.Services.Email.IdentityEmailSenders
open Weasel.Core
open FluentValidation
open GP.MartenIdentity
open GP.IdentityEndpoints.Extensions
open MusicalChairs.Api.Router
open System.Text.Json.Serialization
open System.Threading.Tasks
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Microsoft.AspNetCore.Authentication.Cookies
open Microsoft.AspNetCore.Authentication
open Microsoft.AspNetCore.Http
open Microsoft.AspNetCore.Identity
open Microsoft.AspNetCore.Authorization

module Program =

    [<EntryPoint>]
    let main args =

        let builder = WebApplication.CreateBuilder(args)

        // Set where configuration should be sourced from.
        builder.Configuration.AddJsonFile("appsettings.json")
        builder.Configuration.AddJsonFile("appsettings.Development.json")
        builder.Configuration.AddEnvironmentVariables()

        builder.Services.ConfigureHttpJsonOptions (fun opts ->
            JsonFSharpOptions
                .Default()
                .WithUnionAdjacentTag()
                .WithUnionNamedFields()
                .AddToJsonSerializerOptions(opts.SerializerOptions))

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

                // storeOptions.RegisterIdentityModels<User, UserRole>()
                // |> ignore

                if builder.Environment.IsDevelopment() then
                    storeOptions.AutoCreateSchemaObjects <- AutoCreate.All

                storeOptions
            )
            .UseIdentitySessions()

        // Configure Identity
        // builder.Services.AddIdentityCore<User>(fun opts ->
        //         opts.SignIn.RequireConfirmedAccount <- false
        //         opts.User.RequireUniqueEmail <- true
        //         opts.Password <-
        //             PasswordOptions(
        //                 RequireDigit = true,
        //                 RequiredLength = 6,
        //                 RequireLowercase = true,
        //                 RequireUppercase = true,
        //                 RequireNonAlphanumeric = true
        //     ))
        //     .AddRoles<UserRole>()
        //     .AddUserStore<MartenUserStore<User, UserRole>>()
        //     .AddRoleStore<MartenRoleStore<UserRole>>()
        //     .AddSignInManager()
        //     .AddDefaultTokenProviders()

        // Authentication - "Who are you"
        builder
            .Services
            .AddAuthentication(fun opts ->
                opts.DefaultAuthenticateScheme <- CookieAuthenticationDefaults.AuthenticationScheme
                opts.DefaultChallengeScheme <- CookieAuthenticationDefaults.AuthenticationScheme
                opts.DefaultScheme <- CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(fun opts ->
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

                if builder.Environment.IsDevelopment() then
                    opts.Cookie.Domain <-
                        builder.Configuration.GetValue<string>("MS:CookieDomain")
                        |> function
                            | x when String.IsNullOrEmpty x -> failwith "Error" // Default to localhost.
                            | x -> x)
            
        // Authorization - "Who has access to what"
        // builder.Services.AddScoped<IAuthorizationHandler, RegisteredUserAuthRequirement.IsRegisteredUserAuthorizationHandler>
        //     ()
        // builder.Services.AddAuthorization(fun cfg ->
        //     cfg.AddPolicy(
        //         "IsRegisteredUser",
        //         fun policyCfg ->
        //             policyCfg
        //                 .RequireAuthenticatedUser()
        //                 .AddRequirements(RegisteredUserAuthRequirement.IsRegisteredUserRequirement())
        //             |> ignore)
        //     )
        
        // Cors - "Where are you making a request from"
        // builder.Services.AddCors()

        // Add Swagger - The OpenApi document generator.
        builder.Services.AddEndpointsApiExplorer()
        builder.Services.AddSwaggerGen()

        // Register validators
        // builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>()

        // Register Email Services.
        // builder.Services.RegisterIdentityEmailSenders<User, ConfirmEmailSender, ResetPasswordEmailSender>()
        
        let app = builder.Build()
        app.UseHttpsRedirection()
        app.UseAuthentication()
        app.UseAuthorization()
        // app.UseCors(fun (builder) -> builder.AllowAnyOrigin() |> ignore)

        app.RegisterRoutes()

        if app.Environment.IsDevelopment() then
            app.UseSwagger()
            app.UseSwaggerUI() |> ignore

        app.Run()

        0
