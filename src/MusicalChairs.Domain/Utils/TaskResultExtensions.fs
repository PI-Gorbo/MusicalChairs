namespace MusicalChairs.Domain.Utilities

open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult

module Result =

    let inline combine<'Success, 'Error> (results: Result<'Success, 'Error> list) : Result<'Success list, 'Error> =
        match results with
        | [] -> Ok []
        | results ->
            results
            |> List.fold
                (fun acc item ->
                    acc
                    |> Result.bind (fun partialList ->
                        result {
                            let! itemValue = item
                            return partialList @ [ itemValue ]
                        }))
                (Ok [])


module TaskResult =

    let inline combine<'Success, 'Error>
        (results: TaskResult<'Success, 'Error> list)
        : TaskResult<'Success list, 'Error> =
        match results with
        | [] -> TaskResult.ok []
        | results ->
            results
            |> List.fold
                (fun acc item ->
                    acc
                    >>= fun partialList ->
                            taskResult {
                                let! itemValue = item
                                return partialList @ [ itemValue ]
                            })
                (TaskResult.ok [])
