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
    const serializer = (response: uint8[], returnType: any): any => Reader__Read_24524716(Reader_$ctor_Z3F6BC7B1(response), returnType);
    return new RemoteBuilderOptions(options.CustomHeaders, options.BaseUrl, options.Authorization, options.WithCredentials, options.RouteBuilder, serializer);
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
        const getFields: (() => [RecordField[], any]) = schemaType.fields[0];
        const patternInput: [RecordField[], any] = getFields();
        const recordType: any = patternInput[1];
        const fields: RecordField[] = patternInput[0];
        const fieldTypes: [string, any][] = map<any, [string, any]>((prop: any): [string, any] => ([name_1(prop), prop[1]] as [string, any]), getRecordElements(recordType));
        const recordFields: any[] = toArray<any>(delay<any>((): Iterable<any> => collect<RecordField, Iterable<any>, any>((field: RecordField): Iterable<any> => {
            const normalize = (n: int32): any => {
                const fieldType: any = pick<[string, any], any>((tupledArg: [string, any]): Option<any> => {
                    const name: string = tupledArg[0];
                    const typ: any = tupledArg[1];
                    if (name === field.FieldName) {
                        return typ;
                    }
                    else {
                        return undefined;
                    }
                }, fieldTypes);
                const fn: ((arg0: any) => ((arg0: any) => ((arg0: any) => ((arg0: any) => ((arg0: any) => ((arg0: any) => ((arg0: any) => ((arg0: any) => Async<any>)))))))) = Proxy_proxyFetch<any, any, any, any, any, any, any, any>(options, name_1(recordType), field, fieldType);
                switch (n) {
                    case 0:
                        return fn(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf());
                    case 1:
                        return (a: any): Async<any> => fn(a)(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf());
                    case 2: {
                        const proxyF = (a_1: any, b: any): Async<any> => fn(a_1)(b)(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf());
                        return proxyF;
                    }
                    case 3: {
                        const proxyF_1 = (a_2: any, b_1: any, c: any): Async<any> => fn(a_2)(b_1)(c)(defaultOf())(defaultOf())(defaultOf())(defaultOf())(defaultOf());
                        return proxyF_1;
                    }
                    case 4: {
                        const proxyF_2 = (a_3: any, b_2: any, c_1: any, d: any): Async<any> => fn(a_3)(b_2)(c_1)(d)(defaultOf())(defaultOf())(defaultOf())(defaultOf());
                        return proxyF_2;
                    }
                    case 5: {
                        const proxyF_3 = (a_4: any, b_3: any, c_2: any, d_1: any, e: any): Async<any> => fn(a_4)(b_3)(c_2)(d_1)(e)(defaultOf())(defaultOf())(defaultOf());
                        return proxyF_3;
                    }
                    case 6: {
                        const proxyF_4 = (a_5: any, b_4: any, c_3: any, d_2: any, e_1: any, f: any): Async<any> => fn(a_5)(b_4)(c_3)(d_2)(e_1)(f)(defaultOf())(defaultOf());
                        return proxyF_4;
                    }
                    case 7: {
                        const proxyF_5 = (a_6: any, b_5: any, c_4: any, d_3: any, e_2: any, f_1: any, g: any): Async<any> => fn(a_6)(b_5)(c_4)(d_3)(e_2)(f_1)(g)(defaultOf());
                        return proxyF_5;
                    }
                    case 8: {
                        const proxyF_6 = (a_7: any, b_6: any, c_5: any, d_4: any, e_3: any, f_2: any, g_1: any, h: any): Async<any> => fn(a_7)(b_6)(c_5)(d_4)(e_3)(f_2)(g_1)(h);
                        return proxyF_6;
                    }
                    default:
                        return toFail(printf("Cannot generate proxy function for %s. Only up to 8 arguments are supported. Consider using a record type as input"))(field.FieldName);
                }
            };
            let argumentCount: int32;
            const matchValue: TypeInfo_$union = field.FieldType;
            switch (matchValue.tag) {
                case /* Async */ 25: {
                    argumentCount = 0;
                    break;
                }
                case /* Promise */ 26: {
                    argumentCount = 0;
                    break;
                }
                case /* Func */ 37: {
                    const getArgs: (() => TypeInfo_$union[]) = matchValue.fields[0];
                    argumentCount = (getArgs().length - 1);
                    break;
                }
                default:
                    argumentCount = 0;
            }
            return singleton<any>(normalize(argumentCount));
        }, fields)));
        const proxy: any = makeRecord(recordType, recordFields);
        return proxy;
    }
    else {
        const arg_1: string = fullName(resolvedType);
        return toFail(printf("Cannot build proxy. Exepected type %s to be a valid protocol definition which is a record of functions"))(arg_1);
    }
}

