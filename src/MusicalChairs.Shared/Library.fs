namespace MusicalChairs.Shared

module Shared =

    type Server = {
        count: unit -> Async<int>
    }

