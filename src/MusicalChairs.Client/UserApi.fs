module MusicalCharis.Client.UserApi

open Fable.Remoting.Client
open Fable.Core
open MusicalChairs.Shared.UserApi

let userApi: IUserApi =
    Remoting.createApi ()
    |> Remoting.withBaseUrl "http://localhost:5000"
    |> Remoting.withCredentials true
    |> Remoting.buildProxy<IUserApi>

let login req =
    userApi.login req |> Async.StartAsPromise

let me req = userApi.me req |> Async.StartAsPromise

let register req =
    userApi.register req |> Async.StartAsPromise

let resetPassword req =
    userApi.resetPassword req |> Async.StartAsPromise

let requestResetPasswordToken req =
    userApi.requestResetPasswordToken req |> Async.StartAsPromise
