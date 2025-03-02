module MusicalCharis.Client.UserApi

open Fable.Remoting.Client
open Fable.Core
open MusicalChairs.Shared.Apis.UserApi
let createApi (url: string)=

    let _userApi: IUserApi =
        Remoting.createApi ()
        |> Remoting.withBaseUrl url
        |> Remoting.withCredentials true
        |> Remoting.buildProxy<IUserApi>

    let userApi =
        {| login = _userApi.login >> Async.StartAsPromise
           me = _userApi.me >> Async.StartAsPromise
           register = _userApi.register >> Async.StartAsPromise
           resetPassword = _userApi.resetPassword >> Async.StartAsPromise
           requestResetPasswordToken = _userApi.requestResetPasswordToken >> Async.StartAsPromise
           logout = _userApi.logout >> Async.StartAsPromise |}

    userApi
