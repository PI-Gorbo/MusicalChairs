import { Record } from "../fable_modules/fable-library-ts.4.24.0/Types.js";
import { Async } from "../fable_modules/fable-library-ts.4.24.0/AsyncBuilder.js";
import { int32 } from "../fable_modules/fable-library-ts.4.24.0/Int32.js";
import { record_type, lambda_type, class_type, int32_type, unit_type, TypeInfo } from "../fable_modules/fable-library-ts.4.24.0/Reflection.js";

export class Server extends Record {
    readonly count: (() => Async<int32>);
    constructor(count: (() => Async<int32>)) {
        super();
        this.count = count;
    }
}

export function Server_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Shared.Server", [], Server, () => [["count", lambda_type(unit_type, class_type("Microsoft.FSharp.Control.FSharpAsync`1", [int32_type]))]]);
}

