module MusicalCharis.Client.UserApi

open Fable.Remoting.Client
open Fable.Core
open MusicalChairs.Shared.UserApi

let _userApi: IUserApi =
    Remoting.createApi ()
    |> Remoting.withBaseUrl "http://localhost:5000"
    |> Remoting.withCredentials true
    |> Remoting.buildProxy<IUserApi>

let userApi =
    {| login = _userApi.login >> Async.StartAsPromise
       me = _userApi.me >> Async.StartAsPromise
       register = _userApi.register >> Async.StartAsPromise
       resetPassword = _userApi.resetPassword >> Async.StartAsPromise
       requestResetPasswordToken = _userApi.requestResetPasswordToken >> Async.StartAsPromise
       logout = _userApi.logout >> Async.StartAsPromise |}
