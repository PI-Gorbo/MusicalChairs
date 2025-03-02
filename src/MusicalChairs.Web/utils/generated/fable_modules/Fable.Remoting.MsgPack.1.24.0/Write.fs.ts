import { uint16, int16, int8, int32, uint32, float64, float32, uint8 } from "../fable-library-ts.4.24.0/Int32.js";
import { IDisposable, disposeSafe, isDisposable, IEnumerator, getEnumerator, defaultOf, IMap } from "../fable-library-ts.4.24.0/Util.js";
import { addToDict, tryGetValue } from "../fable-library-ts.4.24.0/MapUtil.js";
import { name, class_type, option_type, list_type, obj_type, equals, getGenerics, getGenericTypeDefinition, isGenericType, isEnum, getTupleFields, getTupleElements, isTuple, getUnionCaseFields, getUnionFields, isUnion, getElementType, isArray, getRecordFields, getRecordElements, isRecord, fullName } from "../fable-library-ts.4.24.0/Reflection.js";
import { FSharpRef } from "../fable-library-ts.4.24.0/Types.js";
import { getBytesDouble, getBytesSingle, getBytesInt64, isLittleEndian } from "../fable-library-ts.4.24.0/BitConverter.js";
import { head, map, item, reverse, addRangeInPlace } from "../fable-library-ts.4.24.0/Array.js";
import { fromFloat64, toByteArray, fromUInt16, fromUInt32, fromInt16, fromInt32, toInt64, int64, fromInt64, op_RightShift, toUInt64, uint64, toUInt8, compare } from "../fable-library-ts.4.24.0/BigInt.js";
import { decimal, getBits } from "../fable-library-ts.4.24.0/Decimal.js";
import { count } from "../fable-library-ts.4.24.0/CollectionUtil.js";
import { value as value_7, Option } from "../fable-library-ts.4.24.0/Option.js";
import { printf, toFail } from "../fable-library-ts.4.24.0/String.js";
import { get_UTF8 } from "../fable-library-ts.4.24.0/Encoding.js";
import { guidToArray } from "../fable-library-ts.4.24.0/Guid.js";
import { kind, getTicks } from "../fable-library-ts.4.24.0/Date.js";
import { ticks, totalMinutes } from "../fable-library-ts.4.24.0/TimeSpan.js";
import { offset } from "../fable-library-ts.4.24.0/DateOffset.js";
import { dayNumber } from "../fable-library-ts.4.24.0/DateOnly.js";

const serializerCache: IMap<string, ((arg0: any, arg1: uint8[]) => void)> = new Map<string, ((arg0: any, arg1: uint8[]) => void)>([]);

function cacheGetOrAdd(typ: any, f: ((arg0: any, arg1: uint8[]) => void)): ((arg0: any, arg1: uint8[]) => void) {
    let matchValue: [boolean, ((arg0: any, arg1: uint8[]) => void)];
    let outArg: ((arg0: any, arg1: uint8[]) => void) = defaultOf();
    matchValue = ([tryGetValue(serializerCache, fullName(typ), new FSharpRef<((arg0: any, arg1: uint8[]) => void)>((): ((arg0: any, arg1: uint8[]) => void) => outArg, (v: ((arg0: any, arg1: uint8[]) => void)): void => {
        outArg = v;
    })), outArg] as [boolean, ((arg0: any, arg1: uint8[]) => void)]);
    if (matchValue[0]) {
        const f_1: ((arg0: any, arg1: uint8[]) => void) = matchValue[1];
        return f_1;
    }
    else {
        addToDict(serializerCache, fullName(typ), f);
        return f;
    }
}

function write64bitNumber(b1: uint8, b2: uint8, b3: uint8, b4: uint8, b5: uint8, b6: uint8, b7: uint8, b8: uint8, out: uint8[]): void {
    if ((((b4 > 0) ? true : (b3 > 0)) ? true : (b2 > 0)) ? true : (b1 > 0)) {
        void (out.push(207));
        void (out.push(b1));
        void (out.push(b2));
        void (out.push(b3));
        void (out.push(b4));
        void (out.push(b5));
        void (out.push(b6));
        void (out.push(b7));
        void (out.push(b8));
    }
    else {
        const b1_1: uint8 = b5;
        const b2_1: uint8 = b6;
        const b3_1: uint8 = b7;
        const b4_1: uint8 = b8;
        const out_1: uint8[] = out;
        if ((b2_1 > 0) ? true : (b1_1 > 0)) {
            void (out_1.push(206));
            void (out_1.push(b1_1));
            void (out_1.push(b2_1));
            void (out_1.push(b3_1));
            void (out_1.push(b4_1));
        }
        else if (b3_1 > 0) {
            void (out_1.push(205));
            void (out_1.push(b3_1));
            void (out_1.push(b4_1));
        }
        else {
            void (out_1.push(204));
            void (out_1.push(b4_1));
        }
    }
}

function writeSignedNumber(bytes: uint8[], out: uint8[]): void {
    if (isLittleEndian()) {
        addRangeInPlace(reverse<uint8>(bytes), out);
    }
    else {
        addRangeInPlace(bytes, out);
    }
}

function writeUInt64(n: uint64, out: uint8[]): void {
    let value_1: uint64, value_1_1: uint64, value_2: uint64, value_3: uint64, value_4: uint64, value_5: uint64, value_6: uint64;
    if (compare(n, 128n) < 0) {
        void (out.push(toUInt8(n) & 0xFF));
    }
    else {
        const n_1: uint64 = n;
        write64bitNumber((value_1 = toUInt64(op_RightShift(n_1, 56)), toUInt8(value_1) & 0xFF), (value_1_1 = toUInt64(op_RightShift(n_1, 48)), toUInt8(value_1_1) & 0xFF), (value_2 = toUInt64(op_RightShift(n_1, 40)), toUInt8(value_2) & 0xFF), (value_3 = toUInt64(op_RightShift(n_1, 32)), toUInt8(value_3) & 0xFF), (value_4 = toUInt64(op_RightShift(n_1, 24)), toUInt8(value_4) & 0xFF), (value_5 = toUInt64(op_RightShift(n_1, 16)), toUInt8(value_5) & 0xFF), (value_6 = toUInt64(op_RightShift(n_1, 8)), toUInt8(value_6) & 0xFF), toUInt8(n_1) & 0xFF, out);
    }
}

function writeInt64(n: int64, out: uint8[]): void {
    if (compare(n, 0n) >= 0) {
        writeUInt64(toUInt64(fromInt64(n)), out);
    }
    else if (compare(n, -32n) > 0) {
        void (out.push((toUInt8(n) & 0xFF) | 224));
    }
    else {
        void (out.push(211));
        writeSignedNumber(Array.from(getBytesInt64(n)), out);
    }
}

function writeByte(b: uint8, out: uint8[]): void {
    if (b < 128) {
        void (out.push(b));
    }
    else {
        void (out.push(204));
        void (out.push(b));
    }
}

function writeSingle(n: float32, out: uint8[]): void {
    void (out.push(202));
    writeSignedNumber(Array.from(getBytesSingle(n)), out);
}

function writeDouble(n: float64, out: uint8[]): void {
    void (out.push(203));
    writeSignedNumber(Array.from(getBytesDouble(n)), out);
}

function writeBin(data: uint8[], out: uint8[]): void {
    let n: uint32, b: uint8, value: uint32, b_1: uint8, value_1: uint32, b_2: uint8, value_2: uint32, b_3: uint8;
    if (data.length < 256) {
        void (out.push(196));
    }
    else if (data.length < 65536) {
        void (out.push(197));
    }
    else {
        void (out.push(198));
    }
    ((n = (data.length >>> 0), (b = ((value = (n >>> 24), value & 0xFF)), (b_1 = ((value_1 = (n >>> 16), value_1 & 0xFF)), (b_2 = ((value_2 = (n >>> 8), value_2 & 0xFF)), (b_3 = (n & 0xFF), (writeFormat: boolean): void => {
        const b1: uint8 = b;
        const b2: uint8 = b_1;
        const b3: uint8 = b_2;
        const b4: uint8 = b_3;
        const out_2: uint8[] = out;
        const writeFormat_1: boolean = writeFormat;
        if ((b2 > 0) ? true : (b1 > 0)) {
            if (writeFormat_1) {
                void (out_2.push(206));
            }
            void (out_2.push(b1));
            void (out_2.push(b2));
            void (out_2.push(b3));
            void (out_2.push(b4));
        }
        else if (b3 > 0) {
            if (writeFormat_1) {
                void (out_2.push(205));
            }
            void (out_2.push(b3));
            void (out_2.push(b4));
        }
        else {
            if (writeFormat_1) {
                void (out_2.push(204));
            }
            void (out_2.push(b4));
        }
    }))))))(false);
    addRangeInPlace(data, out);
}

function writeArrayHeader(len: int32, out: uint8[]): void {
    let value: int32, n: uint32, b: uint8, value_1: uint32, b_1: uint8, value_1_1: uint32, b_2: uint8, value_2: uint32, b_3: uint8;
    if (len < 16) {
        void (out.push(144 + (len & 0xFF)));
    }
    else if (len < 65536) {
        void (out.push(220));
        void (out.push((value = ((len >> 8) | 0), value & 0xFF)));
        void (out.push(len & 0xFF));
    }
    else {
        void (out.push(221));
        ((n = (len >>> 0), (b = ((value_1 = (n >>> 24), value_1 & 0xFF)), (b_1 = ((value_1_1 = (n >>> 16), value_1_1 & 0xFF)), (b_2 = ((value_2 = (n >>> 8), value_2 & 0xFF)), (b_3 = (n & 0xFF), (writeFormat: boolean): void => {
            const b1: uint8 = b;
            const b2: uint8 = b_1;
            const b3: uint8 = b_2;
            const b4: uint8 = b_3;
            const out_2: uint8[] = out;
            const writeFormat_1: boolean = writeFormat;
            if ((b2 > 0) ? true : (b1 > 0)) {
                if (writeFormat_1) {
                    void (out_2.push(206));
                }
                void (out_2.push(b1));
                void (out_2.push(b2));
                void (out_2.push(b3));
                void (out_2.push(b4));
            }
            else if (b3 > 0) {
                if (writeFormat_1) {
                    void (out_2.push(205));
                }
                void (out_2.push(b3));
                void (out_2.push(b4));
            }
            else {
                if (writeFormat_1) {
                    void (out_2.push(204));
                }
                void (out_2.push(b4));
            }
        }))))))(false);
    }
}

function writeDecimal(n: decimal, out: uint8[]): void {
    let n_1: uint32, b_1: uint8, value: uint32, b_1_1: uint8, value_1: uint32, b_2: uint8, value_2: uint32, b_3: uint8;
    const bits: int32[] = getBits(n);
    void (out.push(144 + (4 & 0xFF)));
    for (let idx = 0; idx <= (bits.length - 1); idx++) {
        const b: int32 = item(idx, bits) | 0;
        ((n_1 = (b >>> 0), (b_1 = ((value = (n_1 >>> 24), value & 0xFF)), (b_1_1 = ((value_1 = (n_1 >>> 16), value_1 & 0xFF)), (b_2 = ((value_2 = (n_1 >>> 8), value_2 & 0xFF)), (b_3 = (n_1 & 0xFF), (writeFormat: boolean): void => {
            const b1: uint8 = b_1;
            const b2: uint8 = b_1_1;
            const b3: uint8 = b_2;
            const b4: uint8 = b_3;
            const out_2: uint8[] = out;
            const writeFormat_1: boolean = writeFormat;
            if ((b2 > 0) ? true : (b1 > 0)) {
                if (writeFormat_1) {
                    void (out_2.push(206));
                }
                void (out_2.push(b1));
                void (out_2.push(b2));
                void (out_2.push(b3));
                void (out_2.push(b4));
            }
            else if (b3 > 0) {
                if (writeFormat_1) {
                    void (out_2.push(205));
                }
                void (out_2.push(b3));
                void (out_2.push(b4));
            }
            else {
                if (writeFormat_1) {
                    void (out_2.push(204));
                }
                void (out_2.push(b4));
            }
        }))))))(true);
    }
}

function writeArray(out: uint8[], t: any, arr: Iterable): void {
    writeArrayHeader(count(arr), out);
    const enumerator: IEnumerator<any> = getEnumerator(arr);
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const x: any = enumerator["System.Collections.IEnumerator.get_Current"]();
            writeObject(x, t, out);
        }
    }
    finally {
        if (isDisposable(enumerator)) {
            disposeSafe(enumerator as IDisposable);
        }
    }
}

function writeMap(out: uint8[], keyType: any, valueType: any, dict: any): void {
    let value: int32, n: uint32, b: uint8, value_1: uint32, b_1: uint8, value_1_1: uint32, b_2: uint8, value_2: uint32, b_3: uint8;
    const length: int32 = count(dict) | 0;
    if (length < 16) {
        void (out.push(128 + (length & 0xFF)));
    }
    else if (length < 65536) {
        void (out.push(222));
        void (out.push((value = ((length >> 8) | 0), value & 0xFF)));
        void (out.push(length & 0xFF));
    }
    else {
        void (out.push(223));
        ((n = (length >>> 0), (b = ((value_1 = (n >>> 24), value_1 & 0xFF)), (b_1 = ((value_1_1 = (n >>> 16), value_1_1 & 0xFF)), (b_2 = ((value_2 = (n >>> 8), value_2 & 0xFF)), (b_3 = (n & 0xFF), (writeFormat: boolean): void => {
            const b1: uint8 = b;
            const b2: uint8 = b_1;
            const b3: uint8 = b_2;
            const b4: uint8 = b_3;
            const out_2: uint8[] = out;
            const writeFormat_1: boolean = writeFormat;
            if ((b2 > 0) ? true : (b1 > 0)) {
                if (writeFormat_1) {
                    void (out_2.push(206));
                }
                void (out_2.push(b1));
                void (out_2.push(b2));
                void (out_2.push(b3));
                void (out_2.push(b4));
            }
            else if (b3 > 0) {
                if (writeFormat_1) {
                    void (out_2.push(205));
                }
                void (out_2.push(b3));
                void (out_2.push(b4));
            }
            else {
                if (writeFormat_1) {
                    void (out_2.push(204));
                }
                void (out_2.push(b4));
            }
        }))))))(false);
    }
    const enumerator: IEnumerator<[any, any]> = getEnumerator(dict);
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const kvp: [any, any] = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
            writeObject(kvp[0], keyType, out);
            writeObject(kvp[1], valueType, out);
        }
    }
    finally {
        disposeSafe(enumerator as IDisposable);
    }
}

function writeSet(out: uint8[], t: any, set$: Iterable): void {
    writeArrayHeader(count(set$), out);
    const enumerator: IEnumerator<any> = getEnumerator(set$);
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const x: any = enumerator["System.Collections.IEnumerator.get_Current"]();
            writeObject(x, t, out);
        }
    }
    finally {
        if (isDisposable(enumerator)) {
            disposeSafe(enumerator as IDisposable);
        }
    }
}

function writeUnion(out: uint8[], tag: int32, types: any[], vals: any[]): void {
    if (vals.length === 0) {
        void (out.push(144 + 1));
        void (out.push(tag & 0xFF));
    }
    else {
        void (out.push(144 + 2));
        void (out.push(tag & 0xFF));
        if (vals.length === 1) {
            writeObject(item(0, vals), item(0, types), out);
        }
        else {
            writeArrayHeader(vals.length, out);
            for (let i = 0; i <= (vals.length - 1); i++) {
                writeObject(item(i, vals), item(i, types), out);
            }
        }
    }
}

export function writeObject(x: any, t: any, out: uint8[]): void {
    if (x == null) {
        void (out.push(192));
    }
    else {
        let matchValue: [boolean, ((arg0: any, arg1: uint8[]) => void)];
        let outArg: ((arg0: any, arg1: uint8[]) => void) = defaultOf();
        matchValue = ([tryGetValue(serializerCache, fullName(t), new FSharpRef<((arg0: any, arg1: uint8[]) => void)>((): ((arg0: any, arg1: uint8[]) => void) => outArg, (v: ((arg0: any, arg1: uint8[]) => void)): void => {
            outArg = v;
        })), outArg] as [boolean, ((arg0: any, arg1: uint8[]) => void)]);
        if (matchValue[0]) {
            const writer: ((arg0: any, arg1: uint8[]) => void) = matchValue[1];
            writer(x, out);
        }
        else if (isRecord(t, true)) {
            const fieldTypes: any[] = map<any, any>((x_1: any): any => x_1[1], getRecordElements(t, true));
            cacheGetOrAdd(t, (x_2: any, out_2: uint8[]): void => {
                const out_3: uint8[] = out_2;
                const vals: any[] = getRecordFields(x_2, true);
                writeArrayHeader(vals.length, out_3);
                for (let i = 0; i <= (vals.length - 1); i++) {
                    writeObject(item(i, vals), item(i, fieldTypes), out_3);
                }
            })(x, out);
        }
        else if (isArray(t)) {
            const elementType: any = getElementType(t);
            cacheGetOrAdd(t, (x_3: any, out_4: uint8[]): void => {
                writeArray(out_4, elementType, x_3 as Iterable);
            })(x, out);
        }
        else if (isUnion(t, true)) {
            cacheGetOrAdd(t, (x_4: any, out_5: uint8[]): void => {
                const patternInput: [any, any[]] = getUnionFields(x_4, t, true);
                const fields: any[] = patternInput[1];
                const case$: any = patternInput[0];
                const fieldTypes_1: any[] = map<any, any>((x_5: any): any => x_5[1], getUnionCaseFields(case$));
                writeUnion(out_5, case$.tag, fieldTypes_1, fields);
            })(x, out);
        }
        else if (isTuple(t)) {
            const fieldTypes_2: any[] = getTupleElements(t);
            cacheGetOrAdd(t, (x_6: any, out_6: uint8[]): void => {
                const out_8: uint8[] = out_6;
                const vals_2: any[] = getTupleFields(x_6);
                writeArrayHeader(vals_2.length, out_8);
                for (let i_1 = 0; i_1 <= (vals_2.length - 1); i_1++) {
                    writeObject(item(i_1, vals_2), item(i_1, fieldTypes_2), out_8);
                }
            })(x, out);
        }
        else if (isEnum(t)) {
            cacheGetOrAdd(t, (x_7: any, out_9: uint8[]): void => {
                writeInt64(toInt64(fromInt32(x_7 as int32)), out_9);
            })(x, out);
        }
        else if (isGenericType(t)) {
            const tDef: any = getGenericTypeDefinition(t);
            const genArgs: any[] = getGenerics(t);
            if (equals(tDef, list_type(obj_type))) {
                const elementType_1: any = head<any>(genArgs);
                cacheGetOrAdd(t, (x_8: any, out_10: uint8[]): void => {
                    writeArray(out_10, elementType_1, x_8 as Iterable);
                })(x, out);
            }
            else if (equals(tDef, option_type(obj_type))) {
                cacheGetOrAdd(t, (x_9: any, out_11: uint8[]): void => {
                    const opt: Option<any> = x_9 as Option<any>;
                    const patternInput_1: [int32, any[]] = (opt != null) ? ([1, [value_7(opt)]] as [int32, any[]]) : ([0, []] as [int32, any[]]);
                    const values: any[] = patternInput_1[1];
                    const tag: int32 = patternInput_1[0] | 0;
                    writeUnion(out_11, tag, genArgs, values);
                })(x, out);
            }
            else if (equals(tDef, class_type("System.Collections.Generic.Dictionary`2", [obj_type, obj_type])) ? true : equals(tDef, class_type("Microsoft.FSharp.Collections.FSharpMap`2", [obj_type, obj_type]))) {
                const keyType: any = item(0, genArgs);
                const valueType: any = item(1, genArgs);
                cacheGetOrAdd(t, (x_10: any, out_12: uint8[]): void => {
                    writeMap(out_12, keyType, valueType, x_10 as any);
                })(x, out);
            }
            else if (equals(tDef, class_type("Microsoft.FSharp.Collections.FSharpSet`1", [obj_type]))) {
                const elementType_2: any = head<any>(genArgs);
                cacheGetOrAdd(t, (x_11: any, out_13: uint8[]): void => {
                    writeSet(out_13, elementType_2, x_11 as Iterable);
                })(x, out);
            }
            else {
                const arg: string = name(t);
                toFail(printf("Cannot serialize %s."))(arg);
            }
        }
        else if (((fullName(t) === "Microsoft.FSharp.Core.int16`1") ? true : (fullName(t) === "Microsoft.FSharp.Core.int32`1")) ? true : (fullName(t) === "Microsoft.FSharp.Core.int64`1")) {
            cacheGetOrAdd(t, (x_12: any, out_14: uint8[]): void => {
                writeInt64(x_12 as int64, out_14);
            })(x, out);
        }
        else if (fullName(t) === "Microsoft.FSharp.Core.decimal`1") {
            cacheGetOrAdd(t, (x_13: any, out_15: uint8[]): void => {
                writeDecimal(x_13 as decimal, out_15);
            })(x, out);
        }
        else if (fullName(t) === "Microsoft.FSharp.Core.float`1") {
            cacheGetOrAdd(t, (x_14: any, out_16: uint8[]): void => {
                writeDouble(x_14 as float64, out_16);
            })(x, out);
        }
        else if (fullName(t) === "Microsoft.FSharp.Core.float32`1") {
            cacheGetOrAdd(t, (x_15: any, out_17: uint8[]): void => {
                writeSingle(x_15 as float32, out_17);
            })(x, out);
        }
        else {
            const arg_1: string = name(t);
            toFail(printf("Cannot serialize %s."))(arg_1);
        }
    }
}

addToDict(serializerCache, "System.Byte", (x: any, out: uint8[]): void => {
    writeByte(x as uint8, out);
});

addToDict(serializerCache, "System.SByte", (x: any, out: uint8[]): void => {
    let value: int8;
    writeByte((value = ((x as int8) | 0), value & 0xFF), out);
});

addToDict(serializerCache, "Microsoft.FSharp.Core.Unit", (_arg: any, out: uint8[]): void => {
    void (out.push(192));
});

addToDict(serializerCache, "System.Boolean", (x: any, out: uint8[]): void => {
    const x_1 = x as boolean;
    void (out.push(x_1 ? 195 : 194));
});

addToDict(serializerCache, "System.Char", (x: any, out: uint8[]): void => {
    let len: int32, n: uint32, b: uint8, value: uint32, b_1: uint8, value_1: uint32, b_2: uint8, value_2: uint32, b_3: uint8;
    const str = x as string;
    const out_1: uint8[] = out;
    const str_1: uint8[] = Array.from(get_UTF8().getBytes(str));
    if (str_1.length < 32) {
        void (out_1.push((len = (str_1.length | 0), 160 + (len & 0xFF))));
    }
    else {
        if (str_1.length < 256) {
            void (out_1.push(217));
        }
        else if (str_1.length < 65536) {
            void (out_1.push(218));
        }
        else {
            void (out_1.push(219));
        }
        ((n = (str_1.length >>> 0), (b = ((value = (n >>> 24), value & 0xFF)), (b_1 = ((value_1 = (n >>> 16), value_1 & 0xFF)), (b_2 = ((value_2 = (n >>> 8), value_2 & 0xFF)), (b_3 = (n & 0xFF), (writeFormat: boolean): void => {
            const b1: uint8 = b;
            const b2: uint8 = b_1;
            const b3: uint8 = b_2;
            const b4: uint8 = b_3;
            const out_3: uint8[] = out_1;
            const writeFormat_1: boolean = writeFormat;
            if ((b2 > 0) ? true : (b1 > 0)) {
                if (writeFormat_1) {
                    void (out_3.push(206));
                }
                void (out_3.push(b1));
                void (out_3.push(b2));
                void (out_3.push(b3));
                void (out_3.push(b4));
            }
            else if (b3 > 0) {
                if (writeFormat_1) {
                    void (out_3.push(205));
                }
                void (out_3.push(b3));
                void (out_3.push(b4));
            }
            else {
                if (writeFormat_1) {
                    void (out_3.push(204));
                }
                void (out_3.push(b4));
            }
        }))))))(false);
    }
    addRangeInPlace(str_1, out_1);
});

addToDict(serializerCache, "System.String", (x: any, out: uint8[]): void => {
    let len: int32, n: uint32, b: uint8, value: uint32, b_1: uint8, value_1: uint32, b_2: uint8, value_2: uint32, b_3: uint8;
    const str = x as string;
    const out_1: uint8[] = out;
    const str_1: uint8[] = Array.from(get_UTF8().getBytes(str));
    if (str_1.length < 32) {
        void (out_1.push((len = (str_1.length | 0), 160 + (len & 0xFF))));
    }
    else {
        if (str_1.length < 256) {
            void (out_1.push(217));
        }
        else if (str_1.length < 65536) {
            void (out_1.push(218));
        }
        else {
            void (out_1.push(219));
        }
        ((n = (str_1.length >>> 0), (b = ((value = (n >>> 24), value & 0xFF)), (b_1 = ((value_1 = (n >>> 16), value_1 & 0xFF)), (b_2 = ((value_2 = (n >>> 8), value_2 & 0xFF)), (b_3 = (n & 0xFF), (writeFormat: boolean): void => {
            const b1: uint8 = b;
            const b2: uint8 = b_1;
            const b3: uint8 = b_2;
            const b4: uint8 = b_3;
            const out_3: uint8[] = out_1;
            const writeFormat_1: boolean = writeFormat;
            if ((b2 > 0) ? true : (b1 > 0)) {
                if (writeFormat_1) {
                    void (out_3.push(206));
                }
                void (out_3.push(b1));
                void (out_3.push(b2));
                void (out_3.push(b3));
                void (out_3.push(b4));
            }
            else if (b3 > 0) {
                if (writeFormat_1) {
                    void (out_3.push(205));
                }
                void (out_3.push(b3));
                void (out_3.push(b4));
            }
            else {
                if (writeFormat_1) {
                    void (out_3.push(204));
                }
                void (out_3.push(b4));
            }
        }))))))(false);
    }
    addRangeInPlace(str_1, out_1);
});

addToDict(serializerCache, "System.Int32", (x: any, out: uint8[]): void => {
    writeInt64(toInt64(fromInt32(x as int32)), out);
});

addToDict(serializerCache, "System.Int16", (x: any, out: uint8[]): void => {
    writeInt64(toInt64(fromInt16(x as int16)), out);
});

addToDict(serializerCache, "System.Int64", (x: any, out: uint8[]): void => {
    writeInt64(x as int64, out);
});

addToDict(serializerCache, "System.UInt32", (x: any, out: uint8[]): void => {
    writeUInt64(toUInt64(fromUInt32(x as uint32)), out);
});

addToDict(serializerCache, "System.UInt16", (x: any, out: uint8[]): void => {
    writeUInt64(toUInt64(fromUInt16(x as uint16)), out);
});

addToDict(serializerCache, "System.UInt64", (x: any, out: uint8[]): void => {
    writeUInt64(x as uint64, out);
});

addToDict(serializerCache, "System.Single", (x: any, out: uint8[]): void => {
    writeSingle(x as float32, out);
});

addToDict(serializerCache, "System.Double", (x: any, out: uint8[]): void => {
    writeDouble(x as float64, out);
});

addToDict(serializerCache, "System.Decimal", (x: any, out: uint8[]): void => {
    writeDecimal(x as decimal, out);
});

addToDict(serializerCache, "System.Byte[]", (x: any, out: uint8[]): void => {
    writeBin(x as uint8[], out);
});

addToDict(serializerCache, "System.Numerics.BigInteger", (x: any, out: uint8[]): void => {
    writeBin(toByteArray(x as bigint), out);
});

addToDict(serializerCache, "System.Guid", (x: any, out: uint8[]): void => {
    writeBin(guidToArray(x as string), out);
});

addToDict(serializerCache, "System.DateTime", (x: any, out: uint8[]): void => {
    const out_1: uint8[] = out;
    const dto = x as Date;
    void (out_1.push(144 + 2));
    writeInt64(getTicks(dto), out_1);
    writeInt64(toInt64(fromInt32(kind(dto))), out_1);
});

addToDict(serializerCache, "System.DateTimeOffset", (x: any, out: uint8[]): void => {
    const out_1: uint8[] = out;
    const dto = x as Date;
    void (out_1.push(144 + 2));
    writeInt64(getTicks(dto), out_1);
    writeInt64(toInt64(fromFloat64(totalMinutes(offset(dto)))), out_1);
});

addToDict(serializerCache, "System.DateOnly", (x: any, out: uint8[]): void => {
    let n: uint32, b: uint8, value: uint32, b_1: uint8, value_1: uint32, b_2: uint8, value_2: uint32, b_3: uint8;
    const date = x as Date;
    ((n = (dayNumber(date) >>> 0), (b = ((value = (n >>> 24), value & 0xFF)), (b_1 = ((value_1 = (n >>> 16), value_1 & 0xFF)), (b_2 = ((value_2 = (n >>> 8), value_2 & 0xFF)), (b_3 = (n & 0xFF), (writeFormat: boolean): void => {
        const b1: uint8 = b;
        const b2: uint8 = b_1;
        const b3: uint8 = b_2;
        const b4: uint8 = b_3;
        const out_3: uint8[] = out;
        const writeFormat_1: boolean = writeFormat;
        if ((b2 > 0) ? true : (b1 > 0)) {
            if (writeFormat_1) {
                void (out_3.push(206));
            }
            void (out_3.push(b1));
            void (out_3.push(b2));
            void (out_3.push(b3));
            void (out_3.push(b4));
        }
        else if (b3 > 0) {
            if (writeFormat_1) {
                void (out_3.push(205));
            }
            void (out_3.push(b3));
            void (out_3.push(b4));
        }
        else {
            if (writeFormat_1) {
                void (out_3.push(204));
            }
            void (out_3.push(b4));
        }
    }))))))(true);
});

addToDict(serializerCache, "System.TimeOnly", (x: any, out: uint8[]): void => {
    writeUInt64(toUInt64(fromInt64(ticks(x as number))), out);
});

addToDict(serializerCache, "System.TimeSpan", (x: any, out: uint8[]): void => {
    writeInt64(ticks(x as number), out);
});

