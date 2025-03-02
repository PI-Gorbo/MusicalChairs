import { Parsimmon_parse } from "../Fable.Parsimmon.4.0.0/Parsimmon.fs.js";
import { jsonParser } from "./Parser.fs.js";
import { Json, Json_JObject, Json_JArray, Json_JNull, Json_JBool, Json_JNumber, Json_JString, Json_$union } from "./Json.fs.js";
import { some, value as value_5, Option } from "../fable-library-ts.4.24.0/Option.js";
import { join, toText, printf, toFail } from "../fable-library-ts.4.24.0/String.js";
import { int32, float64 } from "../fable-library-ts.4.24.0/Int32.js";
import { head, tail, isEmpty, empty, singleton, concat, ofArray, map as map_1, FSharpList } from "../fable-library-ts.4.24.0/List.js";
import { tryFind, ofList, toList, FSharpMap } from "../fable-library-ts.4.24.0/Map.js";
import { curry2, comparePrimitives, isIterable, defaultOf, IDisposable, disposeSafe, IEnumerator, getEnumerator } from "../fable-library-ts.4.24.0/Util.js";
import { toDecimal } from "../fable-library-ts.4.24.0/BigInt.js";
import { toString } from "../fable-library-ts.4.24.0/Date.js";
import { $007CNativeObject$007C_$007C, $007CNativeArray$007C_$007C, $007CNull$007C_$007C, $007CNativeBool$007C_$007C, $007CNativeNumber$007C_$007C, $007CNativeString$007C_$007C } from "./TypeCheck.fs.js";
import { map as map_2 } from "../fable-library-ts.4.24.0/Array.js";
import { map as map_3, delay, toList as toList_1 } from "../fable-library-ts.4.24.0/Seq.js";

export function InteropUtil_isDateOffset(x: any): boolean {
    if (x instanceof Date) {
        return "offset" in x;
    }
    else {
        return false;
    }
}

export function InteropUtil_isObjectLiteral(x: any): boolean {
    return (typeof x) === "object";
}

export function InteropUtil_isBigInt(x: any): boolean {
    if ((((!(x == null) && InteropUtil_isObjectLiteral(x)) && ("signInt" in x)) && ("v" in x)) && ("digits" in (x["v"]))) {
        return "bound" in (x["v"]);
    }
    else {
        return false;
    }
}

/**
 * Tries to parse a string into a Json structured JSON data.
 */
export function SimpleJson_tryParse(input: string): Option<Json_$union> {
    return Parsimmon_parse<Json_$union>(input, jsonParser);
}

/**
 * Parses the input string into a structured JSON data. Fails with an exception if parsing fails.
 */
export function SimpleJson_parse(input: string): Json_$union {
    const matchValue: Option<Json_$union> = SimpleJson_tryParse(input);
    if (matchValue == null) {
        return toFail(printf("Could not parse the JSON input: %s"))(input);
    }
    else {
        return value_5(matchValue);
    }
}

/**
 * Stringifies a Json object back to string representation
 */
export function SimpleJson_toString(_arg: Json_$union): string {
    switch (_arg.tag) {
        case /* JBool */ 2:
            if (_arg.fields[0]) {
                return "true";
            }
            else {
                return "false";
            }
        case /* JNumber */ 0: {
            const number: float64 = _arg.fields[0];
            return number.toString();
        }
        case /* JString */ 1: {
            const text: string = _arg.fields[0];
            return toText(printf("\"%s\""))(text);
        }
        case /* JArray */ 4: {
            const elements: FSharpList<Json_$union> = _arg.fields[0];
            const arg_1: string = join(",", map_1<Json_$union, string>(SimpleJson_toString, elements));
            return toText(printf("[%s]"))(arg_1);
        }
        case /* JObject */ 5: {
            const map: FSharpMap<string, Json_$union> = _arg.fields[0];
            const arg_4: string = join(",", map_1<[string, Json_$union], string>((tupledArg: [string, Json_$union]): string => {
                const arg_3: string = SimpleJson_toString(tupledArg[1]);
                return toText(printf("\"%s\":%s"))(tupledArg[0])(arg_3);
            }, toList<string, Json_$union>(map)));
            return toText(printf("{%s}"))(arg_4);
        }
        default:
            return "null";
    }
}

export function SimpleJson_toPlainObject(input: Json_$union): any {
    switch (input.tag) {
        case /* JBool */ 2:
            return input.fields[0];
        case /* JNumber */ 0:
            return input.fields[0];
        case /* JString */ 1:
            return input.fields[0];
        case /* JArray */ 4: {
            const array: any[] = [];
            const enumerator: IEnumerator<Json_$union> = getEnumerator(input.fields[0]);
            try {
                while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                    const value_3: Json_$union = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                    void (array.push(SimpleJson_toPlainObject(value_3)));
                }
            }
            finally {
                disposeSafe(enumerator as IDisposable);
            }
            return array;
        }
        case /* JObject */ 5: {
            const map: FSharpMap<string, Json_$union> = input.fields[0];
            const jsObject: any = ({});
            const enumerator_1: IEnumerator<[string, Json_$union]> = getEnumerator(toList<string, Json_$union>(map));
            try {
                while (enumerator_1["System.Collections.IEnumerator.MoveNext"]()) {
                    const forLoopVar: [string, Json_$union] = enumerator_1["System.Collections.Generic.IEnumerator`1.get_Current"]();
                    jsObject[forLoopVar[0]] = SimpleJson_toPlainObject(forLoopVar[1]);
                }
            }
            finally {
                disposeSafe(enumerator_1 as IDisposable);
            }
            return jsObject;
        }
        default:
            return defaultOf();
    }
}

export function SimpleJson_stringify<a>(value: a): string {
    if (value == null) {
        return JSON.stringify(defaultOf());
    }
    else {
        return JSON.stringify(value, (key: string, jsonValue: any): any => {
            if (InteropUtil_isBigInt(jsonValue)) {
                const bigInt: bigint = jsonValue;
                return toDecimal(bigInt).toString();
            }
            else {
                return (jsonValue instanceof Date) ? toString(jsonValue, "o") : ((typeof jsonValue === "string") ? jsonValue : (isIterable(jsonValue) ? (Array.isArray(jsonValue) ? jsonValue : (Array.from(jsonValue))) : (InteropUtil_isBigInt(jsonValue) ? toDecimal(jsonValue).toString() : (InteropUtil_isDateOffset(jsonValue) ? toString(jsonValue, "O") : jsonValue))));
            }
        }, some(0));
    }
}

export function SimpleJson_parseNative$0027(x: any): Json_$union {
    const activePatternResult: Option<string> = $007CNativeString$007C_$007C(x);
    if (activePatternResult != null) {
        const str: string = value_5(activePatternResult);
        return Json_JString(str);
    }
    else {
        const activePatternResult_1: Option<float64> = $007CNativeNumber$007C_$007C(x);
        if (activePatternResult_1 != null) {
            const number: float64 = value_5(activePatternResult_1);
            return Json_JNumber(number);
        }
        else {
            const activePatternResult_2: Option<boolean> = $007CNativeBool$007C_$007C(x);
            if (activePatternResult_2 != null) {
                const value: boolean = value_5(activePatternResult_2);
                return Json_JBool(value);
            }
            else if ($007CNull$007C_$007C(x) != null) {
                return Json_JNull();
            }
            else {
                const activePatternResult_4: Option<any[]> = $007CNativeArray$007C_$007C(x);
                if (activePatternResult_4 != null) {
                    const arr: any[] = value_5(activePatternResult_4);
                    return Json_JArray(ofArray<Json_$union>(map_2<any, Json_$union>(SimpleJson_parseNative$0027, arr)));
                }
                else {
                    const activePatternResult_5: Option<any> = $007CNativeObject$007C_$007C(x);
                    if (activePatternResult_5 != null) {
                        const object: any = value_5(activePatternResult_5);
                        return Json_JObject(ofList<string, Json_$union>(toList_1<[string, Json_$union]>(delay<[string, Json_$union]>((): Iterable<[string, Json_$union]> => map_3<string, [string, Json_$union]>((key: string): [string, Json_$union] => ([key, SimpleJson_parseNative$0027(object[key])] as [string, Json_$union]), Object.keys(object)))), {
                            Compare: comparePrimitives,
                        }));
                    }
                    else {
                        return Json_JNull();
                    }
                }
            }
        }
    }
}

/**
 * Parses and converts the input string to Json using Javascript's native parsing capabilities
 */
export function SimpleJson_parseNative(input: string): Json_$union {
    return SimpleJson_parseNative$0027(JSON.parse(input));
}

export function SimpleJson_tryParseNative(input: string): Option<Json_$union> {
    try {
        return SimpleJson_parseNative(input);
    }
    catch (ex: any) {
        return undefined;
    }
}

/**
 * Tries to convert an object literal to the Json by calling JSON.stringify on the object first
 */
export function SimpleJson_fromObjectLiteral<a>(x: a): Option<Json_$union> {
    try {
        return SimpleJson_parseNative$0027(x);
    }
    catch (matchValue: any) {
        return undefined;
    }
}

/**
 * Transforms all keys of the objects within the Json structure
 */
export function SimpleJson_mapKeys(f: ((arg0: string) => string), _arg: Json_$union): Json_$union {
    switch (_arg.tag) {
        case /* JObject */ 5:
            return Json_JObject(ofList<string, Json_$union>(map_1<[string, Json_$union], [string, Json_$union]>((tupledArg: [string, Json_$union]): [string, Json_$union] => ([f(tupledArg[0]), SimpleJson_mapKeys(f, tupledArg[1])] as [string, Json_$union]), toList<string, Json_$union>(_arg.fields[0])), {
                Compare: comparePrimitives,
            }));
        case /* JArray */ 4:
            return Json_JArray(map_1<Json_$union, Json_$union>((_arg_1: Json_$union): Json_$union => SimpleJson_mapKeys(f, _arg_1), _arg.fields[0]));
        default:
            return _arg;
    }
}

/**
 * Transforms object values recursively using function `f` that takes the key and value of the object and returns a new value
 */
export function SimpleJson_mapbyKey(f: ((arg0: string, arg1: Json_$union) => Json_$union), _arg: Json_$union): Json_$union {
    switch (_arg.tag) {
        case /* JObject */ 5:
            return Json_JObject(ofList<string, Json_$union>(map_1<[string, Json_$union], [string, Json_$union]>((tupledArg: [string, Json_$union]): [string, Json_$union] => {
                const key: string = tupledArg[0];
                return [key, f(key, tupledArg[1])] as [string, Json_$union];
            }, toList<string, Json_$union>(_arg.fields[0])), {
                Compare: comparePrimitives,
            }));
        case /* JArray */ 4:
            return Json_JArray(map_1<Json_$union, Json_$union>((_arg_1: Json_$union): Json_$union => SimpleJson_mapbyKey(f, _arg_1), _arg.fields[0]));
        default:
            return _arg;
    }
}

/**
 * Transforms keys of object selectively by path segments
 */
export function SimpleJson_mapKeysByPath(f: ((arg0: FSharpList<string>) => Option<string>), json: Json_$union): Json_$union {
    const mapKey = (xs: FSharpList<string>, _arg: Json_$union): Json_$union => {
        switch (_arg.tag) {
            case /* JObject */ 5:
                return Json_JObject(ofList<string, Json_$union>(map_1<[string, Json_$union], [string, Json_$union]>((tupledArg: [string, Json_$union]): [string, Json_$union] => {
                    const key: string = tupledArg[0];
                    const value: Json_$union = tupledArg[1];
                    const keyPath: FSharpList<string> = concat<string>([xs, singleton(key)]);
                    const matchValue: Option<string> = f(keyPath);
                    if (matchValue == null) {
                        return [key, mapKey(keyPath, value)] as [string, Json_$union];
                    }
                    else {
                        return [value_5(matchValue), mapKey(keyPath, value)] as [string, Json_$union];
                    }
                }, toList<string, Json_$union>(_arg.fields[0])), {
                    Compare: comparePrimitives,
                }));
            case /* JArray */ 4: {
                const values: FSharpList<Json_$union> = _arg.fields[0];
                return Json_JArray(map_1<Json_$union, Json_$union>(curry2(mapKey)(xs), values));
            }
            default:
                return _arg;
        }
    };
    return mapKey(empty<string>(), json);
}

export function SimpleJson_readPath(keys_mut: FSharpList<string>, input_mut: Json_$union): Option<Json_$union> {
    SimpleJson_readPath:
    while (true) {
        const keys: FSharpList<string> = keys_mut, input: Json_$union = input_mut;
        let matchResult: int32, dict: FSharpMap<string, Json_$union>, key: string, dict_1: FSharpMap<string, Json_$union>, firstKey: string, rest: FSharpList<string>;
        if (!isEmpty(keys)) {
            if (isEmpty(tail(keys))) {
                if (input.tag === /* JObject */ 5) {
                    matchResult = 1;
                    dict = input.fields[0];
                    key = head(keys);
                }
                else {
                    matchResult = 3;
                }
            }
            else if (input.tag === /* JObject */ 5) {
                matchResult = 2;
                dict_1 = input.fields[0];
                firstKey = head(keys);
                rest = tail(keys);
            }
            else {
                matchResult = 3;
            }
        }
        else {
            matchResult = 0;
        }
        switch (matchResult) {
            case 0:
                return undefined;
            case 1:
                return tryFind<string, Json_$union>(key!, dict!);
            case 2: {
                const matchValue_1: Option<Json_$union> = tryFind<string, Json_$union>(firstKey!, dict_1!);
                let matchResult_1: int32, nextDict: FSharpMap<string, Json_$union>;
                if (matchValue_1 != null) {
                    if (value_5(matchValue_1).tag === /* JObject */ 5) {
                        matchResult_1 = 0;
                        nextDict = (value_5(matchValue_1) as Json<5>).fields[0];
                    }
                    else {
                        matchResult_1 = 1;
                    }
                }
                else {
                    matchResult_1 = 1;
                }
                switch (matchResult_1) {
                    case 0: {
                        keys_mut = rest;
                        input_mut = Json_JObject(nextDict!);
                        continue SimpleJson_readPath;
                    }
                    default:
                        return undefined;
                }
            }
            default:
                return undefined;
        }
        break;
    }
}

