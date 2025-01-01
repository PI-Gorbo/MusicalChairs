namespace MusicalChairs.Api.Utilities

open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult

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
