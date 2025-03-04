import { head, find, map, setItem, item, fill } from "../fable-library-ts.4.24.0/Array.js";
import { float64, float32, uint32, uint16, int16, int8, int32, uint8 } from "../fable-library-ts.4.24.0/Int32.js";
import { isEnum, int8_type, uint16_type, uint32_type, bigint_type, array_type, uint8_type, fullName, decimal_type, int16_type, int64_type, getTupleElements, makeTuple, isTuple, getElementType, isArray, list_type, option_type, isGenericType, makeUnion, getUnionCaseFields, getUnionCases, int32_type, isUnion, makeRecord, getRecordElements, isRecord, obj_type, getGenericTypeDefinition, equals, name, getGenerics, class_type, TypeInfo } from "../fable-library-ts.4.24.0/Reflection.js";
import { get_UTF8 } from "../fable-library-ts.4.24.0/Encoding.js";
import { fromUInt64, fromUInt32, fromUInt16, fromInt16, fromInt32, toFloat64, toInt8, toUInt8, toUInt16, toUInt32, toInt16, toInt32, fromInt8, fromUInt8, toInt64 as toInt64_1, fromByteArray, equals as equals_2, int64, uint64, fromInt64, toUInt64 } from "../fable-library-ts.4.24.0/BigInt.js";
import { isLittleEndian, toDouble, toSingle, toInt64 } from "../fable-library-ts.4.24.0/BitConverter.js";
import { printf, toFail } from "../fable-library-ts.4.24.0/String.js";
import { defaultOf, compare, IMap, structuralHash, equals as equals_1, IComparable } from "../fable-library-ts.4.24.0/Util.js";
import { Dictionary } from "../fable-library-ts.4.24.0/MutableMap.js";
import { addToDict } from "../fable-library-ts.4.24.0/MapUtil.js";
import { ofArray } from "../fable-library-ts.4.24.0/Map.js";
import { FSharpSet__Add, FSharpSet, empty } from "../fable-library-ts.4.24.0/Set.js";
import { some } from "../fable-library-ts.4.24.0/Option.js";
import { singleton, collect, delay, toList } from "../fable-library-ts.4.24.0/Seq.js";
import { rangeDouble } from "../fable-library-ts.4.24.0/Range.js";
import { fromTicks } from "../fable-library-ts.4.24.0/Date.js";
import { fromTicks as fromTicks_1 } from "../fable-library-ts.4.24.0/DateOffset.js";
import { fromTicks as fromTicks_2, fromMinutes } from "../fable-library-ts.4.24.0/TimeSpan.js";
import { fromIntArray } from "../fable-library-ts.4.24.0/Decimal.js";
import { arrayToGuid } from "../fable-library-ts.4.24.0/Guid.js";
import { fromDayNumber } from "../fable-library-ts.4.24.0/DateOnly.js";
import { fromTicks as fromTicks_3 } from "../fable-library-ts.4.24.0/TimeOnly.js";

export function interpretStringAs(typ: any, str: string): any {
    return str;
}

export class Reader {
    readonly data: uint8[];
    pos: int32;
    readonly numberBuffer: uint8[];
    constructor(data: uint8[]) {
        this.data = data;
        this.pos = 0;
        this.numberBuffer = fill(new Array(8), 0, 8, 0);
    }
}

export function Reader_$reflection(): TypeInfo {
    return class_type("Fable.Remoting.MsgPack.Read.Reader", undefined, Reader);
}

export function Reader_$ctor_Z3F6BC7B1(data: uint8[]): Reader {
    return new Reader(data);
}

export function Reader__ReadByte(_: Reader): uint8 {
    _.pos = ((_.pos + 1) | 0);
    return item(_.pos - 1, _.data);
}

export function Reader__ReadRawBin_Z524259A4(_: Reader, len: int32): uint8[] {
    _.pos = ((_.pos + len) | 0);
    return _.data.slice(_.pos - len, (_.pos - 1) + 1);
}

export function Reader__ReadString_Z524259A4(_: Reader, len: int32): string {
    _.pos = ((_.pos + len) | 0);
    return get_UTF8().getString(_.data, _.pos - len, len);
}

export function Reader__ReadUInt8(x: Reader): uint8 {
    return Reader__ReadByte(x);
}

export function Reader__ReadInt8(x: Reader): int8 {
    const value: uint8 = Reader__ReadByte(x);
    return ((value + 0x80 & 0xFF) - 0x80) | 0;
}

export function Reader__ReadUInt16(x: Reader): uint16 {
    const value: int16 = Reader__ReadInt16(x) | 0;
    return value & 0xFFFF;
}

export function Reader__ReadInt16(_: Reader): int16 {
    _.pos = ((_.pos + 2) | 0);
    return ((((item(_.pos - 2, _.data) + 0x8000 & 0xFFFF) - 0x8000) << 8) | ((item(_.pos - 1, _.data) + 0x8000 & 0xFFFF) - 0x8000)) | 0;
}

export function Reader__ReadUInt32(x: Reader): uint32 {
    const value: int32 = Reader__ReadInt32(x) | 0;
    return value >>> 0;
}

export function Reader__ReadInt32(_: Reader): int32 {
    _.pos = ((_.pos + 4) | 0);
    return ((((~~item(_.pos - 4, _.data) << 24) | (~~item(_.pos - 3, _.data) << 16)) | (~~item(_.pos - 2, _.data) << 8)) | ~~item(_.pos - 1, _.data)) | 0;
}

export function Reader__ReadUInt64(x: Reader): uint64 {
    return toUInt64(fromInt64(Reader__ReadInt64(x)));
}

export function Reader__ReadInt64(_: Reader): int64 {
    return Reader__readNumber<int64>(_, 8, (tupledArg: [uint8[], int32]): boolean => toInt64(tupledArg[0], tupledArg[1]));
}

export function Reader__ReadFloat32(x: Reader): float32 {
    return Reader__readNumber<float32>(x, 4, (tupledArg: [uint8[], int32]): boolean => toSingle(tupledArg[0], tupledArg[1]));
}

export function Reader__ReadFloat64(x: Reader): float64 {
    return Reader__readNumber<float64>(x, 8, (tupledArg: [uint8[], int32]): boolean => toDouble(tupledArg[0], tupledArg[1]));
}

export function Reader__ReadMap_412036CA(x: Reader, len: int32, t: any): any {
    const args: any[] = getGenerics(t);
    if (args.length !== 2) {
        const arg: string = name(t);
        toFail(printf("Expecting %s, but the data contains a map."))(arg);
    }
    let pairs: [IComparable, any][];
    const arr: [IComparable, any][] = fill(new Array(len), 0, len, null);
    for (let i = 0; i <= (len - 1); i++) {
        setItem(arr, i, [Reader__Read_24524716(x, item(0, args)) as IComparable, Reader__Read_24524716(x, item(1, args))] as [IComparable, any]);
    }
    pairs = arr;
    if (equals(getGenericTypeDefinition(t), class_type("System.Collections.Generic.Dictionary`2", [obj_type, obj_type]))) {
        const dict: IMap<IComparable, any> = new Dictionary<IComparable, any>([], {
            Equals: equals_1,
            GetHashCode: structuralHash,
        });
        pairs.forEach((tupledArg: [IComparable, any]): void => {
            addToDict(dict, tupledArg[0], tupledArg[1]);
        });
        return dict;
    }
    else {
        return ofArray<IComparable, any>(pairs, {
            Compare: compare,
        });
    }
}

export function Reader__ReadSet_412036CA(x: Reader, len: int32, t: any): any {
    const args: any[] = getGenerics(t);
    if (args.length !== 1) {
        const arg: string = name(t);
        toFail(printf("Expecting %s, but the data contains a set."))(arg);
    }
    let set$: FSharpSet<IComparable> = empty<IComparable>({
        Compare: compare,
    });
    for (let forLoopVar = 0; forLoopVar <= (len - 1); forLoopVar++) {
        set$ = FSharpSet__Add(set$, Reader__Read_24524716(x, item(0, args)) as IComparable);
    }
    return set$;
}

export function Reader__ReadRawArray_412036CA(x: Reader, len: int32, elementType: any): any[] {
    const arr: any[] = fill(new Array(len), 0, len, null);
    for (let i = 0; i <= (len - 1); i++) {
        setItem(arr, i, Reader__Read_24524716(x, elementType));
    }
    return arr;
}

export function Reader__ReadArray_412036CA(x: Reader, len: int32, t: any): any {
    if (isRecord(t)) {
        const props: any[] = getRecordElements(t);
        return makeRecord(t, map<any, any>((prop: any): any => Reader__Read_24524716(x, prop[1]), props));
    }
    else if (isUnion(t, true)) {
        const tag: int32 = (Reader__Read_24524716(x, int32_type) as int32) | 0;
        const case$: any = find<any>((x_1: any): boolean => (x_1.tag === tag), getUnionCases(t, true));
        const fieldTypes: any[] = map<any, any>((x_2: any): any => x_2[1], getUnionCaseFields(case$));
        let fields: any[];
        switch (fieldTypes.length) {
            case 1: {
                fields = [Reader__Read_24524716(x, item(0, fieldTypes))];
                break;
            }
            case 0: {
                fields = [];
                break;
            }
            default: {
                Reader__ReadByte(x);
                fields = map<any, any>((t_1: any): any => Reader__Read_24524716(x, t_1), fieldTypes);
            }
        }
        return makeUnion(case$, fields, true);
    }
    else if (isGenericType(t) && equals(getGenericTypeDefinition(t), option_type(obj_type))) {
        const tag_1: uint8 = Reader__ReadByte(x);
        if (tag_1 === 0) {
            return defaultOf();
        }
        else {
            return some(Reader__Read_24524716(x, head<any>(getGenerics(t))));
        }
    }
    else if (isGenericType(t) && equals(getGenericTypeDefinition(t), list_type(obj_type))) {
        const elementType: any = head<any>(getGenerics(t));
        return toList<any>(delay<any>((): Iterable<any> => collect<int32, Iterable<any>, any>((matchValue: int32): Iterable<any> => singleton<any>(Reader__Read_24524716(x, elementType)), rangeDouble(0, 1, len - 1))));
    }
    else if (isArray(t)) {
        return Reader__ReadRawArray_412036CA(x, len, getElementType(t));
    }
    else if (isTuple(t)) {
        return makeTuple(map<any, any>((t_2: any): any => Reader__Read_24524716(x, t_2), getTupleElements(t)), t);
    }
    else if (equals(t, class_type("System.DateTime"))) {
        const dateTimeTicks = Reader__Read_24524716(x, int64_type) as int64;
        const kindAsInt = Reader__Read_24524716(x, int64_type) as int64;
        const kind: int32 = (equals_2(kindAsInt, 1n) ? 1 : (equals_2(kindAsInt, 2n) ? 2 : 0)) | 0;
        return fromTicks(dateTimeTicks, kind);
    }
    else if (equals(t, class_type("System.DateTimeOffset"))) {
        const dateTimeTicks_1 = Reader__Read_24524716(x, int64_type) as int64;
        const timeSpanMinutes: int16 = (Reader__Read_24524716(x, int16_type) as int16) | 0;
        return fromTicks_1(dateTimeTicks_1, fromMinutes(timeSpanMinutes));
    }
    else if (isGenericType(t) && equals(getGenericTypeDefinition(t), class_type("Microsoft.FSharp.Collections.FSharpSet`1", [obj_type]))) {
        return Reader__ReadSet_412036CA(x, len, t);
    }
    else if (equals(t, decimal_type) ? true : (fullName(t) === "Microsoft.FSharp.Core.decimal`1")) {
        return fromIntArray(Reader__ReadRawArray_412036CA(x, 4, int32_type) as int32[]);
    }
    else {
        const arg: string = name(t);
        const arg_1: int32 = x.pos | 0;
        return toFail(printf("Expecting %s at position %d, but the data contains an array."))(arg)(arg_1);
    }
}

export function Reader__ReadBin_412036CA(x: Reader, len: int32, t: any): any {
    if (equals(t, class_type("System.Guid"))) {
        return arrayToGuid(Reader__ReadRawBin_Z524259A4(x, len));
    }
    else if (equals(t, array_type(uint8_type))) {
        return Reader__ReadRawBin_Z524259A4(x, len);
    }
    else if (equals(t, bigint_type)) {
        return fromByteArray(Reader__ReadRawBin_Z524259A4(x, len));
    }
    else {
        const arg: string = name(t);
        const arg_1: int32 = x.pos | 0;
        return toFail(printf("Expecting %s at position %d, but the data contains bin."))(arg)(arg_1);
    }
}

export function Reader__Read_24524716(x: Reader, t: any): any {
    let b: uint8, b_1: uint8, b_2: uint8, b_3: uint8, b_4: uint8, b_5: uint8, b_6: uint8, b_7: uint8, b_8: uint8, b_9: uint8, b_10: uint8, b_11: uint8, b_12: uint8, b_13: uint8, b_14: uint8, b_15: uint8, b_16: uint8, b_17: uint8, b_18: uint8, b_19: uint8, b_20: uint8, b_21: uint8, b_22: uint8, b_23: uint8, b_24: uint8, b_25: uint8, b_26: uint8, b_27: uint8, b_28: uint8, b_29: uint8, b_30: uint8, b_31: uint8, b_32: uint8, b_33: uint8, b_34: uint8, b_35: uint8, b_36: uint8, b_37: uint8, b_38: uint8, b_39: uint8, b_40: uint8, b_41: uint8, b_42: uint8, b_43: uint8, b_44: uint8, b_45: uint8, b_46: uint8, b_47: uint8, b_48: uint8, b_49: uint8, b_50: uint8, b_51: uint8, b_52: uint8, b_53: uint8, b_54: uint8, b_55: uint8, b_56: uint8;
    const matchValue: uint8 = Reader__ReadByte(x);
    let matchResult: int32, b_58: uint8, b_59: uint8, b_60: uint8, b_61: uint8;
    if ((b = matchValue, (b | 31) === 191)) {
        matchResult = 0;
    }
    else {
        switch (matchValue) {
            case 192: {
                if ((b_1 = matchValue, (b_1 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_2 = matchValue, (b_2 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 16;
                }
                break;
            }
            case 194: {
                if ((b_3 = matchValue, (b_3 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_4 = matchValue, (b_4 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 18;
                }
                break;
            }
            case 195: {
                if ((b_5 = matchValue, (b_5 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_6 = matchValue, (b_6 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 17;
                }
                break;
            }
            case 196: {
                if ((b_7 = matchValue, (b_7 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_8 = matchValue, (b_8 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else if ((b_9 = matchValue, (b_9 | 15) === 159)) {
                    matchResult = 19;
                    b_60 = matchValue;
                }
                else if ((b_10 = matchValue, (b_10 | 15) === 143)) {
                    matchResult = 22;
                    b_61 = matchValue;
                }
                else {
                    matchResult = 25;
                }
                break;
            }
            case 197: {
                if ((b_11 = matchValue, (b_11 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_12 = matchValue, (b_12 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else if ((b_13 = matchValue, (b_13 | 15) === 159)) {
                    matchResult = 19;
                    b_60 = matchValue;
                }
                else if ((b_14 = matchValue, (b_14 | 15) === 143)) {
                    matchResult = 22;
                    b_61 = matchValue;
                }
                else {
                    matchResult = 26;
                }
                break;
            }
            case 198: {
                if ((b_15 = matchValue, (b_15 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_16 = matchValue, (b_16 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else if ((b_17 = matchValue, (b_17 | 15) === 159)) {
                    matchResult = 19;
                    b_60 = matchValue;
                }
                else if ((b_18 = matchValue, (b_18 | 15) === 143)) {
                    matchResult = 22;
                    b_61 = matchValue;
                }
                else {
                    matchResult = 27;
                }
                break;
            }
            case 202: {
                if ((b_19 = matchValue, (b_19 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_20 = matchValue, (b_20 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 14;
                }
                break;
            }
            case 203: {
                if ((b_21 = matchValue, (b_21 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_22 = matchValue, (b_22 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 15;
                }
                break;
            }
            case 204: {
                if ((b_23 = matchValue, (b_23 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_24 = matchValue, (b_24 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 10;
                }
                break;
            }
            case 205: {
                if ((b_25 = matchValue, (b_25 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_26 = matchValue, (b_26 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 11;
                }
                break;
            }
            case 206: {
                if ((b_27 = matchValue, (b_27 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_28 = matchValue, (b_28 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 12;
                }
                break;
            }
            case 207: {
                if ((b_29 = matchValue, (b_29 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_30 = matchValue, (b_30 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 13;
                }
                break;
            }
            case 208: {
                if ((b_31 = matchValue, (b_31 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_32 = matchValue, (b_32 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 9;
                }
                break;
            }
            case 209: {
                if ((b_33 = matchValue, (b_33 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_34 = matchValue, (b_34 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 8;
                }
                break;
            }
            case 210: {
                if ((b_35 = matchValue, (b_35 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_36 = matchValue, (b_36 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 7;
                }
                break;
            }
            case 211: {
                if ((b_37 = matchValue, (b_37 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_38 = matchValue, (b_38 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else {
                    matchResult = 6;
                }
                break;
            }
            case 217: {
                matchResult = 1;
                break;
            }
            case 218: {
                matchResult = 2;
                break;
            }
            case 219: {
                matchResult = 3;
                break;
            }
            case 220: {
                if ((b_39 = matchValue, (b_39 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_40 = matchValue, (b_40 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else if ((b_41 = matchValue, (b_41 | 15) === 159)) {
                    matchResult = 19;
                    b_60 = matchValue;
                }
                else {
                    matchResult = 20;
                }
                break;
            }
            case 221: {
                if ((b_42 = matchValue, (b_42 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_43 = matchValue, (b_43 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else if ((b_44 = matchValue, (b_44 | 15) === 159)) {
                    matchResult = 19;
                    b_60 = matchValue;
                }
                else {
                    matchResult = 21;
                }
                break;
            }
            case 222: {
                if ((b_45 = matchValue, (b_45 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_46 = matchValue, (b_46 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else if ((b_47 = matchValue, (b_47 | 15) === 159)) {
                    matchResult = 19;
                    b_60 = matchValue;
                }
                else if ((b_48 = matchValue, (b_48 | 15) === 143)) {
                    matchResult = 22;
                    b_61 = matchValue;
                }
                else {
                    matchResult = 23;
                }
                break;
            }
            case 223: {
                if ((b_49 = matchValue, (b_49 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_50 = matchValue, (b_50 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else if ((b_51 = matchValue, (b_51 | 15) === 159)) {
                    matchResult = 19;
                    b_60 = matchValue;
                }
                else if ((b_52 = matchValue, (b_52 | 15) === 143)) {
                    matchResult = 22;
                    b_61 = matchValue;
                }
                else {
                    matchResult = 24;
                }
                break;
            }
            default:
                if ((b_53 = matchValue, (b_53 | 127) === 127)) {
                    matchResult = 4;
                    b_58 = matchValue;
                }
                else if ((b_54 = matchValue, (b_54 | 31) === 255)) {
                    matchResult = 5;
                    b_59 = matchValue;
                }
                else if ((b_55 = matchValue, (b_55 | 15) === 159)) {
                    matchResult = 19;
                    b_60 = matchValue;
                }
                else if ((b_56 = matchValue, (b_56 | 15) === 143)) {
                    matchResult = 22;
                    b_61 = matchValue;
                }
                else {
                    matchResult = 28;
                }
        }
    }
    switch (matchResult) {
        case 0: {
            const b_57: uint8 = matchValue;
            return interpretStringAs(t, Reader__ReadString_Z524259A4(x, ~~(b_57 & 31)));
        }
        case 1:
            return interpretStringAs(t, Reader__ReadString_Z524259A4(x, ~~Reader__ReadByte(x)));
        case 2:
            return interpretStringAs(t, Reader__ReadString_Z524259A4(x, ~~Reader__ReadUInt16(x)));
        case 3:
            return interpretStringAs(t, Reader__ReadString_Z524259A4(x, ~~Reader__ReadUInt32(x)));
        case 4: {
            const typ: any = t;
            const n: uint8 = b_58!;
            if (typ === int32_type) {
                return ~~n;
            }
            else {
                const typeName: string = fullName(typ);
                if (typeName === "System.Int64") {
                    return toInt64_1(fromUInt8(n));
                }
                else if (typ === int16_type) {
                    return (n + 0x8000 & 0xFFFF) - 0x8000;
                }
                else if (typ === uint32_type) {
                    return n;
                }
                else if (typeName === "System.UInt64") {
                    return toUInt64(fromUInt8(n));
                }
                else if (typ === uint16_type) {
                    return n;
                }
                else {
                    switch (typeName) {
                        case "System.TimeSpan":
                            return fromTicks_2(toInt64_1(fromUInt8(n)));
                        case "System.DateOnly":
                            return fromDayNumber(~~n);
                        case "System.TimeOnly":
                            return fromTicks_3(toInt64_1(fromUInt8(n)));
                        case "Microsoft.FSharp.Core.int16`1":
                            return (n + 0x8000 & 0xFFFF) - 0x8000;
                        case "Microsoft.FSharp.Core.int32`1":
                            return ~~n;
                        case "Microsoft.FSharp.Core.int64`1":
                            return toInt64_1(fromUInt8(n));
                        default:
                            if (typ === uint8_type) {
                                return n;
                            }
                            else if (typ === int8_type) {
                                return (n + 0x80 & 0xFF) - 0x80;
                            }
                            else if (isEnum(typ)) {
                                return n;
                            }
                            else {
                                const arg_1: string = name(typ);
                                return toFail(printf("Cannot interpret integer %A as %s."))(n)(arg_1);
                            }
                    }
                }
            }
        }
        case 5: {
            const typ_1: any = t;
            const n_2: int8 = ((b_59! + 0x80 & 0xFF) - 0x80) | 0;
            if (typ_1 === int32_type) {
                return n_2;
            }
            else {
                const typeName_1: string = fullName(typ_1);
                if (typeName_1 === "System.Int64") {
                    return toInt64_1(fromInt8(n_2));
                }
                else if (typ_1 === int16_type) {
                    return n_2;
                }
                else if (typ_1 === uint32_type) {
                    return n_2 >>> 0;
                }
                else if (typeName_1 === "System.UInt64") {
                    return toUInt64(fromInt8(n_2));
                }
                else if (typ_1 === uint16_type) {
                    return n_2 & 0xFFFF;
                }
                else {
                    switch (typeName_1) {
                        case "System.TimeSpan":
                            return fromTicks_2(toInt64_1(fromInt8(n_2)));
                        case "System.DateOnly":
                            return fromDayNumber(n_2);
                        case "System.TimeOnly":
                            return fromTicks_3(toInt64_1(fromInt8(n_2)));
                        case "Microsoft.FSharp.Core.int16`1":
                            return n_2;
                        case "Microsoft.FSharp.Core.int32`1":
                            return n_2;
                        case "Microsoft.FSharp.Core.int64`1":
                            return toInt64_1(fromInt8(n_2));
                        default:
                            if (typ_1 === uint8_type) {
                                return n_2 & 0xFF;
                            }
                            else if (typ_1 === int8_type) {
                                return n_2;
                            }
                            else if (isEnum(typ_1)) {
                                return n_2;
                            }
                            else {
                                const arg_1_1: string = name(typ_1);
                                return toFail(printf("Cannot interpret integer %A as %s."))(n_2)(arg_1_1);
                            }
                    }
                }
            }
        }
        case 6: {
            const typ_2: any = t;
            const n_4: int64 = Reader__ReadInt64(x);
            if (typ_2 === int32_type) {
                return ~~toInt32(n_4);
            }
            else {
                const typeName_2: string = fullName(typ_2);
                if (typeName_2 === "System.Int64") {
                    return toInt64_1(fromInt64(n_4));
                }
                else if (typ_2 === int16_type) {
                    return (toInt16(n_4) + 0x8000 & 0xFFFF) - 0x8000;
                }
                else if (typ_2 === uint32_type) {
                    return toUInt32(n_4) >>> 0;
                }
                else if (typeName_2 === "System.UInt64") {
                    return toUInt64(fromInt64(n_4));
                }
                else if (typ_2 === uint16_type) {
                    return toUInt16(n_4) & 0xFFFF;
                }
                else {
                    switch (typeName_2) {
                        case "System.TimeSpan":
                            return fromTicks_2(toInt64_1(fromInt64(n_4)));
                        case "System.DateOnly":
                            return fromDayNumber(~~toInt32(n_4));
                        case "System.TimeOnly":
                            return fromTicks_3(toInt64_1(fromInt64(n_4)));
                        case "Microsoft.FSharp.Core.int16`1":
                            return (toInt16(n_4) + 0x8000 & 0xFFFF) - 0x8000;
                        case "Microsoft.FSharp.Core.int32`1":
                            return ~~toInt32(n_4);
                        case "Microsoft.FSharp.Core.int64`1":
                            return toInt64_1(fromInt64(n_4));
                        default:
                            if (typ_2 === uint8_type) {
                                return toUInt8(n_4) & 0xFF;
                            }
                            else if (typ_2 === int8_type) {
                                return (toInt8(n_4) + 0x80 & 0xFF) - 0x80;
                            }
                            else if (isEnum(typ_2)) {
                                return toFloat64(n_4);
                            }
                            else {
                                const arg_1_2: string = name(typ_2);
                                return toFail(printf("Cannot interpret integer %A as %s."))(n_4)(arg_1_2);
                            }
                    }
                }
            }
        }
        case 7: {
            const typ_3: any = t;
            const n_6: int32 = Reader__ReadInt32(x) | 0;
            if (typ_3 === int32_type) {
                return n_6;
            }
            else {
                const typeName_3: string = fullName(typ_3);
                if (typeName_3 === "System.Int64") {
                    return toInt64_1(fromInt32(n_6));
                }
                else if (typ_3 === int16_type) {
                    return (n_6 + 0x8000 & 0xFFFF) - 0x8000;
                }
                else if (typ_3 === uint32_type) {
                    return n_6 >>> 0;
                }
                else if (typeName_3 === "System.UInt64") {
                    return toUInt64(fromInt32(n_6));
                }
                else if (typ_3 === uint16_type) {
                    return n_6 & 0xFFFF;
                }
                else {
                    switch (typeName_3) {
                        case "System.TimeSpan":
                            return fromTicks_2(toInt64_1(fromInt32(n_6)));
                        case "System.DateOnly":
                            return fromDayNumber(n_6);
                        case "System.TimeOnly":
                            return fromTicks_3(toInt64_1(fromInt32(n_6)));
                        case "Microsoft.FSharp.Core.int16`1":
                            return (n_6 + 0x8000 & 0xFFFF) - 0x8000;
                        case "Microsoft.FSharp.Core.int32`1":
                            return n_6;
                        case "Microsoft.FSharp.Core.int64`1":
                            return toInt64_1(fromInt32(n_6));
                        default:
                            if (typ_3 === uint8_type) {
                                return n_6 & 0xFF;
                            }
                            else if (typ_3 === int8_type) {
                                return (n_6 + 0x80 & 0xFF) - 0x80;
                            }
                            else if (isEnum(typ_3)) {
                                return n_6;
                            }
                            else {
                                const arg_1_3: string = name(typ_3);
                                return toFail(printf("Cannot interpret integer %A as %s."))(n_6)(arg_1_3);
                            }
                    }
                }
            }
        }
        case 8: {
            const typ_4: any = t;
            const n_8: int16 = Reader__ReadInt16(x) | 0;
            if (typ_4 === int32_type) {
                return n_8;
            }
            else {
                const typeName_4: string = fullName(typ_4);
                if (typeName_4 === "System.Int64") {
                    return toInt64_1(fromInt16(n_8));
                }
                else if (typ_4 === int16_type) {
                    return n_8;
                }
                else if (typ_4 === uint32_type) {
                    return n_8 >>> 0;
                }
                else if (typeName_4 === "System.UInt64") {
                    return toUInt64(fromInt16(n_8));
                }
                else if (typ_4 === uint16_type) {
                    return n_8 & 0xFFFF;
                }
                else {
                    switch (typeName_4) {
                        case "System.TimeSpan":
                            return fromTicks_2(toInt64_1(fromInt16(n_8)));
                        case "System.DateOnly":
                            return fromDayNumber(n_8);
                        case "System.TimeOnly":
                            return fromTicks_3(toInt64_1(fromInt16(n_8)));
                        case "Microsoft.FSharp.Core.int16`1":
                            return n_8;
                        case "Microsoft.FSharp.Core.int32`1":
                            return n_8;
                        case "Microsoft.FSharp.Core.int64`1":
                            return toInt64_1(fromInt16(n_8));
                        default:
                            if (typ_4 === uint8_type) {
                                return n_8 & 0xFF;
                            }
                            else if (typ_4 === int8_type) {
                                return (n_8 + 0x80 & 0xFF) - 0x80;
                            }
                            else if (isEnum(typ_4)) {
                                return n_8;
                            }
                            else {
                                const arg_1_4: string = name(typ_4);
                                return toFail(printf("Cannot interpret integer %A as %s."))(n_8)(arg_1_4);
                            }
                    }
                }
            }
        }
        case 9: {
            const typ_5: any = t;
            const n_10: int8 = Reader__ReadInt8(x) | 0;
            if (typ_5 === int32_type) {
                return n_10;
            }
            else {
                const typeName_5: string = fullName(typ_5);
                if (typeName_5 === "System.Int64") {
                    return toInt64_1(fromInt8(n_10));
                }
                else if (typ_5 === int16_type) {
                    return n_10;
                }
                else if (typ_5 === uint32_type) {
                    return n_10 >>> 0;
                }
                else if (typeName_5 === "System.UInt64") {
                    return toUInt64(fromInt8(n_10));
                }
                else if (typ_5 === uint16_type) {
                    return n_10 & 0xFFFF;
                }
                else {
                    switch (typeName_5) {
                        case "System.TimeSpan":
                            return fromTicks_2(toInt64_1(fromInt8(n_10)));
                        case "System.DateOnly":
                            return fromDayNumber(n_10);
                        case "System.TimeOnly":
                            return fromTicks_3(toInt64_1(fromInt8(n_10)));
                        case "Microsoft.FSharp.Core.int16`1":
                            return n_10;
                        case "Microsoft.FSharp.Core.int32`1":
                            return n_10;
                        case "Microsoft.FSharp.Core.int64`1":
                            return toInt64_1(fromInt8(n_10));
                        default:
                            if (typ_5 === uint8_type) {
                                return n_10 & 0xFF;
                            }
                            else if (typ_5 === int8_type) {
                                return n_10;
                            }
                            else if (isEnum(typ_5)) {
                                return n_10;
                            }
                            else {
                                const arg_1_5: string = name(typ_5);
                                return toFail(printf("Cannot interpret integer %A as %s."))(n_10)(arg_1_5);
                            }
                    }
                }
            }
        }
        case 10: {
            const typ_6: any = t;
            const n_12: uint8 = Reader__ReadUInt8(x);
            if (typ_6 === int32_type) {
                return ~~n_12;
            }
            else {
                const typeName_6: string = fullName(typ_6);
                if (typeName_6 === "System.Int64") {
                    return toInt64_1(fromUInt8(n_12));
                }
                else if (typ_6 === int16_type) {
                    return (n_12 + 0x8000 & 0xFFFF) - 0x8000;
                }
                else if (typ_6 === uint32_type) {
                    return n_12;
                }
                else if (typeName_6 === "System.UInt64") {
                    return toUInt64(fromUInt8(n_12));
                }
                else if (typ_6 === uint16_type) {
                    return n_12;
                }
                else {
                    switch (typeName_6) {
                        case "System.TimeSpan":
                            return fromTicks_2(toInt64_1(fromUInt8(n_12)));
                        case "System.DateOnly":
                            return fromDayNumber(~~n_12);
                        case "System.TimeOnly":
                            return fromTicks_3(toInt64_1(fromUInt8(n_12)));
                        case "Microsoft.FSharp.Core.int16`1":
                            return (n_12 + 0x8000 & 0xFFFF) - 0x8000;
                        case "Microsoft.FSharp.Core.int32`1":
                            return ~~n_12;
                        case "Microsoft.FSharp.Core.int64`1":
                            return toInt64_1(fromUInt8(n_12));
                        default:
                            if (typ_6 === uint8_type) {
                                return n_12;
                            }
                            else if (typ_6 === int8_type) {
                                return (n_12 + 0x80 & 0xFF) - 0x80;
                            }
                            else if (isEnum(typ_6)) {
                                return n_12;
                            }
                            else {
                                const arg_1_6: string = name(typ_6);
                                return toFail(printf("Cannot interpret integer %A as %s."))(n_12)(arg_1_6);
                            }
                    }
                }
            }
        }
        case 11: {
            const typ_7: any = t;
            const n_14: uint16 = Reader__ReadUInt16(x);
            if (typ_7 === int32_type) {
                return ~~n_14;
            }
            else {
                const typeName_7: string = fullName(typ_7);
                if (typeName_7 === "System.Int64") {
                    return toInt64_1(fromUInt16(n_14));
                }
                else if (typ_7 === int16_type) {
                    return (n_14 + 0x8000 & 0xFFFF) - 0x8000;
                }
                else if (typ_7 === uint32_type) {
                    return n_14;
                }
                else if (typeName_7 === "System.UInt64") {
                    return toUInt64(fromUInt16(n_14));
                }
                else if (typ_7 === uint16_type) {
                    return n_14;
                }
                else {
                    switch (typeName_7) {
                        case "System.TimeSpan":
                            return fromTicks_2(toInt64_1(fromUInt16(n_14)));
                        case "System.DateOnly":
                            return fromDayNumber(~~n_14);
                        case "System.TimeOnly":
                            return fromTicks_3(toInt64_1(fromUInt16(n_14)));
                        case "Microsoft.FSharp.Core.int16`1":
                            return (n_14 + 0x8000 & 0xFFFF) - 0x8000;
                        case "Microsoft.FSharp.Core.int32`1":
                            return ~~n_14;
                        case "Microsoft.FSharp.Core.int64`1":
                            return toInt64_1(fromUInt16(n_14));
                        default:
                            if (typ_7 === uint8_type) {
                                return n_14 & 0xFF;
                            }
                            else if (typ_7 === int8_type) {
                                return (n_14 + 0x80 & 0xFF) - 0x80;
                            }
                            else if (isEnum(typ_7)) {
                                return n_14;
                            }
                            else {
                                const arg_1_7: string = name(typ_7);
                                return toFail(printf("Cannot interpret integer %A as %s."))(n_14)(arg_1_7);
                            }
                    }
                }
            }
        }
        case 12: {
            const typ_8: any = t;
            const n_16: uint32 = Reader__ReadUInt32(x);
            if (typ_8 === int32_type) {
                return ~~n_16;
            }
            else {
                const typeName_8: string = fullName(typ_8);
                if (typeName_8 === "System.Int64") {
                    return toInt64_1(fromUInt32(n_16));
                }
                else if (typ_8 === int16_type) {
                    return (n_16 + 0x8000 & 0xFFFF) - 0x8000;
                }
                else if (typ_8 === uint32_type) {
                    return n_16;
                }
                else if (typeName_8 === "System.UInt64") {
                    return toUInt64(fromUInt32(n_16));
                }
                else if (typ_8 === uint16_type) {
                    return n_16 & 0xFFFF;
                }
                else {
                    switch (typeName_8) {
                        case "System.TimeSpan":
                            return fromTicks_2(toInt64_1(fromUInt32(n_16)));
                        case "System.DateOnly":
                            return fromDayNumber(~~n_16);
                        case "System.TimeOnly":
                            return fromTicks_3(toInt64_1(fromUInt32(n_16)));
                        case "Microsoft.FSharp.Core.int16`1":
                            return (n_16 + 0x8000 & 0xFFFF) - 0x8000;
                        case "Microsoft.FSharp.Core.int32`1":
                            return ~~n_16;
                        case "Microsoft.FSharp.Core.int64`1":
                            return toInt64_1(fromUInt32(n_16));
                        default:
                            if (typ_8 === uint8_type) {
                                return n_16 & 0xFF;
                            }
                            else if (typ_8 === int8_type) {
                                return (n_16 + 0x80 & 0xFF) - 0x80;
                            }
                            else if (isEnum(typ_8)) {
                                return n_16;
                            }
                            else {
                                const arg_1_8: string = name(typ_8);
                                return toFail(printf("Cannot interpret integer %A as %s."))(n_16)(arg_1_8);
                            }
                    }
                }
            }
        }
        case 13: {
            const typ_9: any = t;
            const n_18: uint64 = Reader__ReadUInt64(x);
            if (typ_9 === int32_type) {
                return ~~toInt32(n_18);
            }
            else {
                const typeName_9: string = fullName(typ_9);
                if (typeName_9 === "System.Int64") {
                    return toInt64_1(fromUInt64(n_18));
                }
                else if (typ_9 === int16_type) {
                    return (toInt16(n_18) + 0x8000 & 0xFFFF) - 0x8000;
                }
                else if (typ_9 === uint32_type) {
                    return toUInt32(n_18) >>> 0;
                }
                else if (typeName_9 === "System.UInt64") {
                    return toUInt64(fromUInt64(n_18));
                }
                else if (typ_9 === uint16_type) {
                    return toUInt16(n_18) & 0xFFFF;
                }
                else {
                    switch (typeName_9) {
                        case "System.TimeSpan":
                            return fromTicks_2(toInt64_1(fromUInt64(n_18)));
                        case "System.DateOnly":
                            return fromDayNumber(~~toInt32(n_18));
                        case "System.TimeOnly":
                            return fromTicks_3(toInt64_1(fromUInt64(n_18)));
                        case "Microsoft.FSharp.Core.int16`1":
                            return (toInt16(n_18) + 0x8000 & 0xFFFF) - 0x8000;
                        case "Microsoft.FSharp.Core.int32`1":
                            return ~~toInt32(n_18);
                        case "Microsoft.FSharp.Core.int64`1":
                            return toInt64_1(fromUInt64(n_18));
                        default:
                            if (typ_9 === uint8_type) {
                                return toUInt8(n_18) & 0xFF;
                            }
                            else if (typ_9 === int8_type) {
                                return (toInt8(n_18) + 0x80 & 0xFF) - 0x80;
                            }
                            else if (isEnum(typ_9)) {
                                return toFloat64(n_18);
                            }
                            else {
                                const arg_1_9: string = name(typ_9);
                                return toFail(printf("Cannot interpret integer %A as %s."))(n_18)(arg_1_9);
                            }
                    }
                }
            }
        }
        case 14:
            return Reader__ReadFloat32(x);
        case 15:
            return Reader__ReadFloat64(x);
        case 16:
            return defaultOf();
        case 17:
            return true;
        case 18:
            return false;
        case 19:
            return Reader__ReadArray_412036CA(x, ~~(b_60! & 15), t);
        case 20: {
            const len_4: int32 = ~~Reader__ReadUInt16(x) | 0;
            return Reader__ReadArray_412036CA(x, len_4, t);
        }
        case 21: {
            const len_5: int32 = ~~Reader__ReadUInt32(x) | 0;
            return Reader__ReadArray_412036CA(x, len_5, t);
        }
        case 22:
            return Reader__ReadMap_412036CA(x, ~~(b_61! & 15), t);
        case 23: {
            const len_6: int32 = ~~Reader__ReadUInt16(x) | 0;
            return Reader__ReadMap_412036CA(x, len_6, t);
        }
        case 24: {
            const len_7: int32 = ~~Reader__ReadUInt32(x) | 0;
            return Reader__ReadMap_412036CA(x, len_7, t);
        }
        case 25: {
            const len_8: int32 = ~~Reader__ReadByte(x) | 0;
            return Reader__ReadBin_412036CA(x, len_8, t);
        }
        case 26: {
            const len_9: int32 = ~~Reader__ReadUInt16(x) | 0;
            return Reader__ReadBin_412036CA(x, len_9, t);
        }
        case 27: {
            const len_10: int32 = ~~Reader__ReadUInt32(x) | 0;
            return Reader__ReadBin_412036CA(x, len_10, t);
        }
        default: {
            const b_62: uint8 = matchValue;
            const arg_11: int32 = x.pos | 0;
            const arg_13: string = name(t);
            return toFail(printf("Position %d, byte %d, expected type %s."))(arg_11)(b_62)(arg_13);
        }
    }
}

export function Reader__readNumber<$a>(this$: Reader, len: int32, bytesInterpretation: ((arg0: [uint8[], int32]) => $a)): $a {
    this$.pos = ((this$.pos + len) | 0);
    if (isLittleEndian()) {
        for (let i = 0; i <= (len - 1); i++) {
            this$.numberBuffer[i] = item((this$.pos - 1) - i, this$.data);
        }
        return bytesInterpretation([this$.numberBuffer, 0] as [uint8[], int32]);
    }
    else {
        return bytesInterpretation([this$.data, this$.pos - len] as [uint8[], int32]);
    }
}

