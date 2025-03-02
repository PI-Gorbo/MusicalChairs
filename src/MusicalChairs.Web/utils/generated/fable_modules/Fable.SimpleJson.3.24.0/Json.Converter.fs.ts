import isBrowser from "./isBrowser.js";
import { toArray as toArray_2, isEmpty as isEmpty_1, find, count, containsKey, toList as toList_1, tryFind, FSharpMap, remove, ofList } from "../fable-library-ts.4.24.0/Map.js";
import { uint8, tryParse, parse as parse_1, float64, int32 } from "../fable-library-ts.4.24.0/Int32.js";
import { map as map_3, choose, tryFind as tryFind_2, toArray, length, tail as tail_1, head, isEmpty, FSharpList, empty, singleton, ofArray } from "../fable-library-ts.4.24.0/List.js";
import { int64ToString, int32ToString, ISet, IDisposable, disposeSafe, IEnumerator, getEnumerator, IMap, structuralHash, safeHash, compare, IComparable, equals, defaultOf, comparePrimitives } from "../fable-library-ts.4.24.0/Util.js";
import { toString as toString_2, FSharpRef, Union } from "../fable-library-ts.4.24.0/Types.js";
import { Json_JNull, Json_JString, Json_JObject, Json_JArray, Json, Json_$reflection, Json_$union } from "./Json.fs.js";
import { getUnionFields, getRecordField, makeRecord, fullName, makeUnion, name as name_2, union_type, string_type, TypeInfo } from "../fable-library-ts.4.24.0/Reflection.js";
import { toArray as toArray_1, map as map_4, collect, tryFind as tryFind_3, forAll, empty as empty_1, singleton as singleton_1, append, delay, toList } from "../fable-library-ts.4.24.0/Seq.js";
import { some, value as value_91, Option, map as map_1 } from "../fable-library-ts.4.24.0/Option.js";
import { TypeInfo_Tuple, UnionCase, RecordField, TypeInfo_$union } from "./TypeInfo.fs.js";
import { find as find_1, concat, mapIndexed, equalsWith, zip, map as map_2, tryFind as tryFind_1, item as item_1 } from "../fable-library-ts.4.24.0/Array.js";
import { join, toText, fromBase64String, printf, toFail, substring } from "../fable-library-ts.4.24.0/String.js";
import { parse } from "../fable-library-ts.4.24.0/Double.js";
import { Uri } from "../fable-library-ts.4.24.0/Uri.js";
import { toString as toString_1 } from "../fable-library-ts.4.24.0/Decimal.js";
import Decimal from "../fable-library-ts.4.24.0/Decimal.js";
import { toString, fromInt32, parse as parse_3, toInt64, int64, fromFloat64, toUInt64 } from "../fable-library-ts.4.24.0/BigInt.js";
import { tryParse as tryParse_1, parse as parse_2 } from "../fable-library-ts.4.24.0/Long.js";
import { SimpleJson_stringify, SimpleJson_parseNative, SimpleJson_parse, SimpleJson_toString, SimpleJson_toPlainObject } from "./SimpleJson.fs.js";
import { toString as toString_3, parse as parse_4 } from "../fable-library-ts.4.24.0/Date.js";
import { fromUnixTimeSeconds, parse as parse_5 } from "../fable-library-ts.4.24.0/DateOffset.js";
import { dayNumber, fromDayNumber } from "../fable-library-ts.4.24.0/DateOnly.js";
import { fromTicks } from "../fable-library-ts.4.24.0/TimeOnly.js";
import { parse as parse_6 } from "../fable-library-ts.4.24.0/Guid.js";
import { toInt64 as toInt64_1, getBytesInt32 } from "../fable-library-ts.4.24.0/BitConverter.js";
import { ofList as ofList_1 } from "../fable-library-ts.4.24.0/Set.js";
import { Dictionary } from "../fable-library-ts.4.24.0/MutableMap.js";
import { FSharpResult$2_$union } from "../fable-library-ts.4.24.0/Result.js";
import { addToSet, addToDict } from "../fable-library-ts.4.24.0/MapUtil.js";
import { HashSet } from "../fable-library-ts.4.24.0/MutableSet.js";
import { enumUnion, isPrimitive } from "./TypeInfo.Converter.fs.js";
import quote from "./quote.js";
import { ticks } from "../fable-library-ts.4.24.0/TimeSpan.js";

export const Convert_isBrowser: (() => boolean) = isBrowser;

export const Convert_insideBrowser: boolean = Convert_isBrowser();

function Convert_isDefined(value: any): boolean {
    return !((value === undefined));
}

/**
 * Uses internal representation of F# maps to determine whether we are using Fable 3 or not
 */
export function Convert_usingFable3(): boolean {
    const map: any = JSON.parse(JSON.stringify(ofList<int32, int32>(ofArray([[1, 1] as [int32, int32], [2, 2] as [int32, int32]]), {
        Compare: comparePrimitives,
    })));
    const tree: any = map["tree"];
    if ((Convert_isDefined(tree) && Convert_isDefined(tree["k"])) && Convert_isDefined(tree["v"])) {
        return Convert_isDefined(tree["h"]);
    }
    else {
        return false;
    }
}

export const Convert_isUsingFable3: boolean = Convert_usingFable3();

export type Convert_InternalMap_$union = 
    | Convert_InternalMap<0>
    | Convert_InternalMap<1>
    | Convert_InternalMap<2>

export type Convert_InternalMap_$cases = {
    0: ["MapEmpty", []],
    1: ["MapOne", [string, Json_$union]],
    2: ["MapNode", [string, Json_$union, Convert_InternalMap_$union, Convert_InternalMap_$union]]
}

export function Convert_InternalMap_MapEmpty() {
    return new Convert_InternalMap<0>(0, []);
}

export function Convert_InternalMap_MapOne(Item1: string, Item2: Json_$union) {
    return new Convert_InternalMap<1>(1, [Item1, Item2]);
}

export function Convert_InternalMap_MapNode(Item1: string, Item2: Json_$union, Item3: Convert_InternalMap_$union, Item4: Convert_InternalMap_$union) {
    return new Convert_InternalMap<2>(2, [Item1, Item2, Item3, Item4]);
}

export class Convert_InternalMap<Tag extends keyof Convert_InternalMap_$cases> extends Union<Tag, Convert_InternalMap_$cases[Tag][0]> {
    constructor(readonly tag: Tag, readonly fields: Convert_InternalMap_$cases[Tag][1]) {
        super();
    }
    cases() {
        return ["MapEmpty", "MapOne", "MapNode"];
    }
}

export function Convert_InternalMap_$reflection(): TypeInfo {
    return union_type("Fable.SimpleJson.Convert.InternalMap", [], Convert_InternalMap, () => [[], [["Item1", string_type], ["Item2", Json_$reflection()]], [["Item1", string_type], ["Item2", Json_$reflection()], ["Item3", Convert_InternalMap_$reflection()], ["Item4", Convert_InternalMap_$reflection()]]]);
}

export function Convert_flattenMap(_arg: Convert_InternalMap_$union): FSharpList<[string, Json_$union]> {
    switch (_arg.tag) {
        case /* MapOne */ 1: {
            const value: Json_$union = _arg.fields[1];
            const key: string = _arg.fields[0];
            return singleton([key, value] as [string, Json_$union]);
        }
        case /* MapNode */ 2: {
            const value_1: Json_$union = _arg.fields[1];
            const right: Convert_InternalMap_$union = _arg.fields[3];
            const left: Convert_InternalMap_$union = _arg.fields[2];
            const key_1: string = _arg.fields[0];
            return toList<[string, Json_$union]>(delay<[string, Json_$union]>((): Iterable<[string, Json_$union]> => append<[string, Json_$union]>(Convert_flattenMap(left), delay<[string, Json_$union]>((): Iterable<[string, Json_$union]> => append<[string, Json_$union]>(Convert_flattenMap(right), delay<[string, Json_$union]>((): Iterable<[string, Json_$union]> => singleton_1<[string, Json_$union]>([key_1, value_1] as [string, Json_$union])))))));
        }
        default:
            return empty<[string, Json_$union]>();
    }
}

export function Convert_$007CKeyValue$007C_$007C(key: string, map: FSharpMap<string, Json_$union>): Option<[string, Json_$union, FSharpMap<string, Json_$union>]> {
    return map_1<Json_$union, [string, Json_$union, FSharpMap<string, Json_$union>]>((value: Json_$union): [string, Json_$union, FSharpMap<string, Json_$union>] => ([key, value, remove<string, Json_$union>(key, map)] as [string, Json_$union, FSharpMap<string, Json_$union>]), tryFind<string, Json_$union>(key, map));
}

export function Convert_$007CNonArray$007C_$007C(_arg: Json_$union): Option<Json_$union> {
    if (_arg.tag === /* JArray */ 4) {
        return undefined;
    }
    else {
        const json: Json_$union = _arg;
        return json;
    }
}

export function Convert_$007CMapEmpty$007C_$007C(json: Json_$union): Option<Json_$union> {
    let matchResult: int32;
    if (json.tag === /* JString */ 1) {
        if (json.fields[0] === "MapEmpty") {
            matchResult = 0;
        }
        else {
            matchResult = 1;
        }
    }
    else {
        matchResult = 1;
    }
    switch (matchResult) {
        case 0:
            return json;
        default:
            return undefined;
    }
}

export function Convert_$007CMapKey$007C_$007C(_arg: Json_$union): Option<string> {
    switch (_arg.tag) {
        case /* JNumber */ 0: {
            const number: float64 = _arg.fields[0];
            return number.toString();
        }
        case /* JString */ 1: {
            const key: string = _arg.fields[0];
            return key;
        }
        default:
            return undefined;
    }
}

export function Convert_$007CMapOne$007C_$007C(_arg: Json_$union): Option<[string, Json_$union]> {
    let matchResult: int32, key: string, value: Json_$union;
    if (_arg.tag === /* JArray */ 4) {
        if (!isEmpty(_arg.fields[0])) {
            if (head(_arg.fields[0]).tag === /* JString */ 1) {
                if ((head(_arg.fields[0]) as Json<1>).fields[0] === "MapOne") {
                    if (!isEmpty(tail_1(_arg.fields[0]))) {
                        const activePatternResult: Option<string> = Convert_$007CMapKey$007C_$007C(head(tail_1(_arg.fields[0])));
                        if (activePatternResult != null) {
                            if (!isEmpty(tail_1(tail_1(_arg.fields[0])))) {
                                if (isEmpty(tail_1(tail_1(tail_1(_arg.fields[0]))))) {
                                    matchResult = 0;
                                    key = value_91(activePatternResult);
                                    value = head(tail_1(tail_1(_arg.fields[0])));
                                }
                                else {
                                    matchResult = 1;
                                }
                            }
                            else {
                                matchResult = 1;
                            }
                        }
                        else {
                            matchResult = 1;
                        }
                    }
                    else {
                        matchResult = 1;
                    }
                }
                else {
                    matchResult = 1;
                }
            }
            else {
                matchResult = 1;
            }
        }
        else {
            matchResult = 1;
        }
    }
    else {
        matchResult = 1;
    }
    switch (matchResult) {
        case 0:
            return [key!, value!] as [string, Json_$union];
        default:
            return undefined;
    }
}

export function Convert_$007CMapNode$007C_$007C(_arg: Json_$union): Option<[string, Json_$union, Json_$union, Json_$union]> {
    let matchResult: int32, key: string, left: Json_$union, right: Json_$union, value: Json_$union;
    if (_arg.tag === /* JArray */ 4) {
        if (!isEmpty(_arg.fields[0])) {
            if (head(_arg.fields[0]).tag === /* JString */ 1) {
                if ((head(_arg.fields[0]) as Json<1>).fields[0] === "MapNode") {
                    if (!isEmpty(tail_1(_arg.fields[0]))) {
                        const activePatternResult: Option<string> = Convert_$007CMapKey$007C_$007C(head(tail_1(_arg.fields[0])));
                        if (activePatternResult != null) {
                            if (!isEmpty(tail_1(tail_1(_arg.fields[0])))) {
                                if (!isEmpty(tail_1(tail_1(tail_1(_arg.fields[0]))))) {
                                    if (!isEmpty(tail_1(tail_1(tail_1(tail_1(_arg.fields[0])))))) {
                                        if (!isEmpty(tail_1(tail_1(tail_1(tail_1(tail_1(_arg.fields[0]))))))) {
                                            if (head(tail_1(tail_1(tail_1(tail_1(tail_1(_arg.fields[0])))))).tag === /* JNumber */ 0) {
                                                if (isEmpty(tail_1(tail_1(tail_1(tail_1(tail_1(tail_1(_arg.fields[0])))))))) {
                                                    matchResult = 0;
                                                    key = value_91(activePatternResult);
                                                    left = head(tail_1(tail_1(tail_1(_arg.fields[0]))));
                                                    right = head(tail_1(tail_1(tail_1(tail_1(_arg.fields[0])))));
                                                    value = head(tail_1(tail_1(_arg.fields[0])));
                                                }
                                                else {
                                                    matchResult = 1;
                                                }
                                            }
                                            else {
                                                matchResult = 1;
                                            }
                                        }
                                        else {
                                            matchResult = 1;
                                        }
                                    }
                                    else {
                                        matchResult = 1;
                                    }
                                }
                                else {
                                    matchResult = 1;
                                }
                            }
                            else {
                                matchResult = 1;
                            }
                        }
                        else {
                            matchResult = 1;
                        }
                    }
                    else {
                        matchResult = 1;
                    }
                }
                else {
                    matchResult = 1;
                }
            }
            else {
                matchResult = 1;
            }
        }
        else {
            matchResult = 1;
        }
    }
    else {
        matchResult = 1;
    }
    switch (matchResult) {
        case 0:
            return [key!, value!, left!, right!] as [string, Json_$union, Json_$union, Json_$union];
        default:
            return undefined;
    }
}

export function Convert_generateMap(json: Json_$union): Option<Convert_InternalMap_$union> {
    if (Convert_$007CMapEmpty$007C_$007C(json) != null) {
        return Convert_InternalMap_MapEmpty();
    }
    else {
        const activePatternResult_1: Option<[string, Json_$union]> = Convert_$007CMapOne$007C_$007C(json);
        if (activePatternResult_1 != null) {
            const key: string = value_91(activePatternResult_1)[0];
            const value: Json_$union = value_91(activePatternResult_1)[1];
            return Convert_InternalMap_MapOne(key, value);
        }
        else {
            const activePatternResult_2: Option<[string, Json_$union, Json_$union, Json_$union]> = Convert_$007CMapNode$007C_$007C(json);
            if (activePatternResult_2 != null) {
                const key_1: string = value_91(activePatternResult_2)[0];
                const left: Json_$union = value_91(activePatternResult_2)[2];
                const right: Json_$union = value_91(activePatternResult_2)[3];
                const value_1: Json_$union = value_91(activePatternResult_2)[1];
                const matchValue: Option<Convert_InternalMap_$union> = Convert_generateMap(left);
                const matchValue_1: Option<Convert_InternalMap_$union> = Convert_generateMap(right);
                let matchResult: int32, leftMap: Convert_InternalMap_$union, rightMap: Convert_InternalMap_$union;
                if (matchValue != null) {
                    if (matchValue_1 != null) {
                        matchResult = 0;
                        leftMap = value_91(matchValue);
                        rightMap = value_91(matchValue_1);
                    }
                    else {
                        matchResult = 1;
                    }
                }
                else {
                    matchResult = 1;
                }
                switch (matchResult) {
                    case 0:
                        return Convert_InternalMap_MapNode(key_1, value_1, leftMap!, rightMap!);
                    default:
                        return undefined;
                }
            }
            else {
                return undefined;
            }
        }
    }
}

export function Convert_flatteFable3Map(tree: FSharpMap<string, Json_$union>): FSharpList<[string, Json_$union]> {
    return toList<[string, Json_$union]>(delay<[string, Json_$union]>((): Iterable<[string, Json_$union]> => {
        let matchValue: Option<Json_$union>, matchValue_1: Option<Json_$union>, key: string, value: Json_$union;
        return append<[string, Json_$union]>((matchValue = tryFind<string, Json_$union>("k", tree), (matchValue_1 = tryFind<string, Json_$union>("v", tree), (matchValue != null) ? ((value_91(matchValue).tag === /* JString */ 1) ? ((matchValue_1 != null) ? ((key = (value_91(matchValue) as Json<1>).fields[0], (value = value_91(matchValue_1), singleton_1<[string, Json_$union]>([key, value] as [string, Json_$union])))) : (empty_1<[string, Json_$union]>())) : (empty_1<[string, Json_$union]>())) : (empty_1<[string, Json_$union]>()))), delay<[string, Json_$union]>((): Iterable<[string, Json_$union]> => {
            let matchValue_3: Option<Json_$union>, left: FSharpMap<string, Json_$union>;
            return append<[string, Json_$union]>((matchValue_3 = tryFind<string, Json_$union>("left", tree), (matchValue_3 != null) ? ((value_91(matchValue_3).tag === /* JObject */ 5) ? ((left = (value_91(matchValue_3) as Json<5>).fields[0], Convert_flatteFable3Map(left))) : (empty_1<[string, Json_$union]>())) : (empty_1<[string, Json_$union]>())), delay<[string, Json_$union]>((): Iterable<[string, Json_$union]> => {
                const matchValue_4: Option<Json_$union> = tryFind<string, Json_$union>("right", tree);
                let matchResult: int32, right: FSharpMap<string, Json_$union>;
                if (matchValue_4 != null) {
                    if (value_91(matchValue_4).tag === /* JObject */ 5) {
                        matchResult = 0;
                        right = (value_91(matchValue_4) as Json<5>).fields[0];
                    }
                    else {
                        matchResult = 1;
                    }
                }
                else {
                    matchResult = 1;
                }
                switch (matchResult) {
                    case 0:
                        return Convert_flatteFable3Map(right!);
                    default: {
                        return empty_1<[string, Json_$union]>();
                    }
                }
            }));
        }));
    }));
}

export function Convert_flattenFable3Lists(linkedList: FSharpMap<string, Json_$union>): FSharpList<Json_$union> {
    return toList<Json_$union>(delay<Json_$union>((): Iterable<Json_$union> => {
        let matchValue: Option<Json_$union>, value: Json_$union;
        return append<Json_$union>((matchValue = tryFind<string, Json_$union>("head", linkedList), (matchValue == null) ? (empty_1<Json_$union>()) : ((value = value_91(matchValue), singleton_1<Json_$union>(value)))), delay<Json_$union>((): Iterable<Json_$union> => {
            const matchValue_1: Option<Json_$union> = tryFind<string, Json_$union>("tail", linkedList);
            let matchResult: int32, tail: FSharpMap<string, Json_$union>;
            if (matchValue_1 != null) {
                if (value_91(matchValue_1).tag === /* JObject */ 5) {
                    matchResult = 0;
                    tail = (value_91(matchValue_1) as Json<5>).fields[0];
                }
                else {
                    matchResult = 1;
                }
            }
            else {
                matchResult = 1;
            }
            switch (matchResult) {
                case 0:
                    return Convert_flattenFable3Lists(tail!);
                default: {
                    return empty_1<Json_$union>();
                }
            }
        }));
    }));
}

/**
 * Returns whether the type information resembles a type of a sequence of elements (including tuples)
 */
export function Convert_arrayLike(_arg: TypeInfo_$union): boolean {
    switch (_arg.tag) {
        case /* Array */ 30:
            return true;
        case /* List */ 28:
            return true;
        case /* Seq */ 31:
            return true;
        case /* Tuple */ 32:
            return true;
        case /* Set */ 29:
            return true;
        case /* ResizeArray */ 35:
            return true;
        case /* HashSet */ 36:
            return true;
        default:
            return false;
    }
}

export function Convert_isRecord(_arg: TypeInfo_$union): boolean {
    if (_arg.tag === /* Record */ 39) {
        const recordType: (() => [RecordField[], any]) = _arg.fields[0];
        return true;
    }
    else {
        return false;
    }
}

export function Convert_unionOfRecords(_arg: TypeInfo_$union): boolean {
    if (_arg.tag === /* Union */ 40) {
        const getCases: (() => [UnionCase[], any]) = _arg.fields[0];
        const patternInput: [UnionCase[], any] = getCases();
        const unionType: any = patternInput[1];
        const unionCases: UnionCase[] = patternInput[0];
        return forAll<UnionCase>((case$: UnionCase): boolean => {
            if (case$.CaseTypes.length === 1) {
                return Convert_isRecord(item_1(0, case$.CaseTypes));
            }
            else {
                return false;
            }
        }, unionCases);
    }
    else {
        return false;
    }
}

export function Convert_optional(_arg: TypeInfo_$union): boolean {
    if (_arg.tag === /* Option */ 27) {
        return true;
    }
    else {
        return false;
    }
}

export function Convert_isQuoted(input: string): boolean {
    if (input.startsWith("\"")) {
        return input.endsWith("\"");
    }
    else {
        return false;
    }
}

export function Convert_betweenQuotes(input: string): string {
    return ("\"" + input) + "\"";
}

export function Convert_removeQuotes(input: string): string {
    return substring(input, 1, input.length - 2);
}

export function Convert_fromJsonAs(input_mut: Json_$union, typeInfo_mut: TypeInfo_$union): any {
    let foundCase: UnionCase, foundCase_1: UnionCase, testExpr: TypeInfo_$union[], otherwise: FSharpList<[string, Json_$union]>, otherwise_1: FSharpList<[string, Json_$union]>, tree: FSharpList<Json_$union>, comparer: FSharpMap<string, Json_$union>, tree_1: FSharpMap<string, Json_$union>, comparer_1: FSharpMap<string, Json_$union>, value: string, value_1: string, optionalTypeDelayed: (() => TypeInfo_$union), jsonValue: Json_$union, getTypes: (() => [UnionCase[], any]), caseName: string, optionalTypeDelayed_1: (() => TypeInfo_$union), jsonValue_1: Json_$union, optionalTypeDelayed_2: (() => TypeInfo_$union), jsonValue_2: Json_$union, optionalTypeDelayed_3: (() => TypeInfo_$union), jsonValue_3: Json_$union, optionalTypeDelayed_4: (() => TypeInfo_$union), jsonValue_4: Json_$union;
    Convert_fromJsonAs:
    while (true) {
        const input: Json_$union = input_mut, typeInfo: TypeInfo_$union = typeInfo_mut;
        let matchResult: int32, value_2: float64, value_3: string, value_4: string, value_5: float64, value_6: string, value_7: string, value_8: float64, value_9: boolean, value_10: string, value_11: string, value_12: float64, value_13: string, value_14: float64, value_15: string, value_16: string, value_17: float64, value_18: string, value_19: float64, value_20: float64, value_21: string, value_22: float64, value_23: string, value_24: float64, value_25: string, value_26: float64, getlElemType: (() => [TypeInfo_$union, any]), value_27: string, getElemType: (() => [TypeInfo_$union, any]), value_28: float64, getElemType_1: (() => TypeInfo_$union), value_29: string, genericJson: Json_$union, value_30: string, value_31: string, value_32: float64, value_33: float64, value_34: string, value_35: string, value_36: float64, value_37: string, value_38: string, value_39: float64, value_40: float64, value_41: string, value_42: string, getTypes_1: (() => [UnionCase[], any]), values: FSharpMap<string, Json_$union>, jsonValue_5: Json_$union, optionalTypeDelayed_5: (() => TypeInfo_$union), value_49: string, value_50: float64, dict: FSharpMap<string, Json_$union>, caseName_4: string, getTypes_2: (() => [UnionCase[], any]), caseName_5: string, getTypes_3: (() => [UnionCase[], any]), getFields: (() => [RecordField[], any]), serializedRecord: string, caseValue: FSharpList<Json_$union>, getTypes_4: (() => [UnionCase[], any]), elementTypeDelayed: (() => TypeInfo_$union), values_4: FSharpList<Json_$union>, elementTypeDelayed_1: (() => TypeInfo_$union), values_5: FSharpList<Json_$union>, elementTypeDelayed_2: (() => TypeInfo_$union), linkedList: FSharpMap<string, Json_$union>, elementTypeDelayed_3: (() => TypeInfo_$union), values_6: FSharpList<Json_$union>, elementTypeDelayed_4: (() => TypeInfo_$union), values_7: FSharpList<Json_$union>, array_12: FSharpList<Json_$union>, tupleTypesDelayed: (() => TypeInfo_$union[]), dict_1: FSharpMap<string, Json_$union>, getTypes_5: (() => [RecordField[], any]), getTypes_6: (() => [TypeInfo_$union, TypeInfo_$union]), tuples: FSharpList<Json_$union>, getTypes_7: (() => [TypeInfo_$union, TypeInfo_$union, any]), tuples_1: FSharpList<Json_$union>, dict_2: FSharpMap<string, Json_$union>, getTypes_8: (() => [TypeInfo_$union, TypeInfo_$union, any]), getType: (() => TypeInfo_$union), items: FSharpList<Json_$union>, getTypes_9: (() => [TypeInfo_$union, TypeInfo_$union]), map: FSharpMap<string, Json_$union>, getType_1: (() => any);
        switch (input.tag) {
            case /* JString */ 1: {
                switch (typeInfo.tag) {
                    case /* Float */ 9: {
                        if ((value = input.fields[0], value.toLocaleLowerCase() === "nan")) {
                            matchResult = 1;
                            value_3 = input.fields[0];
                        }
                        else {
                            matchResult = 2;
                            value_4 = input.fields[0];
                        }
                        break;
                    }
                    case /* Float32 */ 8: {
                        if ((value_1 = input.fields[0], value_1.toLocaleLowerCase() === "nan")) {
                            matchResult = 4;
                            value_6 = input.fields[0];
                        }
                        else {
                            matchResult = 5;
                            value_7 = input.fields[0];
                        }
                        break;
                    }
                    case /* Int32 */ 6: {
                        matchResult = 8;
                        value_10 = input.fields[0];
                        break;
                    }
                    case /* Char */ 1: {
                        matchResult = 9;
                        value_11 = input.fields[0];
                        break;
                    }
                    case /* String */ 2: {
                        matchResult = 11;
                        value_13 = input.fields[0];
                        break;
                    }
                    case /* Uri */ 22: {
                        matchResult = 13;
                        value_15 = input.fields[0];
                        break;
                    }
                    case /* Decimal */ 10: {
                        matchResult = 14;
                        value_16 = input.fields[0];
                        break;
                    }
                    case /* Short */ 11: {
                        matchResult = 16;
                        value_18 = input.fields[0];
                        break;
                    }
                    case /* UInt16 */ 3: {
                        matchResult = 19;
                        value_21 = input.fields[0];
                        break;
                    }
                    case /* UInt32 */ 4: {
                        matchResult = 21;
                        value_23 = input.fields[0];
                        break;
                    }
                    case /* UInt64 */ 5: {
                        matchResult = 23;
                        value_25 = input.fields[0];
                        break;
                    }
                    case /* Enum */ 38: {
                        matchResult = 25;
                        getlElemType = typeInfo.fields[0];
                        value_27 = input.fields[0];
                        break;
                    }
                    case /* Array */ 30: {
                        matchResult = 27;
                        getElemType_1 = typeInfo.fields[0];
                        value_29 = input.fields[0];
                        break;
                    }
                    case /* Object */ 23: {
                        matchResult = 30;
                        genericJson = input;
                        break;
                    }
                    case /* Long */ 12: {
                        matchResult = 31;
                        value_30 = input.fields[0];
                        break;
                    }
                    case /* Byte */ 13: {
                        matchResult = 32;
                        value_31 = input.fields[0];
                        break;
                    }
                    case /* SByte */ 14: {
                        matchResult = 35;
                        value_34 = input.fields[0];
                        break;
                    }
                    case /* BigInt */ 19: {
                        matchResult = 36;
                        value_35 = input.fields[0];
                        break;
                    }
                    case /* DateTime */ 15: {
                        matchResult = 38;
                        value_37 = input.fields[0];
                        break;
                    }
                    case /* DateTimeOffset */ 16: {
                        matchResult = 39;
                        value_38 = input.fields[0];
                        break;
                    }
                    case /* DateOnly */ 17: {
                        matchResult = 42;
                        value_41 = input.fields[0];
                        break;
                    }
                    case /* TimeOnly */ 18: {
                        matchResult = 43;
                        value_42 = input.fields[0];
                        break;
                    }
                    case /* Option */ 27: {
                        if ((optionalTypeDelayed = typeInfo.fields[0], (jsonValue = input, !equals(jsonValue, Json_JNull())))) {
                            matchResult = 46;
                            jsonValue_5 = input;
                            optionalTypeDelayed_5 = typeInfo.fields[0];
                        }
                        else {
                            matchResult = 67;
                        }
                        break;
                    }
                    case /* Guid */ 21: {
                        matchResult = 47;
                        value_49 = input.fields[0];
                        break;
                    }
                    case /* Union */ 40: {
                        if ((getTypes = typeInfo.fields[0], (caseName = input.fields[0], Convert_isQuoted(caseName)))) {
                            matchResult = 50;
                            caseName_4 = input.fields[0];
                            getTypes_2 = typeInfo.fields[0];
                        }
                        else {
                            matchResult = 51;
                            caseName_5 = input.fields[0];
                            getTypes_3 = typeInfo.fields[0];
                        }
                        break;
                    }
                    case /* Record */ 39: {
                        matchResult = 52;
                        getFields = typeInfo.fields[0];
                        serializedRecord = input.fields[0];
                        break;
                    }
                    case /* Any */ 24: {
                        matchResult = 66;
                        getType_1 = typeInfo.fields[0];
                        break;
                    }
                    default:
                        matchResult = 67;
                }
                break;
            }
            case /* JBool */ 2: {
                switch (typeInfo.tag) {
                    case /* Bool */ 7: {
                        matchResult = 7;
                        value_9 = input.fields[0];
                        break;
                    }
                    case /* Object */ 23: {
                        matchResult = 30;
                        genericJson = input;
                        break;
                    }
                    case /* Option */ 27: {
                        if ((optionalTypeDelayed_1 = typeInfo.fields[0], (jsonValue_1 = input, !equals(jsonValue_1, Json_JNull())))) {
                            matchResult = 46;
                            jsonValue_5 = input;
                            optionalTypeDelayed_5 = typeInfo.fields[0];
                        }
                        else {
                            matchResult = 67;
                        }
                        break;
                    }
                    case /* Any */ 24: {
                        matchResult = 66;
                        getType_1 = typeInfo.fields[0];
                        break;
                    }
                    default:
                        matchResult = 67;
                }
                break;
            }
            case /* JNull */ 3: {
                switch (typeInfo.tag) {
                    case /* String */ 2: {
                        matchResult = 28;
                        break;
                    }
                    case /* Unit */ 0: {
                        matchResult = 29;
                        break;
                    }
                    case /* Object */ 23: {
                        matchResult = 30;
                        genericJson = input;
                        break;
                    }
                    case /* Option */ 27: {
                        matchResult = 45;
                        break;
                    }
                    case /* Any */ 24: {
                        matchResult = 66;
                        getType_1 = typeInfo.fields[0];
                        break;
                    }
                    default:
                        matchResult = 67;
                }
                break;
            }
            case /* JObject */ 5: {
                switch (typeInfo.tag) {
                    case /* Object */ 23: {
                        matchResult = 30;
                        genericJson = input;
                        break;
                    }
                    case /* Union */ 40: {
                        matchResult = 44;
                        getTypes_1 = typeInfo.fields[0];
                        values = input.fields[0];
                        break;
                    }
                    case /* Option */ 27: {
                        if ((optionalTypeDelayed_2 = typeInfo.fields[0], (jsonValue_2 = input, !equals(jsonValue_2, Json_JNull())))) {
                            matchResult = 46;
                            jsonValue_5 = input;
                            optionalTypeDelayed_5 = typeInfo.fields[0];
                        }
                        else {
                            matchResult = 67;
                        }
                        break;
                    }
                    case /* Long */ 12: {
                        matchResult = 49;
                        dict = input.fields[0];
                        break;
                    }
                    case /* List */ 28: {
                        matchResult = 56;
                        elementTypeDelayed_2 = typeInfo.fields[0];
                        linkedList = input.fields[0];
                        break;
                    }
                    case /* Record */ 39: {
                        matchResult = 60;
                        dict_1 = input.fields[0];
                        getTypes_5 = typeInfo.fields[0];
                        break;
                    }
                    case /* Dictionary */ 34: {
                        matchResult = 63;
                        dict_2 = input.fields[0];
                        getTypes_8 = typeInfo.fields[0];
                        break;
                    }
                    case /* Map */ 33: {
                        matchResult = 65;
                        getTypes_9 = typeInfo.fields[0];
                        map = input.fields[0];
                        break;
                    }
                    case /* Any */ 24: {
                        matchResult = 66;
                        getType_1 = typeInfo.fields[0];
                        break;
                    }
                    default:
                        matchResult = 67;
                }
                break;
            }
            case /* JArray */ 4: {
                switch (typeInfo.tag) {
                    case /* Object */ 23: {
                        matchResult = 30;
                        genericJson = input;
                        break;
                    }
                    case /* Option */ 27: {
                        if ((optionalTypeDelayed_3 = typeInfo.fields[0], (jsonValue_3 = input, !equals(jsonValue_3, Json_JNull())))) {
                            matchResult = 46;
                            jsonValue_5 = input;
                            optionalTypeDelayed_5 = typeInfo.fields[0];
                        }
                        else {
                            matchResult = 67;
                        }
                        break;
                    }
                    case /* Union */ 40: {
                        matchResult = 53;
                        caseValue = input.fields[0];
                        getTypes_4 = typeInfo.fields[0];
                        break;
                    }
                    case /* Array */ 30: {
                        matchResult = 54;
                        elementTypeDelayed = typeInfo.fields[0];
                        values_4 = input.fields[0];
                        break;
                    }
                    case /* List */ 28: {
                        matchResult = 55;
                        elementTypeDelayed_1 = typeInfo.fields[0];
                        values_5 = input.fields[0];
                        break;
                    }
                    case /* Set */ 29: {
                        matchResult = 57;
                        elementTypeDelayed_3 = typeInfo.fields[0];
                        values_6 = input.fields[0];
                        break;
                    }
                    case /* Seq */ 31: {
                        matchResult = 58;
                        elementTypeDelayed_4 = typeInfo.fields[0];
                        values_7 = input.fields[0];
                        break;
                    }
                    case /* Tuple */ 32: {
                        matchResult = 59;
                        array_12 = input.fields[0];
                        tupleTypesDelayed = typeInfo.fields[0];
                        break;
                    }
                    case /* Map */ 33: {
                        matchResult = 61;
                        getTypes_6 = typeInfo.fields[0];
                        tuples = input.fields[0];
                        break;
                    }
                    case /* Dictionary */ 34: {
                        matchResult = 62;
                        getTypes_7 = typeInfo.fields[0];
                        tuples_1 = input.fields[0];
                        break;
                    }
                    case /* HashSet */ 36: {
                        matchResult = 64;
                        getType = typeInfo.fields[0];
                        items = input.fields[0];
                        break;
                    }
                    case /* Any */ 24: {
                        matchResult = 66;
                        getType_1 = typeInfo.fields[0];
                        break;
                    }
                    default:
                        matchResult = 67;
                }
                break;
            }
            default:
                switch (typeInfo.tag) {
                    case /* Float */ 9: {
                        matchResult = 0;
                        value_2 = input.fields[0];
                        break;
                    }
                    case /* Float32 */ 8: {
                        matchResult = 3;
                        value_5 = input.fields[0];
                        break;
                    }
                    case /* Int32 */ 6: {
                        matchResult = 6;
                        value_8 = input.fields[0];
                        break;
                    }
                    case /* Char */ 1: {
                        matchResult = 10;
                        value_12 = input.fields[0];
                        break;
                    }
                    case /* String */ 2: {
                        matchResult = 12;
                        value_14 = input.fields[0];
                        break;
                    }
                    case /* Decimal */ 10: {
                        matchResult = 15;
                        value_17 = input.fields[0];
                        break;
                    }
                    case /* Short */ 11: {
                        matchResult = 17;
                        value_19 = input.fields[0];
                        break;
                    }
                    case /* UInt16 */ 3: {
                        matchResult = 18;
                        value_20 = input.fields[0];
                        break;
                    }
                    case /* UInt32 */ 4: {
                        matchResult = 20;
                        value_22 = input.fields[0];
                        break;
                    }
                    case /* UInt64 */ 5: {
                        matchResult = 22;
                        value_24 = input.fields[0];
                        break;
                    }
                    case /* TimeSpan */ 20: {
                        matchResult = 24;
                        value_26 = input.fields[0];
                        break;
                    }
                    case /* Enum */ 38: {
                        matchResult = 26;
                        getElemType = typeInfo.fields[0];
                        value_28 = input.fields[0];
                        break;
                    }
                    case /* Object */ 23: {
                        matchResult = 30;
                        genericJson = input;
                        break;
                    }
                    case /* Byte */ 13: {
                        matchResult = 33;
                        value_32 = input.fields[0];
                        break;
                    }
                    case /* SByte */ 14: {
                        matchResult = 34;
                        value_33 = input.fields[0];
                        break;
                    }
                    case /* BigInt */ 19: {
                        matchResult = 37;
                        value_36 = input.fields[0];
                        break;
                    }
                    case /* DateTimeOffset */ 16: {
                        matchResult = 40;
                        value_39 = input.fields[0];
                        break;
                    }
                    case /* DateOnly */ 17: {
                        matchResult = 41;
                        value_40 = input.fields[0];
                        break;
                    }
                    case /* Option */ 27: {
                        if ((optionalTypeDelayed_4 = typeInfo.fields[0], (jsonValue_4 = input, !equals(jsonValue_4, Json_JNull())))) {
                            matchResult = 46;
                            jsonValue_5 = input;
                            optionalTypeDelayed_5 = typeInfo.fields[0];
                        }
                        else {
                            matchResult = 67;
                        }
                        break;
                    }
                    case /* Long */ 12: {
                        matchResult = 48;
                        value_50 = input.fields[0];
                        break;
                    }
                    case /* Any */ 24: {
                        matchResult = 66;
                        getType_1 = typeInfo.fields[0];
                        break;
                    }
                    default:
                        matchResult = 67;
                }
        }
        switch (matchResult) {
            case 0:
                return value_2!;
            case 1:
                return NaN;
            case 2:
                return parse(value_4!);
            case 3:
                return value_5!;
            case 4:
                return NaN;
            case 5:
                return parse(value_7!);
            case 6:
                return Math.floor(value_8!);
            case 7:
                return value_9!;
            case 8:
                return parse_1(value_10!, 511, false, 32);
            case 9:
                return value_11!;
            case 10:
                return String.fromCharCode(value_12!);
            case 11:
                return value_13!;
            case 12:
                return value_14!.toString();
            case 13:
                return Uri.create(value_15!);
            case 14:
                return new Decimal(value_16!);
            case 15:
                return new Decimal(value_17!);
            case 16:
                return parse_1(value_18!, 511, false, 16);
            case 17:
                return (value_19! + 0x8000 & 0xFFFF) - 0x8000;
            case 18:
                return value_20! & 0xFFFF;
            case 19:
                return parse_1(value_21!, 511, true, 16);
            case 20:
                return value_22! >>> 0;
            case 21:
                return parse_1(value_23!, 511, true, 32);
            case 22:
                return toUInt64(fromFloat64(value_24!));
            case 23:
                return toUInt64(parse_2(value_25!, 511, true, 64));
            case 24:
                return Math.floor(value_26!);
            case 25: {
                const patternInput: [TypeInfo_$union, any] = getlElemType!();
                const underlyingType: TypeInfo_$union = patternInput[0];
                const originalType: any = patternInput[1];
                switch (underlyingType.tag) {
                    case /* Int32 */ 6: {
                        let matchValue_1: [boolean, int32];
                        let outArg = 0;
                        matchValue_1 = ([tryParse(value_27!, 511, false, 32, new FSharpRef<int32>((): int32 => outArg, (v: int32): void => {
                            outArg = (v | 0);
                        })), outArg] as [boolean, int32]);
                        if (matchValue_1[0]) {
                            const parsedNumber: int32 = matchValue_1[1] | 0;
                            return parsedNumber;
                        }
                        else {
                            const arg_1: string = name_2(originalType);
                            return toFail(printf("The value \'%s\' is not valid for enum of type \'%s\'"))(value_27!)(arg_1);
                        }
                    }
                    case /* Long */ 12: {
                        let matchValue_2: [boolean, int64];
                        let outArg_1: int64 = 0n;
                        matchValue_2 = ([tryParse_1(value_27!, 511, false, 64, new FSharpRef<int64>((): int64 => outArg_1, (v_1: int64): void => {
                            outArg_1 = v_1;
                        })), outArg_1] as [boolean, int64]);
                        if (matchValue_2[0]) {
                            const parsedNumber_1: int64 = matchValue_2[1];
                            return parsedNumber_1;
                        }
                        else {
                            const arg_3: string = name_2(originalType);
                            return toFail(printf("The value \'%s\' is not valid for enum of type \'%s\'"))(value_27!)(arg_3);
                        }
                    }
                    default: {
                        const other: TypeInfo_$union = underlyingType;
                        const arg_5: string = name_2(originalType);
                        return toFail(printf("The value \'%s\' cannot be converted to enum of type \'%s\'"))(value_27!)(arg_5);
                    }
                }
            }
            case 26: {
                const originalType_1: any = getElemType!()[1];
                return value_28!;
            }
            case 27: {
                const elemType: TypeInfo_$union = getElemType_1!();
                if (elemType.tag === /* Byte */ 13) {
                    if ((typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) ? true : Convert_insideBrowser) {
                        return fromBase64String(value_29!);
                    }
                    else {
                        return Array.prototype.slice.call(Buffer.from(value_29!, 'base64'));
                    }
                }
                else {
                    const otherType: TypeInfo_$union = elemType;
                    return toFail(printf("Cannot convert arbitrary string \'%s\' to %A"))(value_29!)(otherType);
                }
            }
            case 28:
                return defaultOf();
            case 29:
                return undefined;
            case 30:
                return SimpleJson_toPlainObject(genericJson!);
            case 31:
                return toInt64(parse_2(value_30!, 511, false, 64));
            case 32:
                return parse_1(value_31!, 511, true, 8);
            case 33:
                return value_32! & 0xFF;
            case 34:
                return (value_33! + 0x80 & 0xFF) - 0x80;
            case 35:
                return parse_1(value_34!, 511, false, 8);
            case 36:
                return parse_3(value_35!);
            case 37:
                return fromFloat64(Math.floor(value_36!));
            case 38:
                return parse_4(value_37!);
            case 39:
                return parse_5(value_38!);
            case 40: {
                const seconds: int64 = toInt64(fromFloat64(Math.floor(value_39!)));
                return fromUnixTimeSeconds(seconds);
            }
            case 41:
                return fromDayNumber(~~value_40!);
            case 42:
                return fromDayNumber(parse_1(value_41!, 511, false, 32));
            case 43:
                return fromTicks(toInt64(parse_2(value_42!, 511, false, 64)));
            case 44: {
                const patternInput_2: [UnionCase[], any] = getTypes_1!();
                const unionType: any = patternInput_2[1];
                const cases: UnionCase[] = patternInput_2[0];
                const matchValue_3: FSharpList<[string, Json_$union]> = toList_1<string, Json_$union>(values!);
                let matchResult_1: int32, caseName_1: string, values_1: FSharpList<Json_$union>, caseName_2: string, json: Json_$union;
                if (!isEmpty(matchValue_3)) {
                    if (head(matchValue_3)[1].tag === /* JArray */ 4) {
                        if (isEmpty(tail_1(matchValue_3))) {
                            matchResult_1 = 0;
                            caseName_1 = head(matchValue_3)[0];
                            values_1 = (head(matchValue_3)[1] as Json<4>).fields[0];
                        }
                        else {
                            matchResult_1 = 2;
                        }
                    }
                    else {
                        const activePatternResult: Option<Json_$union> = Convert_$007CNonArray$007C_$007C(head(matchValue_3)[1]);
                        if (activePatternResult != null) {
                            if (isEmpty(tail_1(matchValue_3))) {
                                matchResult_1 = 1;
                                caseName_2 = head(matchValue_3)[0];
                                json = value_91(activePatternResult);
                            }
                            else {
                                matchResult_1 = 2;
                            }
                        }
                        else {
                            matchResult_1 = 2;
                        }
                    }
                }
                else {
                    matchResult_1 = 2;
                }
                switch (matchResult_1) {
                    case 0: {
                        const _arg: Option<UnionCase> = tryFind_1<UnionCase>((case$: UnionCase): boolean => (case$.CaseName === caseName_1!), cases);
                        if (_arg != null) {
                            if ((foundCase = value_91(_arg), (foundCase.CaseTypes.length === 1) && Convert_arrayLike(item_1(0, foundCase.CaseTypes)))) {
                                const foundCase_2: UnionCase = value_91(_arg);
                                const deserialized: any = Convert_fromJsonAs(Json_JArray(values_1!), item_1(0, foundCase_2.CaseTypes));
                                return makeUnion(foundCase_2.Info, [deserialized]);
                            }
                            else if ((foundCase_1 = value_91(_arg), (foundCase_1.CaseTypes.length === 1) && Convert_optional(item_1(0, foundCase_1.CaseTypes)))) {
                                const foundCase_3: UnionCase = value_91(_arg);
                                const parsedOptional: any = Convert_fromJsonAs(Json_JArray(values_1!), item_1(0, foundCase_3.CaseTypes));
                                return makeUnion(foundCase_3.Info, [parsedOptional]);
                            }
                            else {
                                const foundCase_4: UnionCase = value_91(_arg);
                                if (((foundCase_4.CaseTypes.length === 1) && !Convert_arrayLike(item_1(0, foundCase_4.CaseTypes))) && (foundCase_4.CaseTypes.length !== length<Json_$union>(values_1!))) {
                                    const arg_13: int32 = foundCase_4.CaseTypes.length | 0;
                                    const arg_14: int32 = length<Json_$union>(values_1!) | 0;
                                    toFail(printf("Expected case \'%s\' to have %d argument types but the JSON data only contained %d values"))(foundCase_4.CaseName)(arg_13)(arg_14);
                                }
                                const parsedValues: any[] = map_2<[TypeInfo_$union, Json_$union], any>((tupledArg: [TypeInfo_$union, Json_$union]): any => {
                                    const valueType: TypeInfo_$union = tupledArg[0];
                                    const value_45: Json_$union = tupledArg[1];
                                    return Convert_fromJsonAs(value_45, valueType);
                                }, zip<TypeInfo_$union, Json_$union>(foundCase_4.CaseTypes, toArray<Json_$union>(values_1!)));
                                return makeUnion(foundCase_4.Info, parsedValues);
                            }
                        }
                        else {
                            const caseNames: string[] = map_2<UnionCase, string>((case$_1: UnionCase): string => toText(printf(" \'%s\' "))(case$_1.CaseName), cases);
                            const expectedCases: string = join(", ", caseNames);
                            const arg_10: string = name_2(unionType);
                            return toFail(printf("Case %s was not valid for type \'%s\', expected one of the cases [%s]"))(caseName_1!)(arg_10)(expectedCases);
                        }
                    }
                    case 1: {
                        const _arg_1: Option<UnionCase> = tryFind_1<UnionCase>((case$_2: UnionCase): boolean => (case$_2.CaseName === caseName_2!), cases);
                        let matchResult_2: int32, caseInfo: any, caseName_3: string, caseType: TypeInfo_$union;
                        if (_arg_1 != null) {
                            if ((testExpr = value_91(_arg_1).CaseTypes, !equalsWith(equals, testExpr, defaultOf()) && (testExpr.length === 1))) {
                                matchResult_2 = 0;
                                caseInfo = value_91(_arg_1).Info;
                                caseName_3 = value_91(_arg_1).CaseName;
                                caseType = item_1(0, value_91(_arg_1).CaseTypes);
                            }
                            else {
                                matchResult_2 = 1;
                            }
                        }
                        else {
                            matchResult_2 = 1;
                        }
                        switch (matchResult_2) {
                            case 0:
                                return makeUnion(caseInfo!, [((input_1: Json_$union): ((arg0: TypeInfo_$union) => any) => ((typeInfo_1: TypeInfo_$union): any => Convert_fromJsonAs(input_1, typeInfo_1)))(json)(caseType!)]);
                            default: {
                                const caseNames_1: string[] = map_2<UnionCase, string>((case$_3: UnionCase): string => toText(printf(" \'%s\' "))(case$_3.CaseName), cases);
                                const expectedCases_1: string = join(", ", caseNames_1);
                                const arg_19: string = name_2(unionType);
                                return toFail(printf("Case %s was not valid for type \'%s\', expected one of the cases [%s]"))(caseName_2)(arg_19)(expectedCases_1);
                            }
                        }
                    }
                    default:
                        if ((otherwise = matchValue_3, (containsKey<string, Json_$union>("tag", values) && containsKey<string, Json_$union>("fields", values)) && (count<string, Json_$union>(values) === 2))) {
                            const otherwise_2: FSharpList<[string, Json_$union]> = matchValue_3;
                            const matchValue_4: Option<Json_$union> = tryFind<string, Json_$union>("tag", values);
                            const matchValue_5: Option<Json_$union> = tryFind<string, Json_$union>("fields", values);
                            let matchResult_3: int32, caseIndex: float64, fieldValues: FSharpList<Json_$union>;
                            if (matchValue_4 != null) {
                                if (value_91(matchValue_4).tag === /* JNumber */ 0) {
                                    if (matchValue_5 != null) {
                                        if (value_91(matchValue_5).tag === /* JArray */ 4) {
                                            matchResult_3 = 0;
                                            caseIndex = (value_91(matchValue_4) as Json<0>).fields[0];
                                            fieldValues = (value_91(matchValue_5) as Json<4>).fields[0];
                                        }
                                        else {
                                            matchResult_3 = 1;
                                        }
                                    }
                                    else {
                                        matchResult_3 = 1;
                                    }
                                }
                                else {
                                    matchResult_3 = 1;
                                }
                            }
                            else {
                                matchResult_3 = 1;
                            }
                            switch (matchResult_3) {
                                case 0: {
                                    const foundCase_5: UnionCase = item_1(~~caseIndex!, cases);
                                    const values_2: any[] = mapIndexed<Json_$union, any>((index: int32, value_48: Json_$union): any => Convert_fromJsonAs(value_48, item_1(index, foundCase_5.CaseTypes)), toArray<Json_$union>(fieldValues!));
                                    return makeUnion(foundCase_5.Info, values_2);
                                }
                                default: {
                                    const arg_21: string = SimpleJson_toString(Json_JObject(values));
                                    const arg_22: string = fullName(unionType);
                                    return toFail(printf("Could not deserialize JSON(%s) into type %s"))(arg_21)(arg_22);
                                }
                            }
                        }
                        else if ((otherwise_1 = matchValue_3, Convert_unionOfRecords(typeInfo))) {
                            const otherwise_3: FSharpList<[string, Json_$union]> = matchValue_3;
                            const discriminators: FSharpList<string> = ofArray(["__typename", "$typename", "$type"]);
                            const foundDiscriminatorKey: Option<string> = tryFind_2<string>((keyword: string): boolean => containsKey<string, Json_$union>(keyword, values), discriminators);
                            if (foundDiscriminatorKey != null) {
                                const discriminatorKey: string = value_91(foundDiscriminatorKey);
                                const discriminatorValueJson: Json_$union = find<string, Json_$union>(discriminatorKey, values);
                                if (discriminatorValueJson.tag === /* JString */ 1) {
                                    const discriminatorValue: string = discriminatorValueJson.fields[0];
                                    const foundUnionCase: Option<UnionCase> = tryFind_3<UnionCase>((case$_4: UnionCase): boolean => (case$_4.CaseName.toUpperCase() === discriminatorValue.toUpperCase()), cases);
                                    if (foundUnionCase != null) {
                                        const case$_5: UnionCase = value_91(foundUnionCase);
                                        const record: any = Convert_fromJsonAs(Json_JObject(values), item_1(0, case$_5.CaseTypes));
                                        return makeUnion(case$_5.Info, [record]);
                                    }
                                    else {
                                        const arg_24: string = name_2(unionType);
                                        return toFail(printf("Union of records of type \'%s\' does not have a matching case \'%s\'"))(arg_24)(discriminatorValue);
                                    }
                                }
                                else {
                                    const otherwise_4: Json_$union = discriminatorValueJson;
                                    const arg_26: string = name_2(unionType);
                                    return toFail(printf("Union of records of type \'%s\' cannot be deserialized with the value of the discriminator key is not a string to match against a specific union case"))(arg_26);
                                }
                            }
                            else {
                                const arg_23: string = name_2(unionType);
                                return toFail(printf("Could not serialize the JSON object into the union of records of type %s because the JSON did not contain a known discriminator. Expected \'__typename\', \'$typeName\' or \'$type\'"))(arg_23);
                            }
                        }
                        else {
                            const otherwise_5: FSharpList<[string, Json_$union]> = matchValue_3;
                            const unexpectedJson: string = JSON.stringify(otherwise_5);
                            const expectedType: string = JSON.stringify(cases);
                            return toFail(printf("Expected JSON:\n%s\nto match the type\n%s"))(unexpectedJson)(expectedType);
                        }
                }
            }
            case 45:
                return undefined;
            case 46: {
                const optionalType: TypeInfo_$union = optionalTypeDelayed_5!();
                const parsedOptional_1: any = Convert_fromJsonAs(jsonValue_5!, optionalType);
                return (some)(parsedOptional_1);
            }
            case 47:
                return parse_6(value_49!);
            case 48:
                return ((value_51: int32): int64 => toInt64(fromInt32(value_51)))(~~value_50!);
            case 49: {
                const get$ = (key: string): Option<Json_$union> => tryFind<string, Json_$union>(key, dict!);
                const _arg_2: FSharpList<Json_$union> = choose<Option<Json_$union>, Json_$union>((x_1: Option<Json_$union>): Option<Json_$union> => x_1, ofArray([get$("low"), get$("high"), get$("unsigned")]));
                let matchResult_4: int32, high: float64, low: float64;
                if (!isEmpty(_arg_2)) {
                    if (head(_arg_2).tag === /* JNumber */ 0) {
                        if (!isEmpty(tail_1(_arg_2))) {
                            if (head(tail_1(_arg_2)).tag === /* JNumber */ 0) {
                                if (!isEmpty(tail_1(tail_1(_arg_2)))) {
                                    if (head(tail_1(tail_1(_arg_2))).tag === /* JBool */ 2) {
                                        if (isEmpty(tail_1(tail_1(tail_1(_arg_2))))) {
                                            matchResult_4 = 0;
                                            high = (head(tail_1(_arg_2)) as Json<0>).fields[0];
                                            low = (head(_arg_2) as Json<0>).fields[0];
                                        }
                                        else {
                                            matchResult_4 = 1;
                                        }
                                    }
                                    else {
                                        matchResult_4 = 1;
                                    }
                                }
                                else {
                                    matchResult_4 = 1;
                                }
                            }
                            else {
                                matchResult_4 = 1;
                            }
                        }
                        else {
                            matchResult_4 = 1;
                        }
                    }
                    else {
                        matchResult_4 = 1;
                    }
                }
                else {
                    matchResult_4 = 1;
                }
                switch (matchResult_4) {
                    case 0: {
                        const lowBytes: uint8[] = Array.from(getBytesInt32(~~low!));
                        const highBytes: uint8[] = Array.from(getBytesInt32(~~high!));
                        const combinedBytes: uint8[] = concat<uint8>([lowBytes, highBytes]);
                        return toInt64_1(combinedBytes, 0);
                    }
                    default:
                        return toFail(printf("Unable to construct int64 from object literal { low: int, high: int, unsigned: bool }"));
                }
            }
            case 50: {
                const patternInput_3: [UnionCase[], any] = getTypes_2!();
                const unionType_1: any = patternInput_3[1];
                const caseTypes: UnionCase[] = patternInput_3[0];
                const _arg_3: Option<UnionCase> = tryFind_1<UnionCase>((case$_6: UnionCase): boolean => (case$_6.CaseName === Convert_removeQuotes(caseName_4!)), caseTypes);
                if (_arg_3 == null) {
                    const caseNames_2: string[] = map_2<UnionCase, string>((case$_7: UnionCase): string => toText(printf(" \'%s\' "))(case$_7.CaseName), caseTypes);
                    const expectedCases_2: string = join(", ", caseNames_2);
                    const arg_33: string = name_2(unionType_1);
                    return toFail(printf("Case %s was not valid for type \'%s\', expected one of the cases [%s]"))(caseName_4!)(arg_33)(expectedCases_2);
                }
                else {
                    const caseInfo_1: any = value_91(_arg_3).Info;
                    return makeUnion(caseInfo_1, []);
                }
            }
            case 51: {
                const patternInput_4: [UnionCase[], any] = getTypes_3!();
                const unionType_2: any = patternInput_4[1];
                const caseTypes_1: UnionCase[] = patternInput_4[0];
                const _arg_4: Option<UnionCase> = tryFind_1<UnionCase>((case$_8: UnionCase): boolean => (case$_8.CaseName === caseName_5!), caseTypes_1);
                if (_arg_4 == null) {
                    const caseNames_3: string[] = map_2<UnionCase, string>((case$_9: UnionCase): string => toText(printf(" \'%s\' "))(case$_9.CaseName), caseTypes_1);
                    const expectedCases_3: string = join(", ", caseNames_3);
                    const arg_37: string = name_2(unionType_2);
                    return toFail(printf("Case %s was not valid for type \'%s\', expected one of the cases [%s]"))(caseName_5!)(arg_37)(expectedCases_3);
                }
                else {
                    const caseInfo_2: any = value_91(_arg_4).Info;
                    return makeUnion(caseInfo_2, []);
                }
            }
            case 52: {
                input_mut = SimpleJson_parse(serializedRecord!);
                typeInfo_mut = typeInfo;
                continue Convert_fromJsonAs;
            }
            case 53: {
                const patternInput_5: [UnionCase[], any] = getTypes_4!();
                const unionType_3: any = patternInput_5[1];
                const cases_1: UnionCase[] = patternInput_5[0];
                let matchResult_5: int32, caseName_6: string, caseName_8: string, values_3: FSharpList<Json_$union>, otherwise_6: FSharpList<Json_$union>;
                if (!isEmpty(caseValue!)) {
                    if (head(caseValue!).tag === /* JString */ 1) {
                        if (isEmpty(tail_1(caseValue!))) {
                            matchResult_5 = 0;
                            caseName_6 = (head(caseValue!) as Json<1>).fields[0];
                        }
                        else {
                            matchResult_5 = 1;
                            caseName_8 = (head(caseValue!) as Json<1>).fields[0];
                            values_3 = tail_1(caseValue!);
                        }
                    }
                    else {
                        matchResult_5 = 2;
                        otherwise_6 = caseValue!;
                    }
                }
                else {
                    matchResult_5 = 2;
                    otherwise_6 = caseValue!;
                }
                switch (matchResult_5) {
                    case 0: {
                        const _arg_5: Option<UnionCase> = tryFind_1<UnionCase>((case$_10: UnionCase): boolean => (case$_10.CaseName === caseName_6!), cases_1);
                        if (_arg_5 == null) {
                            const caseNames_4: string[] = map_2<UnionCase, string>((case$_11: UnionCase): string => toText(printf(" \'%s\' "))(case$_11.CaseName), cases_1);
                            const expectedCases_4: string = join(", ", caseNames_4);
                            const arg_41: string = name_2(unionType_3);
                            return toFail(printf("Case \'%s\' was not valid for type \'%s\', expected one of the cases [%s]"))(caseName_6!)(arg_41)(expectedCases_4);
                        }
                        else {
                            const caseName_7: string = value_91(_arg_5).CaseName;
                            const caseInfoTypes: TypeInfo_$union[] = value_91(_arg_5).CaseTypes;
                            const caseInfo_3: any = value_91(_arg_5).Info;
                            return makeUnion(caseInfo_3, []);
                        }
                    }
                    case 1: {
                        const _arg_6: Option<UnionCase> = tryFind_1<UnionCase>((case$_12: UnionCase): boolean => (case$_12.CaseName === caseName_8!), cases_1);
                        if (_arg_6 != null) {
                            const types: TypeInfo_$union[] = value_91(_arg_6).CaseTypes;
                            const foundCaseName: string = value_91(_arg_6).CaseName;
                            const caseInfo_4: any = value_91(_arg_6).Info;
                            if (types.length !== length<Json_$union>(values_3!)) {
                                toFail(printf("The number of union case parameters for \'%s\' is different"))(foundCaseName);
                            }
                            const parsedValues_1: any[] = map_2<[TypeInfo_$union, Json_$union], any>((tupledArg_1: [TypeInfo_$union, Json_$union]): any => {
                                const valueType_1: TypeInfo_$union = tupledArg_1[0];
                                const value_53: Json_$union = tupledArg_1[1];
                                return Convert_fromJsonAs(value_53, valueType_1);
                            }, zip<TypeInfo_$union, Json_$union>(types, toArray<Json_$union>(values_3!)));
                            return makeUnion(caseInfo_4, parsedValues_1);
                        }
                        else {
                            const caseNames_5: string[] = map_2<UnionCase, string>((_arg_7: UnionCase): string => {
                                const name: string = _arg_7.CaseName;
                                return name;
                            }, cases_1);
                            const expectedCases_5: string = join(", ", caseNames_5);
                            return toFail(printf("Case %s was not valid, expected one of [%s]"))(caseName_8!)(expectedCases_5);
                        }
                    }
                    default: {
                        const unexpectedJson_1: string = JSON.stringify(otherwise_6!);
                        const expectedType_1: string = JSON.stringify(cases_1);
                        return toFail(printf("Expected JSON:\n%s\nto match the type\n%s"))(unexpectedJson_1)(expectedType_1);
                    }
                }
            }
            case 54: {
                const elementType: TypeInfo_$union = elementTypeDelayed!();
                return toArray<any>(map_3<Json_$union, any>((value_55: Json_$union): any => Convert_fromJsonAs(value_55, elementType), values_4!));
            }
            case 55: {
                const elementType_1: TypeInfo_$union = elementTypeDelayed_1!();
                return map_3<Json_$union, any>((value_57: Json_$union): any => Convert_fromJsonAs(value_57, elementType_1), values_5!);
            }
            case 56: {
                const elementType_2: TypeInfo_$union = elementTypeDelayed_2!();
                const flattenedList: FSharpList<Json_$union> = Convert_flattenFable3Lists(linkedList!);
                return map_3<Json_$union, any>((value_59: Json_$union): any => Convert_fromJsonAs(value_59, elementType_2), flattenedList);
            }
            case 57: {
                const elementType_3: TypeInfo_$union = elementTypeDelayed_3!();
                return ofList_1<IComparable<any>>(map_3<Json_$union, IComparable<any>>((value_61: Json_$union): IComparable<any> => Convert_fromJsonAs(value_61, elementType_3), values_6!), {
                    Compare: compare,
                });
            }
            case 58: {
                const elementType_4: TypeInfo_$union = elementTypeDelayed_4!();
                const converted: FSharpList<any> = map_3<Json_$union, any>((value_63: Json_$union): any => Convert_fromJsonAs(value_63, elementType_4), values_7!);
                return converted;
            }
            case 59: {
                const tupleTypes: TypeInfo_$union[] = tupleTypesDelayed!();
                return map_2<[TypeInfo_$union, Json_$union], any>((tupledArg_2: [TypeInfo_$union, Json_$union]): any => {
                    const jsonType: TypeInfo_$union = tupledArg_2[0];
                    const jsonData: Json_$union = tupledArg_2[1];
                    return Convert_fromJsonAs(jsonData, jsonType);
                }, zip<TypeInfo_$union, Json_$union>(tupleTypes, toArray<Json_$union>(array_12!)));
            }
            case 60: {
                const patternInput_6: [RecordField[], any] = getTypes_5!();
                const recordType: any = patternInput_6[1];
                const fields: RecordField[] = patternInput_6[0];
                let recordValues: any[];
                const values_8: FSharpList<[string, Json_$union]> = toList_1<string, Json_$union>(dict_1!);
                recordValues = map_2<RecordField, any>((_arg_8: RecordField): any => {
                    let list_10: FSharpList<[string, Json_$union]>, f2: ((arg0: string) => string), clo_48: ((arg0: string) => string);
                    const fieldType: TypeInfo_$union = _arg_8.FieldType;
                    const fieldName: string = _arg_8.FieldName;
                    const _arg_9: Option<[string, Json_$union]> = tryFind_2<[string, Json_$union]>((tupledArg_3: [string, Json_$union]): boolean => {
                        const key_1: string = tupledArg_3[0];
                        const value_65: Json_$union = tupledArg_3[1];
                        return fieldName === key_1;
                    }, values_8);
                    if (_arg_9 == null) {
                        if (fieldType.tag === /* Option */ 27) {
                            return undefined;
                        }
                        else {
                            let dictKeys: string;
                            const arg_50: string = join(", ", (list_10 = toList_1<string, Json_$union>(dict_1!), map_3<[string, Json_$union], string>((f2 = ((clo_48 = toText(printf("\'%s\'")), clo_48)), (arg_49: [string, Json_$union]): string => f2(arg_49[0])), list_10)));
                            dictKeys = toText(printf("[ %s ]"))(arg_50);
                            let recordFields: string;
                            const arg_53: string = join(", ", map_2<RecordField, string>((_arg_10: RecordField): string => {
                                const name_1: string = _arg_10.FieldName;
                                const innerFieldType: TypeInfo_$union = _arg_10.FieldType;
                                if (innerFieldType.tag === /* Option */ 27) {
                                    return toText(printf("optional(\'%s\')"))(name_1);
                                }
                                else {
                                    return toText(printf("required(\'%s\')"))(name_1);
                                }
                            }, fields));
                            recordFields = toText(printf("[ %s ]"))(arg_53);
                            const arg_56: string = name_2(recordType);
                            return toFail(printf("Could not find the required key \'%s\' in the JSON object literal with keys %s to match with record type \'%s\' that has fields %s"))(fieldName)(dictKeys)(arg_56)(recordFields);
                        }
                    }
                    else {
                        const value_66: Json_$union = value_91(_arg_9)[1];
                        const key_2: string = value_91(_arg_9)[0];
                        return Convert_fromJsonAs(value_66, fieldType);
                    }
                }, fields);
                return makeRecord(recordType, recordValues);
            }
            case 61: {
                const patternInput_7: [TypeInfo_$union, TypeInfo_$union] = getTypes_6!();
                const valueType_2: TypeInfo_$union = patternInput_7[1];
                const keyType: TypeInfo_$union = patternInput_7[0];
                const pairs: FSharpList<any> = toList<any>(delay<any>((): Iterable<any> => collect<Json_$union, Iterable<any>, any>((keyValuePair: Json_$union): Iterable<any> => {
                    let a: TypeInfo_$union[];
                    const tuple_1: any = Convert_fromJsonAs(keyValuePair, TypeInfo_Tuple((a = [keyType, valueType_2], (): TypeInfo_$union[] => a)));
                    return singleton_1<any>(tuple_1);
                }, tuples!)));
                switch (keyType.tag) {
                    case /* Int32 */ 6:
                    case /* String */ 2:
                    case /* Bool */ 7:
                        return ofList<string, any>(pairs, {
                            Compare: comparePrimitives,
                        });
                    default:
                        return ofList<IComparable, any>(pairs, {
                            Compare: compare,
                        });
                }
            }
            case 62: {
                const patternInput_8: [TypeInfo_$union, TypeInfo_$union, any] = getTypes_7!();
                const valueType_3: TypeInfo_$union = patternInput_8[1];
                const originalType_2: any = patternInput_8[2];
                const keyType_1: TypeInfo_$union = patternInput_8[0];
                const pairs_1: FSharpList<any> = toList<any>(delay<any>((): Iterable<any> => collect<Json_$union, Iterable<any>, any>((keyValuePair_1: Json_$union): Iterable<any> => {
                    const tuple_2: any = Convert_fromJsonAs(keyValuePair_1, TypeInfo_Tuple((): TypeInfo_$union[] => [keyType_1, valueType_3]));
                    return singleton_1<any>(tuple_2);
                }, tuples_1!)));
                const output: IMap<FSharpResult$2_$union<any, any>, any> = (keyType_1.tag === /* Union */ 40) ? (new Dictionary<FSharpResult$2_$union<any, any>, any>([], {
                    Equals: equals,
                    GetHashCode: safeHash,
                })) : ((keyType_1.tag === /* Record */ 39) ? (new Dictionary<{ dummy: int32 }, any>([], {
                    Equals: equals,
                    GetHashCode: structuralHash,
                })) : (new Dictionary<IComparable, any>([], {
                    Equals: equals,
                    GetHashCode: structuralHash,
                })));
                const enumerator: IEnumerator<[IComparable, any]> = getEnumerator(pairs_1);
                try {
                    while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                        const forLoopVar: [IComparable, any] = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                        const value_73: any = forLoopVar[1];
                        const key_3: IComparable = forLoopVar[0];
                        addToDict(output, key_3, value_73);
                    }
                }
                finally {
                    disposeSafe(enumerator as IDisposable);
                }
                return output;
            }
            case 63: {
                const patternInput_9: [TypeInfo_$union, TypeInfo_$union, any] = getTypes_8!();
                const valueType_4: TypeInfo_$union = patternInput_9[1];
                const originalType_3: any = patternInput_9[2];
                const keyType_2: TypeInfo_$union = patternInput_9[0];
                const pairs_2: FSharpList<[any, any]> = map_3<[string, Json_$union], [any, any]>((tupledArg_4: [string, Json_$union]): [any, any] => {
                    const key_4: string = tupledArg_4[0];
                    const value_74: Json_$union = tupledArg_4[1];
                    return [Convert_fromJsonAs(Json_JString(key_4), keyType_2), Convert_fromJsonAs(value_74, valueType_4)] as [any, any];
                }, toList_1<string, Json_$union>(dict_2!));
                const output_1: IMap<FSharpResult$2_$union<any, any>, any> = (keyType_2.tag === /* Union */ 40) ? (new Dictionary<FSharpResult$2_$union<any, any>, any>([], {
                    Equals: equals,
                    GetHashCode: safeHash,
                })) : ((keyType_2.tag === /* Record */ 39) ? (new Dictionary<{ dummy: int32 }, any>([], {
                    Equals: equals,
                    GetHashCode: structuralHash,
                })) : (new Dictionary<IComparable, any>([], {
                    Equals: equals,
                    GetHashCode: structuralHash,
                })));
                const enumerator_1: IEnumerator<[any, any]> = getEnumerator(pairs_2);
                try {
                    while (enumerator_1["System.Collections.IEnumerator.MoveNext"]()) {
                        const forLoopVar_1: [any, any] = enumerator_1["System.Collections.Generic.IEnumerator`1.get_Current"]();
                        const value_77: any = forLoopVar_1[1];
                        const key_5: any = forLoopVar_1[0];
                        addToDict(output_1, key_5, value_77);
                    }
                }
                finally {
                    disposeSafe(enumerator_1 as IDisposable);
                }
                return output_1;
            }
            case 64: {
                const elemType_1: TypeInfo_$union = getType!();
                const hashset: ISet<FSharpResult$2_$union<any, any>> = (elemType_1.tag === /* Union */ 40) ? (new HashSet<FSharpResult$2_$union<any, any>>([], {
                    Equals: equals,
                    GetHashCode: safeHash,
                })) : ((elemType_1.tag === /* Record */ 39) ? (new HashSet<{ dummy: int32 }>([], {
                    Equals: equals,
                    GetHashCode: structuralHash,
                })) : (new HashSet<IComparable>([], {
                    Equals: equals,
                    GetHashCode: structuralHash,
                })));
                const enumerator_2: IEnumerator<Json_$union> = getEnumerator(items!);
                try {
                    while (enumerator_2["System.Collections.IEnumerator.MoveNext"]()) {
                        const item: Json_$union = enumerator_2["System.Collections.Generic.IEnumerator`1.get_Current"]();
                        const deserialized_1: any = Convert_fromJsonAs(item, elemType_1);
                        addToSet(deserialized_1, hashset);
                    }
                }
                finally {
                    disposeSafe(enumerator_2 as IDisposable);
                }
                return hashset;
            }
            case 65: {
                const patternInput_10: [TypeInfo_$union, TypeInfo_$union] = getTypes_9!();
                const valueType_5: TypeInfo_$union = patternInput_10[1];
                const keyType_3: TypeInfo_$union = patternInput_10[0];
                const matchValue_7: Option<Json_$union> = tryFind<string, Json_$union>("comparer", map!);
                const matchValue_8: Option<Json_$union> = tryFind<string, Json_$union>("tree", map!);
                let matchResult_6: int32, comparer_2: FSharpMap<string, Json_$union>, tree_2: FSharpList<Json_$union>, comparer_3: FSharpMap<string, Json_$union>, tree_3: FSharpMap<string, Json_$union>;
                if (matchValue_7 != null) {
                    if (value_91(matchValue_7).tag === /* JObject */ 5) {
                        if (matchValue_8 != null) {
                            switch (value_91(matchValue_8).tag) {
                                case /* JArray */ 4: {
                                    if ((tree = (value_91(matchValue_8) as Json<4>).fields[0], (comparer = (value_91(matchValue_7) as Json<5>).fields[0], isEmpty_1<string, Json_$union>(comparer)))) {
                                        matchResult_6 = 0;
                                        comparer_2 = (value_91(matchValue_7) as Json<5>).fields[0];
                                        tree_2 = (value_91(matchValue_8) as Json<4>).fields[0];
                                    }
                                    else {
                                        matchResult_6 = 2;
                                    }
                                    break;
                                }
                                case /* JObject */ 5: {
                                    if ((tree_1 = (value_91(matchValue_8) as Json<5>).fields[0], (comparer_1 = (value_91(matchValue_7) as Json<5>).fields[0], isEmpty_1<string, Json_$union>(comparer_1)))) {
                                        matchResult_6 = 1;
                                        comparer_3 = (value_91(matchValue_7) as Json<5>).fields[0];
                                        tree_3 = (value_91(matchValue_8) as Json<5>).fields[0];
                                    }
                                    else {
                                        matchResult_6 = 2;
                                    }
                                    break;
                                }
                                default:
                                    matchResult_6 = 2;
                            }
                        }
                        else {
                            matchResult_6 = 2;
                        }
                    }
                    else {
                        matchResult_6 = 2;
                    }
                }
                else {
                    matchResult_6 = 2;
                }
                switch (matchResult_6) {
                    case 0: {
                        const matchValue_10: Option<Convert_InternalMap_$union> = Convert_generateMap(Json_JArray(tree_2!));
                        if (matchValue_10 == null) {
                            const inputJson: string = SimpleJson_toString(Json_JArray(tree_2!));
                            return toFail(printf("Could not generate map from JSON\n %s"))(inputJson);
                        }
                        else {
                            const internalMap: Convert_InternalMap_$union = value_91(matchValue_10);
                            const pairs_3: FSharpList<[any, any]> = map_3<[string, Json_$union], [any, any]>((tupledArg_5: [string, Json_$union]): [any, any] => {
                                const key_6: string = tupledArg_5[0];
                                const value_81: Json_$union = tupledArg_5[1];
                                const nextKey: any = !Convert_isQuoted(key_6) ? Convert_fromJsonAs(Json_JString(key_6), keyType_3) : Convert_fromJsonAs(SimpleJson_parseNative(key_6), keyType_3);
                                const nextValue: any = Convert_fromJsonAs(value_81, valueType_5);
                                return [nextKey, nextValue] as [any, any];
                            }, Convert_flattenMap(internalMap));
                            switch (keyType_3.tag) {
                                case /* Int32 */ 6:
                                case /* String */ 2:
                                case /* Bool */ 7:
                                    return ofList<string, any>(pairs_3, {
                                        Compare: comparePrimitives,
                                    });
                                default:
                                    return ofList<IComparable, any>(pairs_3, {
                                        Compare: compare,
                                    });
                            }
                        }
                    }
                    case 1: {
                        const flattenedMap: FSharpMap<string, Json_$union> = ofList<string, Json_$union>(Convert_flatteFable3Map(tree_3!), {
                            Compare: comparePrimitives,
                        });
                        input_mut = Json_JObject(flattenedMap);
                        typeInfo_mut = typeInfo;
                        continue Convert_fromJsonAs;
                    }
                    default: {
                        const pairs_4: FSharpList<[string, any]> = map_3<[string, Json_$union], [string, any]>((tupledArg_6: [string, Json_$union]): [string, any] => {
                            const key_7: string = tupledArg_6[0];
                            const value_86: Json_$union = tupledArg_6[1];
                            const nextKey_1: any = !Convert_isQuoted(key_7) ? ((isPrimitive(keyType_3) ? true : enumUnion(keyType_3)) ? Convert_fromJsonAs(Json_JString(key_7), keyType_3) : Convert_fromJsonAs(SimpleJson_parseNative(key_7), keyType_3)) : Convert_fromJsonAs(SimpleJson_parseNative(key_7), keyType_3);
                            const nextValue_1: any = Convert_fromJsonAs(value_86, valueType_5);
                            return [nextKey_1, nextValue_1] as [string, any];
                        }, toList_1<string, Json_$union>(map));
                        switch (keyType_3.tag) {
                            case /* Int32 */ 6:
                            case /* String */ 2:
                            case /* Bool */ 7:
                                return ofList<string, any>(pairs_4, {
                                    Compare: comparePrimitives,
                                });
                            default:
                                return ofList<IComparable, any>(pairs_4, {
                                    Compare: compare,
                                });
                        }
                    }
                }
            }
            case 66: {
                const unknownType: any = getType_1!();
                const arg_59: string = SimpleJson_toString(input);
                const arg_60: string = fullName(unknownType);
                return toFail(printf("Cannot convert %s to %s"))(arg_59)(arg_60);
            }
            default: {
                const arg_61: string = SimpleJson_toString(input);
                const arg_62: string = JSON.stringify(typeInfo);
                return toFail(printf("Cannot convert %s to %s"))(arg_61)(arg_62);
            }
        }
        break;
    }
}

export function Convert_fromJson<t>(json: Json_$union, typeInfo: TypeInfo_$union): t {
    return Convert_fromJsonAs(json, typeInfo);
}

export const Convert_quoteText: ((arg0: string) => string) = quote;

export function Convert_serialize(value_mut: any, typeInfo_mut: TypeInfo_$union): string {
    let copyOfStruct: string;
    Convert_serialize:
    while (true) {
        const value: any = value_mut, typeInfo: TypeInfo_$union = typeInfo_mut;
        switch (typeInfo.tag) {
            case /* String */ 2: {
                const content: string = value;
                if (content == null) {
                    return "null";
                }
                else {
                    return Convert_quoteText(content);
                }
            }
            case /* Unit */ 0:
                return "null";
            case /* Float */ 9:
            case /* Float32 */ 8:
                if (Number.isNaN(value)) {
                    return Convert_quoteText("NaN");
                }
                else {
                    return value.toString();
                }
            case /* Char */ 1:
                return Convert_quoteText(value);
            case /* Byte */ 13:
            case /* SByte */ 14:
            case /* UInt16 */ 3:
            case /* UInt32 */ 4:
            case /* Short */ 11:
            case /* Enum */ 38:
            case /* TimeSpan */ 20:
            case /* Int32 */ 6:
                return int32ToString(value);
            case /* UInt64 */ 5:
            case /* Long */ 12:
                return Convert_betweenQuotes(int64ToString(value));
            case /* BigInt */ 19:
                return Convert_betweenQuotes(toString(value));
            case /* Decimal */ 10:
                return Convert_betweenQuotes(toString_1(value));
            case /* Bool */ 7:
                if (value) {
                    return "true";
                }
                else {
                    return "false";
                }
            case /* Guid */ 21:
                return Convert_betweenQuotes((copyOfStruct = value, copyOfStruct));
            case /* Uri */ 22:
                return Convert_betweenQuotes(toString_2(value));
            case /* DateTime */ 15:
                return Convert_betweenQuotes(toString_3(value, "O"));
            case /* DateTimeOffset */ 16:
                return Convert_betweenQuotes(toString_3(value, "O"));
            case /* DateOnly */ 17:
                return int32ToString(dayNumber(value));
            case /* TimeOnly */ 18:
                return Convert_betweenQuotes(int64ToString(ticks(value)));
            case /* Record */ 39: {
                const getFields: (() => [RecordField[], any]) = typeInfo.fields[0];
                const patternInput: [RecordField[], any] = getFields();
                const recordType: any = patternInput[1];
                const fieldTypes: RecordField[] = patternInput[0];
                const serializedFields: string[] = map_2<RecordField, string>((field: RecordField): string => {
                    const fieldValue: any = getRecordField(value, field.PropertyInfo);
                    const arg_1: string = Convert_serialize(fieldValue, field.FieldType);
                    return toText(printf("\"%s\": %s"))(field.FieldName)(arg_1);
                }, fieldTypes);
                return ("{" + join(", ", serializedFields)) + "}";
            }
            case /* ResizeArray */ 35: {
                const getElementType: (() => TypeInfo_$union) = typeInfo.fields[0];
                const elementType: TypeInfo_$union = getElementType();
                const values: string = join(", ", map_4<any, string>((element: any): string => Convert_serialize(element, elementType), value));
                return ("[" + values) + "]";
            }
            case /* HashSet */ 36: {
                const getElementType_1: (() => TypeInfo_$union) = typeInfo.fields[0];
                const elementType_1: TypeInfo_$union = getElementType_1();
                const values_1: string = join(", ", map_4<any, string>((element_1: any): string => Convert_serialize(element_1, elementType_1), value));
                return ("[" + values_1) + "]";
            }
            case /* Set */ 29: {
                const getElementType_2: (() => TypeInfo_$union) = typeInfo.fields[0];
                const elementType_2: TypeInfo_$union = getElementType_2();
                const values_2: string = join(", ", map_4<IComparable<any>, string>((element_2: IComparable<any>): string => Convert_serialize(element_2, elementType_2), value));
                return ("[" + values_2) + "]";
            }
            case /* Array */ 30: {
                const getElementType_3: (() => TypeInfo_$union) = typeInfo.fields[0];
                const elementType_3: TypeInfo_$union = getElementType_3();
                const values_3: string = join(", ", map_2<any, string>((element_3: any): string => Convert_serialize(element_3, elementType_3), value));
                return ("[" + values_3) + "]";
            }
            case /* List */ 28: {
                const getElementType_4: (() => TypeInfo_$union) = typeInfo.fields[0];
                const elementType_4: TypeInfo_$union = getElementType_4();
                const values_4: string = join(", ", map_3<any, string>((element_4: any): string => Convert_serialize(element_4, elementType_4), value));
                return ("[" + values_4) + "]";
            }
            case /* Seq */ 31: {
                const getElementType_5: (() => TypeInfo_$union) = typeInfo.fields[0];
                const elementType_5: TypeInfo_$union = getElementType_5();
                const values_5: string = join(", ", map_2<any, string>((element_5: any): string => Convert_serialize(element_5, elementType_5), toArray_1<any>(value)));
                return ("[" + values_5) + "]";
            }
            case /* Option */ 27: {
                const getElementType_6: (() => TypeInfo_$union) = typeInfo.fields[0];
                const matchValue: Option<any> = value;
                if (matchValue != null) {
                    const existingValue: any = value_91(matchValue);
                    value_mut = existingValue;
                    typeInfo_mut = getElementType_6();
                    continue Convert_serialize;
                }
                else {
                    return "null";
                }
            }
            case /* Union */ 40: {
                const getCases: (() => [UnionCase[], any]) = typeInfo.fields[0];
                const patternInput_1: [UnionCase[], any] = getCases();
                const unionType: any = patternInput_1[1];
                const unionCases: UnionCase[] = patternInput_1[0];
                const patternInput_2: [any, any[]] = getUnionFields(value, unionType);
                const usedCase: any = patternInput_2[0];
                const fields: any[] = patternInput_2[1];
                const caseTypes: TypeInfo_$union[] = find_1<UnionCase>((case$: UnionCase): boolean => (case$.CaseName === name_2(usedCase)), unionCases).CaseTypes;
                if (enumUnion(typeInfo) ? true : (caseTypes.length === 0)) {
                    return Convert_betweenQuotes(name_2(usedCase));
                }
                else if (caseTypes.length === 1) {
                    return ((("{" + Convert_betweenQuotes(name_2(usedCase))) + ": ") + Convert_serialize(item_1(0, fields), item_1(0, caseTypes))) + "}";
                }
                else {
                    const serializedFields_1: string = join(", ", mapIndexed<TypeInfo_$union, string>((index: int32, caseType: TypeInfo_$union): string => Convert_serialize(item_1(index, fields), caseType), caseTypes));
                    return (((("{" + Convert_betweenQuotes(name_2(usedCase))) + ": ") + "[") + serializedFields_1) + "] }";
                }
            }
            case /* Map */ 33: {
                const getPairTypes: (() => [TypeInfo_$union, TypeInfo_$union]) = typeInfo.fields[0];
                const patternInput_3: [TypeInfo_$union, TypeInfo_$union] = getPairTypes();
                const valueType: TypeInfo_$union = patternInput_3[1];
                const keyType: TypeInfo_$union = patternInput_3[0];
                const serializedValues: string = join(", ", map_2<[IComparable<any>, any], string>((tupledArg: [IComparable<any>, any]): string => {
                    const key: IComparable<any> = tupledArg[0];
                    const value_8: any = tupledArg[1];
                    const serializedKey: string = Convert_serialize(key, keyType);
                    const serializedValue: string = Convert_serialize(value_8, valueType);
                    if (isPrimitive(keyType) ? true : enumUnion(keyType)) {
                        if (!Convert_isQuoted(serializedKey)) {
                            return (Convert_quoteText(serializedKey) + ": ") + serializedValue;
                        }
                        else {
                            return (serializedKey + ": ") + serializedValue;
                        }
                    }
                    else {
                        return ((("[" + serializedKey) + ", ") + serializedValue) + "]";
                    }
                }, toArray_2<IComparable<any>, any>(value)));
                if (isPrimitive(keyType) ? true : enumUnion(keyType)) {
                    return ("{" + serializedValues) + "}";
                }
                else {
                    return ("[" + serializedValues) + "]";
                }
            }
            case /* Dictionary */ 34: {
                const getPairTypes_1: (() => [TypeInfo_$union, TypeInfo_$union, any]) = typeInfo.fields[0];
                const patternInput_4: [TypeInfo_$union, TypeInfo_$union, any] = getPairTypes_1();
                const valueType_1: TypeInfo_$union = patternInput_4[1];
                const originalType: any = patternInput_4[2];
                const keyType_1: TypeInfo_$union = patternInput_4[0];
                const serializedValues_1: string = join(", ", map_4<[IComparable<any>, any], string>((pair: [IComparable<any>, any]): string => {
                    const value_10: any = pair[1];
                    const key_1: IComparable<any> = pair[0];
                    const serializedKey_1: string = Convert_serialize(key_1, keyType_1);
                    const serializedValue_1: string = Convert_serialize(value_10, valueType_1);
                    if (isPrimitive(keyType_1) ? true : enumUnion(keyType_1)) {
                        if (!Convert_isQuoted(serializedKey_1)) {
                            return (Convert_betweenQuotes(serializedKey_1) + ": ") + serializedValue_1;
                        }
                        else {
                            return (serializedKey_1 + ": ") + serializedValue_1;
                        }
                    }
                    else {
                        return ((("[" + serializedKey_1) + ", ") + serializedValue_1) + "]";
                    }
                }, value));
                if (isPrimitive(keyType_1) ? true : enumUnion(keyType_1)) {
                    return ("{" + serializedValues_1) + "}";
                }
                else {
                    return ("[" + serializedValues_1) + "]";
                }
            }
            case /* Tuple */ 32: {
                const getTupleTypes: (() => TypeInfo_$union[]) = typeInfo.fields[0];
                const tupleTypes: TypeInfo_$union[] = getTupleTypes();
                if (tupleTypes.length === 1) {
                    return ("[" + Convert_serialize(value, item_1(0, tupleTypes))) + "]";
                }
                else {
                    const serializedValues_2: string = join(", ", mapIndexed<any, string>((index_1: int32, element_6: any): string => Convert_serialize(element_6, item_1(index_1, tupleTypes)), value));
                    return ("[" + serializedValues_2) + "]";
                }
            }
            case /* Object */ 23:
                return SimpleJson_stringify<any>(value);
            case /* Any */ 24: {
                const getType: (() => any) = typeInfo.fields[0];
                return SimpleJson_stringify<any>(value);
            }
            default:
                return "null";
        }
        break;
    }
}

/**
 * Serialized the input value object into JSON, uses built-in JSON.stringify and should be used with Fable 2.x or earlier
 */
export function Fable_SimpleJson_Json__Json_stringify_Static_4E60E31B(value: any): string {
    if (Convert_isUsingFable3) {
        console.warn(some("It looks like you using the function Json.stringify from Fable.SimpleJson while also using Fable 3 (nagareyama). Please use Json.serialize instead which supports both Fable 3 and Fable 2.x"));
    }
    return SimpleJson_stringify<any>(value);
}

