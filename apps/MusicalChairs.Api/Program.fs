namespace MusicalChairs.Api

#nowarn "20"

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
    open Microsoft.AspNetCore.Identity

    [<EntryPoint>]
    let main args =

        let builder = WebApplication.CreateBuilder(args)

        builder.Services.AddMarten(
            let storeOptions = Marten.StoreOptions()
            storeOptions.UseSystemTextJsonForSerialization(
                configure =
                    fun opts ->
                        JsonFSharpOptions
                            .Default()
                            .WithUnionAdjacentTag()
                            .WithUnionNamedFields()
                            .AddToJsonSerializerOptions(opts)
            )
            storeOptions.Schema.For<Auth.User>()
            storeOptions
        )

        builder.Services.AddIdentityApiEndpoints<Auth.User>(fun opts ->
            opts.Password.RequireDigit <- true
            opts.Password.RequiredLength <- 10
            opts.Password.RequireLowercase <- true
            opts.Password.RequireNonAlphanumeric <- true
            opts.Password.RequireUppercase <- true)
            .AddRoleStore()

        builder
            .Services
            .AddAuthentication(fun opts ->
                opts.DefaultAuthenticateScheme <- CookieAuthenticationDefaults.AuthenticationScheme)
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

                opts.Cookie.Domain <-
                    builder.Configuration.GetValue<string>("MS:CookieDomain")
                    |> function
                        | x when String.IsNullOrEmpty x -> failwith "Cannot Locate the configuration MS:CookieDomain"
                        | x -> x

                ignore ())
        |> ignore

        let app = builder.Build()

        app.UseHttpsRedirection()
        app.UseAuthorization()
        app.UseCors(fun (builder) -> builder.AllowAnyOrigin() |> ignore)
        app.RegisterRoutes() |> ignore

        app.Run()

        0
