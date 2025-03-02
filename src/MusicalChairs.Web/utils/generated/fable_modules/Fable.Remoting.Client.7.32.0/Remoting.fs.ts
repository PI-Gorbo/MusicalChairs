import { FSharpList, empty } from "../fable-library-ts.4.24.0/List.js";
import { defaultOf, uncurry2 } from "../fable-library-ts.4.24.0/Util.js";
import { toFail, printf, toText } from "../fable-library-ts.4.24.0/String.js";
import { RemoteBuilderOptions } from "./Types.fs.js";
import { Reader_$ctor_Z3F6BC7B1, Reader__Read_24524716 } from "../Fable.Remoting.MsgPack.1.24.0/Read.fs.js";
import { int32, uint8 } from "../fable-library-ts.4.24.0/Int32.js";
import { fullName, makeRecord, getRecordElements, name as name_1, class_type, TypeInfo } from "../fable-library-ts.4.24.0/Reflection.js";
import { createTypeInfo } from "../Fable.SimpleJson.3.24.0/TypeInfo.Converter.fs.js";
import { RecordField, TypeInfo_$union } from "../Fable.SimpleJson.3.24.0/TypeInfo.fs.js";
import { pick, map } from "../fable-library-ts.4.24.0/Array.js";
import { singleton, collect, delay, toArray } from "../fable-library-ts.4.24.0/Seq.js";
import { Option } from "../fable-library-ts.4.24.0/Option.js";
import { Proxy_proxyFetch } from "./Proxy.fs.js";
import { Async } from "../fable-library-ts.4.24.0/AsyncBuilder.js";

/**
 * Starts with default configuration for building a proxy
 */
export function RemotingModule_createApi(): RemoteBuilderOptions {
    let clo: ((arg0: string) => ((arg0: string) => string));
    return new RemoteBuilderOptions(empty<[string, string]>(), undefined, undefined, false, uncurry2((clo = toText(printf("/%s/%s")), (arg: string): ((arg0: string) => string) => {
        const clo_1: ((arg0: string) => string) = clo(arg);
        return clo_1;
    })), undefined);
}

/**
 * Defines how routes are built using the type name and method name. By default, the generated routes are of the form `/typeName/methodName`.
 */
export function RemotingModule_withRouteBuilder(builder: ((arg0: string, arg1: string) => string), options: RemoteBuilderOptions): RemoteBuilderOptions {
    return new RemoteBuilderOptions(options.CustomHeaders, options.BaseUrl, options.Authorization, options.WithCredentials, builder, options.CustomResponseSerialization);
}

/**
 * Sets the base url for the request. Useful if you are making cross-domain requests
 */
export function RemotingModule_withBaseUrl(url: string, options: RemoteBuilderOptions): RemoteBuilderOptions {
    return new RemoteBuilderOptions(options.CustomHeaders, url, options.Authorization, options.WithCredentials, options.RouteBuilder, options.CustomResponseSerialization);
}

/**
 * Adds custom headers to each request of the proxy
 */
export function RemotingModule_withCustomHeader(headers: FSharpList<[string, string]>, options: RemoteBuilderOptions): RemoteBuilderOptions {
    return new RemoteBuilderOptions(headers, options.BaseUrl, options.Authorization, options.WithCredentials, options.RouteBuilder, options.CustomResponseSerialization);
}

/**
 * Sets the authorization header of every request from the proxy
 */
export function RemotingModule_withAuthorizationHeader(token: string, options: RemoteBuilderOptions): RemoteBuilderOptions {
    return new RemoteBuilderOptions(options.CustomHeaders, options.BaseUrl, token, options.WithCredentials, options.RouteBuilder, options.CustomResponseSerialization);
}

/**
 * Sets the withCredentials option on the XHR request, which is useful for CORS scenarios
 */
export function RemotingModule_withCredentials(withCredentials: boolean, options: RemoteBuilderOptions): RemoteBuilderOptions {
    return new RemoteBuilderOptions(options.CustomHeaders, options.BaseUrl, options.Authorization, withCredentials, options.RouteBuilder, options.CustomResponseSerialization);
}

/**
 * Specifies that the API uses binary serialization for responses
 */
export function RemotingModule_withBinarySerialization(options: RemoteBuilderOptions): RemoteBuilderOptions {
    return new RemoteBuilderOptions(options.CustomHeaders, options.BaseUrl, options.Authorization, options.WithCredentials, options.RouteBuilder, (response: uint8[], returnType: any): any => Reader__Read_24524716(Reader_$ctor_Z3F6BC7B1(response), returnType));
}

export class Remoting {
    constructor() {
    }
}

export function Remoting_$reflection(): TypeInfo {
    return class_type("Fable.Remoting.Client.Remoting", undefined, Remoting);
}

export function Remoting_$ctor(): Remoting {
    return new Remoting();
}

/**
 * For internal library use only.
 */
export function Remoting_buildProxy_64DC51C<$a>(options: RemoteBuilderOptions, resolvedType: any): $a {
    const schemaType: TypeInfo_$union = createTypeInfo(resolvedType);
    if (schemaType.tag === /* Record */ 39) {
        const patternInput: [RecordField[], any] = schemaType.fields[0]();
        const recordType: any = patternInput[1];
        const fieldTypes: [string, any][] = map<any, [string, any]>((prop: any): [string, any] => ([name_1(prop), prop[1]] as [string, any]), getRecordElements(recordType));
        return makeRecord(recordType, toArray<any>(delay<any>((): Iterable<any> => collect<RecordField, Iterable<any>, any>((field: RecordField): Iterable<any> => {
            let n: int32, matchValue: TypeInfo_$union, getArgs: (() => TypeInfo_$union[]), fieldType: any, fn: ((arg0: any) => ((arg0: any) => ((arg0: any) => ((arg0: any) => ((arg0: any) => ((arg0: any) => ((arg0: any) => ((arg0: any) => Async<any>))))))));
            return singleton<any>((n = (((matchValue = field.FieldType, (matchValue.tag === /* Async */ 25) ? 0 : ((matchValue.tag === /* Promise */ 26) ? 0 : ((matchValue.tag === /* Func */ 37) ? ((getArgs = matchValue.fields[0], getArgs().length - 1)) : 0)))) | 0), (fieldType = pick<[string, any], any>((tupledArg: [string, any]): Option<any> => {
                if (tupledArg[0] === field.FieldName) {
                    return tupledArg[1];
                }
                else {
                    return undefined;
                }
            }, fieldTypes), (fn = Proxy_proxyFetch<any, any, any, any, any, any, any, any>(options, name_1(recordType), field, fieldType), (n === 0) ? fn(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf()) : ((n === 1) ? ((a: any): Async<any> => fn(a)(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())) : ((n === 2) ? ((delegateArg: any, delegateArg_1: any): Async<any> => fn(delegateArg)(delegateArg_1)(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())) : ((n === 3) ? ((delegateArg_2: any, delegateArg_3: any, delegateArg_4: any): Async<any> => fn(delegateArg_2)(delegateArg_3)(delegateArg_4)(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())) : ((n === 4) ? ((delegateArg_5: any, delegateArg_6: any, delegateArg_7: any, delegateArg_8: any): Async<any> => fn(delegateArg_5)(delegateArg_6)(delegateArg_7)(delegateArg_8)(defaultOf())(defaultOf())(defaultOf())(defaultOf())) : ((n === 5) ? ((delegateArg_9: any, delegateArg_10: any, delegateArg_11: any, delegateArg_12: any, delegateArg_13: any): Async<any> => fn(delegateArg_9)(delegateArg_10)(delegateArg_11)(delegateArg_12)(delegateArg_13)(defaultOf())(defaultOf())(defaultOf())) : ((n === 6) ? ((delegateArg_14: any, delegateArg_15: any, delegateArg_16: any, delegateArg_17: any, delegateArg_18: any, delegateArg_19: any): Async<any> => fn(delegateArg_14)(delegateArg_15)(delegateArg_16)(delegateArg_17)(delegateArg_18)(delegateArg_19)(defaultOf())(defaultOf())) : ((n === 7) ? ((delegateArg_20: any, delegateArg_21: any, delegateArg_22: any, delegateArg_23: any, delegateArg_24: any, delegateArg_25: any, delegateArg_26: any): Async<any> => fn(delegateArg_20)(delegateArg_21)(delegateArg_22)(delegateArg_23)(delegateArg_24)(delegateArg_25)(delegateArg_26)(defaultOf())) : ((n === 8) ? ((delegateArg_27: any, delegateArg_28: any, delegateArg_29: any, delegateArg_30: any, delegateArg_31: any, delegateArg_32: any, delegateArg_33: any, delegateArg_34: any): Async<any> => fn(delegateArg_27)(delegateArg_28)(delegateArg_29)(delegateArg_30)(delegateArg_31)(delegateArg_32)(delegateArg_33)(delegateArg_34)) : toFail(printf("Cannot generate proxy function for %s. Only up to 8 arguments are supported. Consider using a record type as input"))(field.FieldName)))))))))))));
        }, patternInput[0]))));
    }
    else {
        const arg_1: string = fullName(resolvedType);
        return toFail(printf("Cannot build proxy. Exepected type %s to be a valid protocol definition which is a record of functions"))(arg_1);
    }
}

