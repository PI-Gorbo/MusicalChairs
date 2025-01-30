import { Union } from "../fable-library-ts.4.24.0/Types.js";
import { float64 } from "../fable-library-ts.4.24.0/Int32.js";
import { FSharpList } from "../fable-library-ts.4.24.0/List.js";
import { FSharpMap } from "../fable-library-ts.4.24.0/Map.js";
import { union_type, class_type, list_type, bool_type, string_type, float64_type, TypeInfo } from "../fable-library-ts.4.24.0/Reflection.js";

export type Json_$union = 
    | Json<0>
    | Json<1>
    | Json<2>
    | Json<3>
    | Json<4>
    | Json<5>

export type Json_$cases = {
    0: ["JNumber", [float64]],
    1: ["JString", [string]],
    2: ["JBool", [boolean]],
    3: ["JNull", []],
    4: ["JArray", [FSharpList<Json_$union>]],
    5: ["JObject", [FSharpMap<string, Json_$union>]]
}

export function Json_JNumber(Item: float64) {
    return new Json<0>(0, [Item]);
}

export function Json_JString(Item: string) {
    return new Json<1>(1, [Item]);
}

export function Json_JBool(Item: boolean) {
    return new Json<2>(2, [Item]);
}

export function Json_JNull() {
    return new Json<3>(3, []);
}

export function Json_JArray(Item: FSharpList<Json_$union>) {
    return new Json<4>(4, [Item]);
}

export function Json_JObject(Item: FSharpMap<string, Json_$union>) {
    return new Json<5>(5, [Item]);
}

export class Json<Tag extends keyof Json_$cases> extends Union<Tag, Json_$cases[Tag][0]> {
    constructor(readonly tag: Tag, readonly fields: Json_$cases[Tag][1]) {
        super();
    }
    cases() {
        return ["JNumber", "JString", "JBool", "JNull", "JArray", "JObject"];
    }
}

export function Json_$reflection(): TypeInfo {
    return union_type("Fable.SimpleJson.Json", [], Json, () => [[["Item", float64_type]], [["Item", string_type]], [["Item", bool_type]], [], [["Item", list_type(Json_$reflection())]], [["Item", class_type("Microsoft.FSharp.Collections.FSharpMap`2", [string_type, Json_$reflection()])]]]);
}

