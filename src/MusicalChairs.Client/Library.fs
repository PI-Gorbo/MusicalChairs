module FableClient

open Fable.Remoting.Client
open Fable.Core
open MusicalChairs.Shared.Shared

let server: Server =
    Remoting.createApi ()
    |> Remoting.withBaseUrl "http://localhost:5000"
    |> Remoting.buildProxy<Server>

let count () = server.count () |> Async.StartAsPromise