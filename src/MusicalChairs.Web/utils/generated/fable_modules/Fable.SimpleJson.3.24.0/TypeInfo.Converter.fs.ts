import { equals, getEnumUnderlyingType, isEnum, getTupleElements, isTuple, getElementType, isArray, getFunctionElements, isFunction, getUnionCases, getUnionCaseFields, isUnion, getGenerics, getRecordElements, name, isRecord, fullName } from "../fable-library-ts.4.24.0/Reflection.js";
import { TypeInfo_Any, TypeInfo_Promise, TypeInfo_Async, TypeInfo_Seq, TypeInfo_Dictionary, TypeInfo_Map, TypeInfo_Set, TypeInfo_Option, TypeInfo_Tuple, TypeInfo_Array, TypeInfo_HashSet, TypeInfo_ResizeArray, TypeInfo_List, TypeInfo_Enum, TypeInfo_Union, UnionCase, TypeInfo_Record, RecordField, TypeInfo_Func, TypeInfo_$union, TypeInfo_Uri, TypeInfo_Object, TypeInfo_SByte, TypeInfo_Byte, TypeInfo_Guid, TypeInfo_Unit, TypeInfo_BigInt, TypeInfo_Decimal, TypeInfo_Float, TypeInfo_Float32, TypeInfo_Bool, TypeInfo_DateTimeOffset, TypeInfo_TimeSpan, TypeInfo_TimeOnly, TypeInfo_DateOnly, TypeInfo_DateTime, TypeInfo_UInt64, TypeInfo_UInt32, TypeInfo_UInt16, TypeInfo_Long, TypeInfo_Int32, TypeInfo_Short, TypeInfo_Char, TypeInfo_String } from "./TypeInfo.fs.js";
import { value, Option } from "../fable-library-ts.4.24.0/Option.js";
import { item, map } from "../fable-library-ts.4.24.0/Array.js";
import { collect, singleton, append, delay, toArray } from "../fable-library-ts.4.24.0/Seq.js";
import { defaultOf, IMap, structuralHash, Lazy } from "../fable-library-ts.4.24.0/Util.js";
import { Dictionary } from "../fable-library-ts.4.24.0/MutableMap.js";
import { int32 } from "../fable-library-ts.4.24.0/Int32.js";
import { tryGetValue } from "../fable-library-ts.4.24.0/MapUtil.js";
import { FSharpRef } from "../fable-library-ts.4.24.0/Types.js";
import { isNullOrEmpty } from "../fable-library-ts.4.24.0/String.js";

export function $007CPrimitiveType$007C_$007C(primType: any): Option<TypeInfo_$union> {
    const matchValue: string = fullName(primType);
    switch (matchValue) {
        case "System.String":
            return TypeInfo_String();
        case "System.Char":
            return TypeInfo_Char();
        case "System.Int16":
            return TypeInfo_Short();
        case "System.Int32":
            return TypeInfo_Int32();
        case "Microsoft.FSharp.Core.int64`1":
        case "System.Int64":
            return TypeInfo_Long();
        case "System.UInt16":
            return TypeInfo_UInt16();
        case "System.UInt32":
            return TypeInfo_UInt32();
        case "System.UInt64":
            return TypeInfo_UInt64();
        case "System.DateTime":
            return TypeInfo_DateTime();
        case "System.DateOnly":
            return TypeInfo_DateOnly();
        case "System.TimeOnly":
            return TypeInfo_TimeOnly();
        case "System.TimeSpan":
            return TypeInfo_TimeSpan();
        case "System.DateTimeOffset":
            return TypeInfo_DateTimeOffset();
        case "System.Boolean":
            return TypeInfo_Bool();
        case "System.Single":
            return TypeInfo_Float32();
        case "System.Double":
            return TypeInfo_Float();
        case "Microsoft.FSharp.Core.decimal`1":
        case "System.Decimal":
            return TypeInfo_Decimal();
        case "System.Numerics.BigInteger":
            return TypeInfo_BigInt();
        case "Microsoft.FSharp.Core.Unit":
            return TypeInfo_Unit();
        case "System.Guid":
            return TypeInfo_Guid();
        case "System.Byte":
            return TypeInfo_Byte();
        case "System.SByte":
            return TypeInfo_SByte();
        case "System.Object":
            return TypeInfo_Object();
        case "System.Uri":
            return TypeInfo_Uri();
        default:
            return undefined;
    }
}

export function $007CRecordType$007C_$007C(t: any): Option<[any, string, any][]> {
    if (isRecord(t)) {
        return map<any, [any, string, any]>((field: any): [any, string, any] => ([field, name(field), field[1]] as [any, string, any]), getRecordElements(t));
    }
    else {
        return undefined;
    }
}

export function $007CSetType$007C_$007C(t: any): Option<any> {
    if (fullName(t).startsWith("Microsoft.FSharp.Collections.FSharpSet`1")) {
        return item(0, getGenerics(t));
    }
    else {
        return undefined;
    }
}

export function $007CNullable$007C_$007C(t: any): Option<any> {
    if (fullName(t).startsWith("System.Nullable`1")) {
        return item(0, getGenerics(t));
    }
    else {
        return undefined;
    }
}

export function $007CUnionType$007C_$007C(t: any): Option<[string, any, any[]][]> {
    if (isUnion(t)) {
        return map<any, [string, any, any[]]>((info: any): [string, any, any[]] => ([name(info), info, map<any, any>((prop: any): any => prop[1], getUnionCaseFields(info))] as [string, any, any[]]), getUnionCases(t));
    }
    else {
        return undefined;
    }
}

export function $007CMapType$007C_$007C(t: any): Option<[any, any]> {
    if (fullName(t).startsWith("Microsoft.FSharp.Collections.FSharpMap`2")) {
        const genArgs: any[] = getGenerics(t);
        return [item(0, genArgs), item(1, genArgs)] as [any, any];
    }
    else {
        return undefined;
    }
}

export function $007CListType$007C_$007C(t: any): Option<any> {
    if (fullName(t).startsWith("Microsoft.FSharp.Collections.FSharpList`1")) {
        return item(0, getGenerics(t));
    }
    else {
        return undefined;
    }
}

export function flattenFuncTypes(typeDef: any): any[] {
    return toArray<any>(delay<any>((): Iterable<any> => {
        if (isFunction(typeDef)) {
            const patternInput: [any, any] = getFunctionElements(typeDef);
            return append<any>(flattenFuncTypes(patternInput[0]), delay<any>((): Iterable<any> => flattenFuncTypes(patternInput[1])));
        }
        else {
            return singleton<any>(typeDef);
        }
    }));
}

export function $007CFuncType$007C_$007C(t: any): Option<any[]> {
    if (isFunction(t)) {
        return flattenFuncTypes(t);
    }
    else {
        return undefined;
    }
}

export function $007CArrayType$007C_$007C(t: any): Option<any> {
    if (isArray(t)) {
        return getElementType(t);
    }
    else {
        return undefined;
    }
}

export function $007COptionType$007C_$007C(t: any): Option<any> {
    if (fullName(t).startsWith("Microsoft.FSharp.Core.FSharpOption`1")) {
        return item(0, getGenerics(t));
    }
    else {
        return undefined;
    }
}

export function $007CTupleType$007C_$007C(t: any): Option<any[]> {
    if (isTuple(t)) {
        return getTupleElements(t);
    }
    else {
        return undefined;
    }
}

export function $007CSeqType$007C_$007C(t: any): Option<any> {
    if (fullName(t).startsWith("System.Collections.Generic.IEnumerable`1")) {
        return item(0, getGenerics(t));
    }
    else {
        return undefined;
    }
}

export function $007CDictionaryType$007C_$007C(t: any): Option<[any, any]> {
    if (fullName(t).startsWith("System.Collections.Generic.Dictionary")) {
        const genArgs: any[] = getGenerics(t);
        return [item(0, genArgs), item(1, genArgs)] as [any, any];
    }
    else {
        return undefined;
    }
}

export function $007CResizeArrayType$007C_$007C(t: any): Option<any> {
    if (fullName(t).startsWith("System.Collections.Generic.List")) {
        return item(0, getGenerics(t));
    }
    else {
        return undefined;
    }
}

export function $007CHashSetType$007C_$007C(t: any): Option<any> {
    if (fullName(t).startsWith("System.Collections.Generic.HashSet")) {
        return item(0, getGenerics(t));
    }
    else {
        return undefined;
    }
}

export function $007CAsyncType$007C_$007C(t: any): Option<any> {
    if (fullName(t).startsWith("Microsoft.FSharp.Control.FSharpAsync`1")) {
        return item(0, getGenerics(t));
    }
    else {
        return undefined;
    }
}

export function $007CPromiseType$007C_$007C(t: any): Option<any> {
    if (fullName(t).startsWith("Fable.Core.JS.Promise`1")) {
        return item(0, getGenerics(t));
    }
    else {
        return undefined;
    }
}

function lazyToDelayed<$a>(l: any, unitVar: void): $a {
    return l.Value;
}

export function $007CEnumType$007C_$007C(t: any): Option<any> {
    if (isEnum(t)) {
        return getEnumUnderlyingType(t);
    }
    else {
        return undefined;
    }
}

function _createTypeInfo(resolvedType: any): TypeInfo_$union {
    let l: any, l_3: any, l_4: any, l_5: any, l_6: any, l_7: any, l_8: any, l_9: any, l_10: any, l_11: any, l_12: any, l_13: any, l_14: any, l_15: any, l_16: any, l_17: any;
    const activePatternResult: Option<TypeInfo_$union> = $007CPrimitiveType$007C_$007C(resolvedType);
    if (activePatternResult != null) {
        const typeInfo: TypeInfo_$union = value(activePatternResult);
        return typeInfo;
    }
    else {
        const activePatternResult_1: Option<any[]> = $007CFuncType$007C_$007C(resolvedType);
        if (activePatternResult_1 != null) {
            const types: any[] = value(activePatternResult_1);
            return TypeInfo_Func((l = (new Lazy<TypeInfo_$union[]>((): TypeInfo_$union[] => map<any, TypeInfo_$union>(createTypeInfo, types))), (): TypeInfo_$union[] => lazyToDelayed<TypeInfo_$union[]>(l, undefined)));
        }
        else {
            const activePatternResult_2: Option<[any, string, any][]> = $007CRecordType$007C_$007C(resolvedType);
            if (activePatternResult_2 != null) {
                const fields: [any, string, any][] = value(activePatternResult_2);
                const l_1: any = new Lazy<[RecordField[], any]>((): [RecordField[], any] => ([toArray<RecordField>(delay<RecordField>((): Iterable<RecordField> => collect<[any, string, any], Iterable<RecordField>, RecordField>((matchValue: [any, string, any]): Iterable<RecordField> => singleton<RecordField>(new RecordField(matchValue[1], createTypeInfo(matchValue[2]), matchValue[0])), fields))), resolvedType] as [RecordField[], any]));
                return TypeInfo_Record((): [RecordField[], any] => lazyToDelayed<[RecordField[], any]>(l_1, undefined));
            }
            else {
                const activePatternResult_3: Option<[string, any, any[]][]> = $007CUnionType$007C_$007C(resolvedType);
                if (activePatternResult_3 != null) {
                    const cases: [string, any, any[]][] = value(activePatternResult_3);
                    const l_2: any = new Lazy<[UnionCase[], any]>((): [UnionCase[], any] => ([toArray<UnionCase>(delay<UnionCase>((): Iterable<UnionCase> => collect<[string, any, any[]], Iterable<UnionCase>, UnionCase>((matchValue_1: [string, any, any[]]): Iterable<UnionCase> => singleton<UnionCase>(new UnionCase(matchValue_1[0], map<any, TypeInfo_$union>(createTypeInfo, matchValue_1[2]), matchValue_1[1])), cases))), resolvedType] as [UnionCase[], any]));
                    return TypeInfo_Union((): [UnionCase[], any] => lazyToDelayed<[UnionCase[], any]>(l_2, undefined));
                }
                else {
                    const activePatternResult_4: Option<any> = $007CEnumType$007C_$007C(resolvedType);
                    if (activePatternResult_4 != null) {
                        const elemType: any = value(activePatternResult_4);
                        return TypeInfo_Enum((l_3 = (new Lazy<[TypeInfo_$union, any]>((): [TypeInfo_$union, any] => ([createTypeInfo(elemType), resolvedType] as [TypeInfo_$union, any]))), (): [TypeInfo_$union, any] => lazyToDelayed<[TypeInfo_$union, any]>(l_3, undefined)));
                    }
                    else {
                        const activePatternResult_5: Option<any> = $007CListType$007C_$007C(resolvedType);
                        if (activePatternResult_5 != null) {
                            const elemType_1: any = value(activePatternResult_5);
                            return TypeInfo_List((l_4 = (new Lazy<TypeInfo_$union>((): TypeInfo_$union => createTypeInfo(elemType_1))), (): TypeInfo_$union => lazyToDelayed<TypeInfo_$union>(l_4, undefined)));
                        }
                        else {
                            const activePatternResult_6: Option<any> = $007CResizeArrayType$007C_$007C(resolvedType);
                            if (activePatternResult_6 != null) {
                                const elemType_2: any = value(activePatternResult_6);
                                return TypeInfo_ResizeArray((l_5 = (new Lazy<TypeInfo_$union>((): TypeInfo_$union => createTypeInfo(elemType_2))), (): TypeInfo_$union => lazyToDelayed<TypeInfo_$union>(l_5, undefined)));
                            }
                            else {
                                const activePatternResult_7: Option<any> = $007CHashSetType$007C_$007C(resolvedType);
                                if (activePatternResult_7 != null) {
                                    const elemType_3: any = value(activePatternResult_7);
                                    return TypeInfo_HashSet((l_6 = (new Lazy<TypeInfo_$union>((): TypeInfo_$union => createTypeInfo(elemType_3))), (): TypeInfo_$union => lazyToDelayed<TypeInfo_$union>(l_6, undefined)));
                                }
                                else {
                                    const activePatternResult_8: Option<any> = $007CArrayType$007C_$007C(resolvedType);
                                    if (activePatternResult_8 != null) {
                                        const elemType_4: any = value(activePatternResult_8);
                                        return TypeInfo_Array((l_7 = (new Lazy<TypeInfo_$union>((): TypeInfo_$union => createTypeInfo(elemType_4))), (): TypeInfo_$union => lazyToDelayed<TypeInfo_$union>(l_7, undefined)));
                                    }
                                    else {
                                        const activePatternResult_9: Option<any[]> = $007CTupleType$007C_$007C(resolvedType);
                                        if (activePatternResult_9 != null) {
                                            const types_1: any[] = value(activePatternResult_9);
                                            return TypeInfo_Tuple((l_8 = (new Lazy<TypeInfo_$union[]>((): TypeInfo_$union[] => map<any, TypeInfo_$union>(createTypeInfo, types_1))), (): TypeInfo_$union[] => lazyToDelayed<TypeInfo_$union[]>(l_8, undefined)));
                                        }
                                        else {
                                            const activePatternResult_10: Option<any> = $007COptionType$007C_$007C(resolvedType);
                                            if (activePatternResult_10 != null) {
                                                const elemType_5: any = value(activePatternResult_10);
                                                return TypeInfo_Option((l_9 = (new Lazy<TypeInfo_$union>((): TypeInfo_$union => createTypeInfo(elemType_5))), (): TypeInfo_$union => lazyToDelayed<TypeInfo_$union>(l_9, undefined)));
                                            }
                                            else {
                                                const activePatternResult_11: Option<any> = $007CNullable$007C_$007C(resolvedType);
                                                if (activePatternResult_11 != null) {
                                                    const elemType_6: any = value(activePatternResult_11);
                                                    return TypeInfo_Option((l_10 = (new Lazy<TypeInfo_$union>((): TypeInfo_$union => createTypeInfo(elemType_6))), (): TypeInfo_$union => lazyToDelayed<TypeInfo_$union>(l_10, undefined)));
                                                }
                                                else {
                                                    const activePatternResult_12: Option<any> = $007CSetType$007C_$007C(resolvedType);
                                                    if (activePatternResult_12 != null) {
                                                        const elemType_7: any = value(activePatternResult_12);
                                                        return TypeInfo_Set((l_11 = (new Lazy<TypeInfo_$union>((): TypeInfo_$union => createTypeInfo(elemType_7))), (): TypeInfo_$union => lazyToDelayed<TypeInfo_$union>(l_11, undefined)));
                                                    }
                                                    else {
                                                        const activePatternResult_13: Option<[any, any]> = $007CMapType$007C_$007C(resolvedType);
                                                        if (activePatternResult_13 != null) {
                                                            const keyType: any = value(activePatternResult_13)[0];
                                                            const valueType: any = value(activePatternResult_13)[1];
                                                            return TypeInfo_Map((l_12 = (new Lazy<[TypeInfo_$union, TypeInfo_$union]>((): [TypeInfo_$union, TypeInfo_$union] => ([createTypeInfo(keyType), createTypeInfo(valueType)] as [TypeInfo_$union, TypeInfo_$union]))), (): [TypeInfo_$union, TypeInfo_$union] => lazyToDelayed<[TypeInfo_$union, TypeInfo_$union]>(l_12, undefined)));
                                                        }
                                                        else {
                                                            const activePatternResult_14: Option<[any, any]> = $007CDictionaryType$007C_$007C(resolvedType);
                                                            if (activePatternResult_14 != null) {
                                                                const keyType_1: any = value(activePatternResult_14)[0];
                                                                const valueType_1: any = value(activePatternResult_14)[1];
                                                                return TypeInfo_Dictionary((l_13 = (new Lazy<[TypeInfo_$union, TypeInfo_$union, any]>((): [TypeInfo_$union, TypeInfo_$union, any] => ([createTypeInfo(keyType_1), createTypeInfo(valueType_1), valueType_1] as [TypeInfo_$union, TypeInfo_$union, any]))), (): [TypeInfo_$union, TypeInfo_$union, any] => lazyToDelayed<[TypeInfo_$union, TypeInfo_$union, any]>(l_13, undefined)));
                                                            }
                                                            else {
                                                                const activePatternResult_15: Option<any> = $007CSeqType$007C_$007C(resolvedType);
                                                                if (activePatternResult_15 != null) {
                                                                    const elemType_8: any = value(activePatternResult_15);
                                                                    return TypeInfo_Seq((l_14 = (new Lazy<TypeInfo_$union>((): TypeInfo_$union => createTypeInfo(elemType_8))), (): TypeInfo_$union => lazyToDelayed<TypeInfo_$union>(l_14, undefined)));
                                                                }
                                                                else {
                                                                    const activePatternResult_16: Option<any> = $007CAsyncType$007C_$007C(resolvedType);
                                                                    if (activePatternResult_16 != null) {
                                                                        const elemType_9: any = value(activePatternResult_16);
                                                                        return TypeInfo_Async((l_15 = (new Lazy<TypeInfo_$union>((): TypeInfo_$union => createTypeInfo(elemType_9))), (): TypeInfo_$union => lazyToDelayed<TypeInfo_$union>(l_15, undefined)));
                                                                    }
                                                                    else {
                                                                        const activePatternResult_17: Option<any> = $007CPromiseType$007C_$007C(resolvedType);
                                                                        if (activePatternResult_17 != null) {
                                                                            const elemType_10: any = value(activePatternResult_17);
                                                                            return TypeInfo_Promise((l_16 = (new Lazy<TypeInfo_$union>((): TypeInfo_$union => createTypeInfo(elemType_10))), (): TypeInfo_$union => lazyToDelayed<TypeInfo_$union>(l_16, undefined)));
                                                                        }
                                                                        else {
                                                                            return TypeInfo_Any((l_17 = (new Lazy<any>((): any => resolvedType)), (): any => lazyToDelayed<any>(l_17, undefined)));
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

const typeInfoCache: IMap<any, TypeInfo_$union> = new Dictionary<any, TypeInfo_$union>([], {
    Equals: equals,
    GetHashCode: structuralHash,
});

export function createTypeInfo(resolvedType: any): TypeInfo_$union {
    let matchValue: [boolean, TypeInfo_$union];
    let outArg: TypeInfo_$union = defaultOf();
    matchValue = ([tryGetValue(typeInfoCache, resolvedType, new FSharpRef<TypeInfo_$union>((): TypeInfo_$union => outArg, (v: TypeInfo_$union): void => {
        outArg = v;
    })), outArg] as [boolean, TypeInfo_$union]);
    if (matchValue[0]) {
        return matchValue[1];
    }
    else {
        const ti_1: TypeInfo_$union = _createTypeInfo(resolvedType);
        if ((!isNullOrEmpty(fullName(resolvedType)) && !fullName(resolvedType).endsWith("`1[]")) && !fullName(resolvedType).endsWith("`2[]")) {
            typeInfoCache.set(resolvedType, ti_1);
            return ti_1;
        }
        else {
            return ti_1;
        }
    }
}

/**
 * returns whether a type is primitive
 */
export function isPrimitive(_arg: TypeInfo_$union): boolean {
    switch (_arg.tag) {
        case /* Unit */ 0:
        case /* String */ 2:
        case /* UInt16 */ 3:
        case /* UInt32 */ 4:
        case /* UInt64 */ 5:
        case /* Int32 */ 6:
        case /* Bool */ 7:
        case /* Float32 */ 8:
        case /* Float */ 9:
        case /* Decimal */ 10:
        case /* Short */ 11:
        case /* Long */ 12:
        case /* Byte */ 13:
        case /* DateTime */ 15:
        case /* DateTimeOffset */ 16:
        case /* DateOnly */ 17:
        case /* TimeOnly */ 18:
        case /* BigInt */ 19:
        case /* Guid */ 21:
        case /* Option */ 27:
            return true;
        default:
            return false;
    }
}

/**
 * returns whether the discrimiated union type is like a enum
 */
export function enumUnion(_arg: TypeInfo_$union): boolean {
    if (_arg.tag === /* Union */ 40) {
        const array: UnionCase[] = _arg.fields[0]()[0];
        return array.every((case$: UnionCase): boolean => (case$.CaseTypes.length === 0));
    }
    else {
        return false;
    }
}

