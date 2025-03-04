module MusicalCharis.Client.UserApi

open Fable.Remoting.Client
open Fable.Core
open MusicalChairs.Shared.Apis.JobApi
open MusicalChairs.Shared.Apis.UserApi

let createApi (url: string) =

    let builder =
        Remoting.createApi ()
        |> Remoting.withBaseUrl url
        |> Remoting.withCredentials true

    let _userApi: IUserApi = builder |> Remoting.buildProxy<IUserApi>

    let userApi =
        {| login = _userApi.login >> Async.StartAsPromise
           me = _userApi.me >> Async.StartAsPromise
           register = _userApi.register >> Async.StartAsPromise
           resetPassword = _userApi.resetPassword >> Async.StartAsPromise
           requestResetPasswordToken =
            _userApi.requestResetPasswordToken
            >> Async.StartAsPromise
           logout = _userApi.logout >> Async.StartAsPromise |}

    let _jobApi: IJobApi = builder |> Remoting.buildProxy<IJobApi>

    let jobApi =
        {| myJobs = _jobApi.myJobs >> Async.StartAsPromise
           getJob = _jobApi.getJob >> Async.StartAsPromise
           getDraftJob = _jobApi.getDraftJob >> Async.StartAsPromise
           createDraft = _jobApi.createDraft >> Async.StartAsPromise
           updateDraft = _jobApi.updateDraft >> Async.StartAsPromise
           startJob = _jobApi.startJob >> Async.StartAsPromise |}

    {| userApi = userApi; jobAPi = jobApi |}
