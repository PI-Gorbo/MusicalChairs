import { Parsimmon_seq3, Parsimmon_seperateBy, Parsimmon_ofLazy, Parsimmon_optionalWhitespace, Parsimmon_between, Parsimmon_satisfy, Parsimmon_orTry, Parsimmon_many, Parsimmon_oneOf, Parsimmon_stringReturn, Parsimmon_choose, Parsimmon_str, Parsimmon_seq2, Parsimmon_map, IParser$1, Parsimmon_digit, Parsimmon_atLeastOneOrMany, Parsimmon_concat } from "../Fable.Parsimmon.4.0.0/Parsimmon.fs.js";
import { parse } from "../fable-library-ts.4.24.0/Double.js";
import { int32, float64 } from "../fable-library-ts.4.24.0/Int32.js";
import { regexp } from "../Fable.Parsimmon.4.0.0/Parsimmon.js";
import { map, ofArray } from "../fable-library-ts.4.24.0/List.js";
import { Json_JObject, Json_JArray, Json_JString, Json_JNull, Json_JBool, Json_$union, Json_JNumber } from "./Json.fs.js";
import { ofList } from "../fable-library-ts.4.24.0/Map.js";
import { Lazy, comparePrimitives } from "../fable-library-ts.4.24.0/Util.js";

export const digits: IParser$1<string> = Parsimmon_concat(Parsimmon_atLeastOneOrMany<string>(Parsimmon_digit));

export const jint: IParser$1<float64> = Parsimmon_map<string, float64>(parse, digits);

export const negJint: IParser$1<float64> = Parsimmon_map<[string, float64], float64>((tupledArg: [string, float64]): float64 => -tupledArg[1], Parsimmon_seq2<string, float64>(Parsimmon_str("-"), jint));

export const jfloat: IParser$1<float64> = Parsimmon_map<string, float64>(parse, Parsimmon_choose<string>(ofArray([regexp(new RegExp("-?(0|[1-9][0-9]*)?[.][0-9]+([eE][+-]?[0-9]+)?")), regexp(new RegExp("-?[1-9][0-9]*[eE][+-]?[0-9]+"))])));

export const jnumber: IParser$1<Json_$union> = Parsimmon_map<float64, Json_$union>(Json_JNumber, Parsimmon_choose<float64>(ofArray([jfloat, jint, negJint])));

export const jbool: IParser$1<Json_$union> = Parsimmon_choose<Json_$union>(ofArray([Parsimmon_stringReturn<Json_$union>("true", Json_JBool(true)), Parsimmon_stringReturn<Json_$union>("false", Json_JBool(false))]));

export const jnull: IParser$1<Json_$union> = Parsimmon_stringReturn<Json_$union>("null", Json_JNull());

export const stringLiteral: IParser$1<string> = (() => {
    const escape: IParser$1<string> = Parsimmon_map<string, string>((_arg: string): string => {
        switch (_arg) {
            case "b":
                return "\b";
            case "f":
                return "\f";
            case "n":
                return "\n";
            case "r":
                return "\r";
            case "t":
                return "\t";
            default:
                return _arg;
        }
    }, Parsimmon_oneOf("\"\\/bfnrt"));
    const anyCharSnippet: IParser$1<string> = Parsimmon_concat(Parsimmon_many<string>(Parsimmon_orTry<string>(Parsimmon_map<[string, string], string>((tuple: [string, string]): string => tuple[1], Parsimmon_seq2<string, string>(Parsimmon_str("\\"), escape)), Parsimmon_satisfy((c_1: string): boolean => ((c_1 !== "\"") && (c_1 !== "\\"))))));
    return Parsimmon_between<string, string, string>(Parsimmon_str("\""), Parsimmon_str("\""), anyCharSnippet);
})();

export const jstring: IParser$1<Json_$union> = stringLiteral.map<Json_$union>(Json_JString);

export function withWhitespace<$a>(p: IParser$1<$a>): IParser$1<$a> {
    return Parsimmon_between<string, string, $a>(Parsimmon_optionalWhitespace, Parsimmon_optionalWhitespace, p);
}

export const jvalue: IParser$1<Json_$union> = Parsimmon_choose<Json_$union>(map<IParser$1<Json_$union>, IParser$1<Json_$union>>(withWhitespace, ofArray([jnull, jbool, jnumber, jstring])));

export const comma: IParser$1<string> = withWhitespace<string>(Parsimmon_str(","));

export function json$004080(): IParser$1<Json_$union> {
    return Parsimmon_ofLazy<Json_$union>((): IParser$1<Json_$union> => Parsimmon_choose<Json_$union>(ofArray([jvalue, Parsimmon_map<Json_$union[], Json_$union>((arg: Json_$union[]): Json_$union => Json_JArray(ofArray<Json_$union>(arg)), Parsimmon_between<string, string, Json_$union[]>(withWhitespace<string>(Parsimmon_str("[")), withWhitespace<string>(Parsimmon_str("]")), Parsimmon_seperateBy<string, Json_$union>(comma, json$004080$002D1.Value))), Parsimmon_map<[string, Json_$union][], Json_$union>((arg_2: [string, Json_$union][]): Json_$union => Json_JObject(ofList<string, Json_$union>(ofArray<[string, Json_$union]>(arg_2), {
        Compare: comparePrimitives,
    })), Parsimmon_between<string, string, [string, Json_$union][]>(withWhitespace<string>(Parsimmon_str("{")), withWhitespace<string>(Parsimmon_str("}")), Parsimmon_seperateBy<string, [string, Json_$union]>(comma, Parsimmon_map<[string, string, Json_$union], [string, Json_$union]>((tupledArg: [string, string, Json_$union]): [string, Json_$union] => ([tupledArg[0], tupledArg[2]] as [string, Json_$union]), Parsimmon_seq3<string, string, Json_$union>(withWhitespace<string>(stringLiteral), withWhitespace<string>(Parsimmon_str(":")), withWhitespace<Json_$union>(json$004080$002D1.Value))))))])));
}

export const json$004080$002D1: any = new Lazy<IParser$1<Json_$union>>(json$004080);

export const json: IParser$1<Json_$union> = json$004080$002D1.Value;

export const jsonParser: IParser$1<Json_$union> = withWhitespace<Json_$union>(json);

