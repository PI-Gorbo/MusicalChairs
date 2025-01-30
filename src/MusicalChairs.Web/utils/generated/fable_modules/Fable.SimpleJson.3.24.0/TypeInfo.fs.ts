import { Union, Record } from "../fable-library-ts.4.24.0/Types.js";
import { union_type, tuple_type, lambda_type, unit_type, array_type, record_type, class_type, string_type, TypeInfo as TypeInfo_1 } from "../fable-library-ts.4.24.0/Reflection.js";

export class RecordField extends Record {
    readonly FieldName: string;
    readonly FieldType: TypeInfo_$union;
    readonly PropertyInfo: any;
    constructor(FieldName: string, FieldType: TypeInfo_$union, PropertyInfo: any) {
        super();
        this.FieldName = FieldName;
        this.FieldType = FieldType;
        this.PropertyInfo = PropertyInfo;
    }
}

export function RecordField_$reflection(): TypeInfo_1 {
    return record_type("Fable.SimpleJson.RecordField", [], RecordField, () => [["FieldName", string_type], ["FieldType", TypeInfo_$reflection()], ["PropertyInfo", class_type("System.Reflection.PropertyInfo")]]);
}

export class UnionCase extends Record {
    readonly CaseName: string;
    readonly CaseTypes: TypeInfo_$union[];
    readonly Info: any;
    constructor(CaseName: string, CaseTypes: TypeInfo_$union[], Info: any) {
        super();
        this.CaseName = CaseName;
        this.CaseTypes = CaseTypes;
        this.Info = Info;
    }
}

export function UnionCase_$reflection(): TypeInfo_1 {
    return record_type("Fable.SimpleJson.UnionCase", [], UnionCase, () => [["CaseName", string_type], ["CaseTypes", array_type(TypeInfo_$reflection())], ["Info", class_type("Microsoft.FSharp.Reflection.UnionCaseInfo")]]);
}

export type TypeInfo_$union = 
    | TypeInfo<0>
    | TypeInfo<1>
    | TypeInfo<2>
    | TypeInfo<3>
    | TypeInfo<4>
    | TypeInfo<5>
    | TypeInfo<6>
    | TypeInfo<7>
    | TypeInfo<8>
    | TypeInfo<9>
    | TypeInfo<10>
    | TypeInfo<11>
    | TypeInfo<12>
    | TypeInfo<13>
    | TypeInfo<14>
    | TypeInfo<15>
    | TypeInfo<16>
    | TypeInfo<17>
    | TypeInfo<18>
    | TypeInfo<19>
    | TypeInfo<20>
    | TypeInfo<21>
    | TypeInfo<22>
    | TypeInfo<23>
    | TypeInfo<24>
    | TypeInfo<25>
    | TypeInfo<26>
    | TypeInfo<27>
    | TypeInfo<28>
    | TypeInfo<29>
    | TypeInfo<30>
    | TypeInfo<31>
    | TypeInfo<32>
    | TypeInfo<33>
    | TypeInfo<34>
    | TypeInfo<35>
    | TypeInfo<36>
    | TypeInfo<37>
    | TypeInfo<38>
    | TypeInfo<39>
    | TypeInfo<40>

export type TypeInfo_$cases = {
    0: ["Unit", []],
    1: ["Char", []],
    2: ["String", []],
    3: ["UInt16", []],
    4: ["UInt32", []],
    5: ["UInt64", []],
    6: ["Int32", []],
    7: ["Bool", []],
    8: ["Float32", []],
    9: ["Float", []],
    10: ["Decimal", []],
    11: ["Short", []],
    12: ["Long", []],
    13: ["Byte", []],
    14: ["SByte", []],
    15: ["DateTime", []],
    16: ["DateTimeOffset", []],
    17: ["DateOnly", []],
    18: ["TimeOnly", []],
    19: ["BigInt", []],
    20: ["TimeSpan", []],
    21: ["Guid", []],
    22: ["Uri", []],
    23: ["Object", []],
    24: ["Any", [(() => any)]],
    25: ["Async", [(() => TypeInfo_$union)]],
    26: ["Promise", [(() => TypeInfo_$union)]],
    27: ["Option", [(() => TypeInfo_$union)]],
    28: ["List", [(() => TypeInfo_$union)]],
    29: ["Set", [(() => TypeInfo_$union)]],
    30: ["Array", [(() => TypeInfo_$union)]],
    31: ["Seq", [(() => TypeInfo_$union)]],
    32: ["Tuple", [(() => TypeInfo_$union[])]],
    33: ["Map", [(() => [TypeInfo_$union, TypeInfo_$union])]],
    34: ["Dictionary", [(() => [TypeInfo_$union, TypeInfo_$union, any])]],
    35: ["ResizeArray", [(() => TypeInfo_$union)]],
    36: ["HashSet", [(() => TypeInfo_$union)]],
    37: ["Func", [(() => TypeInfo_$union[])]],
    38: ["Enum", [(() => [TypeInfo_$union, any])]],
    39: ["Record", [(() => [RecordField[], any])]],
    40: ["Union", [(() => [UnionCase[], any])]]
}

export function TypeInfo_Unit() {
    return new TypeInfo<0>(0, []);
}

export function TypeInfo_Char() {
    return new TypeInfo<1>(1, []);
}

export function TypeInfo_String() {
    return new TypeInfo<2>(2, []);
}

export function TypeInfo_UInt16() {
    return new TypeInfo<3>(3, []);
}

export function TypeInfo_UInt32() {
    return new TypeInfo<4>(4, []);
}

export function TypeInfo_UInt64() {
    return new TypeInfo<5>(5, []);
}

export function TypeInfo_Int32() {
    return new TypeInfo<6>(6, []);
}

export function TypeInfo_Bool() {
    return new TypeInfo<7>(7, []);
}

export function TypeInfo_Float32() {
    return new TypeInfo<8>(8, []);
}

export function TypeInfo_Float() {
    return new TypeInfo<9>(9, []);
}

export function TypeInfo_Decimal() {
    return new TypeInfo<10>(10, []);
}

export function TypeInfo_Short() {
    return new TypeInfo<11>(11, []);
}

export function TypeInfo_Long() {
    return new TypeInfo<12>(12, []);
}

export function TypeInfo_Byte() {
    return new TypeInfo<13>(13, []);
}

export function TypeInfo_SByte() {
    return new TypeInfo<14>(14, []);
}

export function TypeInfo_DateTime() {
    return new TypeInfo<15>(15, []);
}

export function TypeInfo_DateTimeOffset() {
    return new TypeInfo<16>(16, []);
}

export function TypeInfo_DateOnly() {
    return new TypeInfo<17>(17, []);
}

export function TypeInfo_TimeOnly() {
    return new TypeInfo<18>(18, []);
}

export function TypeInfo_BigInt() {
    return new TypeInfo<19>(19, []);
}

export function TypeInfo_TimeSpan() {
    return new TypeInfo<20>(20, []);
}

export function TypeInfo_Guid() {
    return new TypeInfo<21>(21, []);
}

export function TypeInfo_Uri() {
    return new TypeInfo<22>(22, []);
}

export function TypeInfo_Object() {
    return new TypeInfo<23>(23, []);
}

export function TypeInfo_Any(Item: (() => any)) {
    return new TypeInfo<24>(24, [Item]);
}

export function TypeInfo_Async(Item: (() => TypeInfo_$union)) {
    return new TypeInfo<25>(25, [Item]);
}

export function TypeInfo_Promise(Item: (() => TypeInfo_$union)) {
    return new TypeInfo<26>(26, [Item]);
}

export function TypeInfo_Option(Item: (() => TypeInfo_$union)) {
    return new TypeInfo<27>(27, [Item]);
}

export function TypeInfo_List(Item: (() => TypeInfo_$union)) {
    return new TypeInfo<28>(28, [Item]);
}

export function TypeInfo_Set(Item: (() => TypeInfo_$union)) {
    return new TypeInfo<29>(29, [Item]);
}

export function TypeInfo_Array(Item: (() => TypeInfo_$union)) {
    return new TypeInfo<30>(30, [Item]);
}

export function TypeInfo_Seq(Item: (() => TypeInfo_$union)) {
    return new TypeInfo<31>(31, [Item]);
}

export function TypeInfo_Tuple(Item: (() => TypeInfo_$union[])) {
    return new TypeInfo<32>(32, [Item]);
}

export function TypeInfo_Map(Item: (() => [TypeInfo_$union, TypeInfo_$union])) {
    return new TypeInfo<33>(33, [Item]);
}

export function TypeInfo_Dictionary(Item: (() => [TypeInfo_$union, TypeInfo_$union, any])) {
    return new TypeInfo<34>(34, [Item]);
}

export function TypeInfo_ResizeArray(Item: (() => TypeInfo_$union)) {
    return new TypeInfo<35>(35, [Item]);
}

export function TypeInfo_HashSet(Item: (() => TypeInfo_$union)) {
    return new TypeInfo<36>(36, [Item]);
}

export function TypeInfo_Func(Item: (() => TypeInfo_$union[])) {
    return new TypeInfo<37>(37, [Item]);
}

export function TypeInfo_Enum(Item: (() => [TypeInfo_$union, any])) {
    return new TypeInfo<38>(38, [Item]);
}

export function TypeInfo_Record(Item: (() => [RecordField[], any])) {
    return new TypeInfo<39>(39, [Item]);
}

export function TypeInfo_Union(Item: (() => [UnionCase[], any])) {
    return new TypeInfo<40>(40, [Item]);
}

export class TypeInfo<Tag extends keyof TypeInfo_$cases> extends Union<Tag, TypeInfo_$cases[Tag][0]> {
    constructor(readonly tag: Tag, readonly fields: TypeInfo_$cases[Tag][1]) {
        super();
    }
    cases() {
        return ["Unit", "Char", "String", "UInt16", "UInt32", "UInt64", "Int32", "Bool", "Float32", "Float", "Decimal", "Short", "Long", "Byte", "SByte", "DateTime", "DateTimeOffset", "DateOnly", "TimeOnly", "BigInt", "TimeSpan", "Guid", "Uri", "Object", "Any", "Async", "Promise", "Option", "List", "Set", "Array", "Seq", "Tuple", "Map", "Dictionary", "ResizeArray", "HashSet", "Func", "Enum", "Record", "Union"];
    }
}

export function TypeInfo_$reflection(): TypeInfo_1 {
    return union_type("Fable.SimpleJson.TypeInfo", [], TypeInfo, () => [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [["Item", lambda_type(unit_type, class_type("System.Type"))]], [["Item", lambda_type(unit_type, TypeInfo_$reflection())]], [["Item", lambda_type(unit_type, TypeInfo_$reflection())]], [["Item", lambda_type(unit_type, TypeInfo_$reflection())]], [["Item", lambda_type(unit_type, TypeInfo_$reflection())]], [["Item", lambda_type(unit_type, TypeInfo_$reflection())]], [["Item", lambda_type(unit_type, TypeInfo_$reflection())]], [["Item", lambda_type(unit_type, TypeInfo_$reflection())]], [["Item", lambda_type(unit_type, array_type(TypeInfo_$reflection()))]], [["Item", lambda_type(unit_type, tuple_type(TypeInfo_$reflection(), TypeInfo_$reflection()))]], [["Item", lambda_type(unit_type, tuple_type(TypeInfo_$reflection(), TypeInfo_$reflection(), class_type("System.Type")))]], [["Item", lambda_type(unit_type, TypeInfo_$reflection())]], [["Item", lambda_type(unit_type, TypeInfo_$reflection())]], [["Item", lambda_type(unit_type, array_type(TypeInfo_$reflection()))]], [["Item", lambda_type(unit_type, tuple_type(TypeInfo_$reflection(), class_type("System.Type")))]], [["Item", lambda_type(unit_type, tuple_type(array_type(RecordField_$reflection()), class_type("System.Type")))]], [["Item", lambda_type(unit_type, tuple_type(array_type(UnionCase_$reflection()), class_type("System.Type")))]]]);
}

