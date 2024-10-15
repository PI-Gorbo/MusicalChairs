namespace MusicalChairs.Api

#nowarn "20"

open System
open System.Collections.Generic
open System.IO
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.AspNetCore.HttpsPolicy
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Logging
open MusicalChairs.Api.Router
open Marten

module Program =
    open Microsoft.AspNetCore.Cors.Infrastructure
    open Microsoft.AspNetCore.Authentication.Cookies
    open Microsoft.AspNetCore.Authentication
    open Microsoft.AspNetCore.Http
    open Weasel.Core
    open System.Text.Json
    open System.Text.Json.Serialization

    [<EntryPoint>]
    let main args =

        let builder = WebApplication.CreateBuilder(args)

        builder.Services.AddMarten(
            let storeOptions = StoreOptions()
            storeOptions.UseSystemTextJsonForSerialization(
                configure = fun opts -> 
                    JsonFSharpOptions
                        .Default()
                        .WithUnionAdjacentTag()
                        .WithUnionNamedFields()
                        .AddToJsonSerializerOptions(opts)
            )
            storeOptions.Schema.For<Auth.User>()

            storeOptions
        )

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
                opts.Cookie.Domain <- builder.Configuration.GetValue<string>("MS:CookieDomain")
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
