import { fromContinuations } from "../fable-library-ts.4.24.0/Async.js";
import { singleton as singleton_1, Async } from "../fable-library-ts.4.24.0/AsyncBuilder.js";
import { toFail, printf, toText, trimEnd } from "../fable-library-ts.4.24.0/String.js";
import { defaultArg, map, Option, value as value_2 } from "../fable-library-ts.4.24.0/Option.js";
import { RecordField, TypeInfo_Array, TypeInfo_Tuple, TypeInfo_$union } from "../Fable.SimpleJson.3.24.0/TypeInfo.fs.js";
import { fullName, getGenerics, isGenericType, getFunctionElements, isFunction } from "../fable-library-ts.4.24.0/Reflection.js";
import { tryHead, take, item, equalsWith, last, head } from "../fable-library-ts.4.24.0/Array.js";
import { uint8, int32 } from "../fable-library-ts.4.24.0/Int32.js";
import { curry2, defaultOf, equals } from "../fable-library-ts.4.24.0/Util.js";
import { empty, singleton, append, delay, toList } from "../fable-library-ts.4.24.0/Seq.js";
import { FSharpList } from "../fable-library-ts.4.24.0/List.js";
import { RemoteBuilderOptions, RequestBody_Json, RequestBody_Binary, ProxyRequestException_$ctor_76BC5104, HttpResponse, RequestBody_$union } from "./Types.fs.js";
import { send, get$, post, withBody, withHeaders, withCredentials as withCredentials_4, sendAndReadBinary } from "./Http.fs.js";
import { createTypeInfo } from "../Fable.SimpleJson.3.24.0/TypeInfo.Converter.fs.js";
import { SimpleJson_parseNative } from "../Fable.SimpleJson.3.24.0/SimpleJson.fs.js";
import { Json_$union } from "../Fable.SimpleJson.3.24.0/Json.fs.js";
import { Convert_serialize, Convert_arrayLike, Convert_fromJsonAs } from "../Fable.SimpleJson.3.24.0/Json.Converter.fs.js";

/**
 * Asynchronously reads the blob data content as string
 */
export function Blob_readBlobAsText(blob: any): Async<string> {
    return fromContinuations<string>((tupledArg: [((arg0: string) => void), ((arg0: Error) => void), ((arg0: any) => void)]): void => {
        const reader: any = new FileReader();
        reader.onload = ((_arg_2: any): void => {
            if (reader.readyState === 2) {
                tupledArg[0](reader.result);
            }
        });
        reader.readAsText(blob);
    });
}

export function Proxy_combineRouteWithBaseUrl(route: string, baseUrl: Option<string>): string {
    if (baseUrl != null) {
        const arg: string = trimEnd(value_2(baseUrl), "/");
        return toText(printf("%s%s"))(arg)(route);
    }
    else {
        return route;
    }
}

export function Proxy_isByteArray(_arg: TypeInfo_$union): boolean {
    if (_arg.tag === /* Array */ 30) {
        if (_arg.fields[0]().tag === /* Byte */ 13) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

export function Proxy_isAsyncOfByteArray(_arg: TypeInfo_$union): boolean {
    if (_arg.tag === /* Async */ 25) {
        const matchValue: TypeInfo_$union = _arg.fields[0]();
        if (matchValue.tag === /* Array */ 30) {
            if (matchValue.fields[0]().tag === /* Byte */ 13) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

export function Proxy_getReturnType(typ_mut: any): any {
    Proxy_getReturnType:
    while (true) {
        const typ: any = typ_mut;
        if (isFunction(typ)) {
            typ_mut = getFunctionElements(typ)[1];
            continue Proxy_getReturnType;
        }
        else if (isGenericType(typ)) {
            return head<any>(getGenerics(typ));
        }
        else {
            return typ;
        }
        break;
    }
}

export function Proxy_proxyFetch<$a, $b, $c, $d, $e, $f, $g, $h>(options: RemoteBuilderOptions, typeName: string, func: RecordField, fieldType: any): ((arg0: $a) => ((arg0: $b) => ((arg0: $c) => ((arg0: $d) => ((arg0: $e) => ((arg0: $f) => ((arg0: $g) => ((arg0: $h) => Async<any>)))))))) {
    let funcArgs: TypeInfo_$union[];
    const matchValue: TypeInfo_$union = func.FieldType;
    switch (matchValue.tag) {
        case /* Async */ 25: {
            const inner: (() => TypeInfo_$union) = matchValue.fields[0];
            funcArgs = [func.FieldType];
            break;
        }
        case /* Promise */ 26: {
            const inner_1: (() => TypeInfo_$union) = matchValue.fields[0];
            funcArgs = [func.FieldType];
            break;
        }
        case /* Func */ 37: {
            funcArgs = matchValue.fields[0]();
            break;
        }
        default:
            funcArgs = toFail(printf("Field %s does not have a valid definiton"))(func.FieldName);
    }
    const argumentCount: int32 = (funcArgs.length - 1) | 0;
    const returnTypeAsync: TypeInfo_$union = last<TypeInfo_$union>(funcArgs);
    let binaryInput: boolean;
    const matchValue_1: TypeInfo_$union = func.FieldType;
    if (matchValue_1.tag === /* Func */ 37) {
        const matchValue_2: TypeInfo_$union[] = matchValue_1.fields[0]();
        if (!equalsWith(equals, matchValue_2, defaultOf()) && (matchValue_2.length === 2)) {
            const output: TypeInfo_$union = item(1, matchValue_2);
            binaryInput = Proxy_isByteArray(item(0, matchValue_2));
        }
        else {
            binaryInput = false;
        }
    }
    else {
        binaryInput = false;
    }
    const url: string = Proxy_combineRouteWithBaseUrl(options.RouteBuilder(typeName, func.FieldName), options.BaseUrl);
    const funcNeedParameters: boolean = (!equalsWith(equals, funcArgs, defaultOf()) && (funcArgs.length === 1)) ? ((item(0, funcArgs).tag === /* Async */ 25) ? false : (!(item(0, funcArgs).tag === /* Promise */ 26))) : ((!equalsWith(equals, funcArgs, defaultOf()) && (funcArgs.length === 2)) ? ((item(0, funcArgs).tag === /* Unit */ 0) ? (!(item(1, funcArgs).tag === /* Async */ 25)) : true) : true);
    const contentType: string = binaryInput ? "application/octet-stream" : "application/json; charset=utf-8";
    const inputArgumentTypes: TypeInfo_$union[] = take<TypeInfo_$union>(argumentCount, funcArgs);
    const headers: FSharpList<[string, string]> = toList<[string, string]>(delay<[string, string]>((): Iterable<[string, string]> => append<[string, string]>(singleton<[string, string]>(["Content-Type", contentType] as [string, string]), delay<[string, string]>((): Iterable<[string, string]> => append<[string, string]>(singleton<[string, string]>(["x-remoting-proxy", "true"] as [string, string]), delay<[string, string]>((): Iterable<[string, string]> => append<[string, string]>(options.CustomHeaders, delay<[string, string]>((): Iterable<[string, string]> => {
        const matchValue_3: Option<string> = options.Authorization;
        if (matchValue_3 == null) {
            return empty<[string, string]>();
        }
        else {
            return singleton<[string, string]>(["Authorization", value_2(matchValue_3)] as [string, string]);
        }
    }))))))));
    let executeRequest: ((arg0: RequestBody_$union) => Async<any>);
    if ((options.CustomResponseSerialization != null) ? true : Proxy_isAsyncOfByteArray(returnTypeAsync)) {
        let onOk: ((arg0: uint8[]) => any);
        const matchValue_4: Option<((arg0: uint8[], arg1: any) => any)> = options.CustomResponseSerialization;
        if (matchValue_4 != null) {
            const serializer: ((arg0: uint8[]) => ((arg0: any) => any)) = value_2(map(curry2, matchValue_4));
            const returnType: any = Proxy_getReturnType(fieldType);
            onOk = ((response: uint8[]): any => serializer(response)(returnType));
        }
        else {
            onOk = ((value: uint8[]): any => value);
        }
        executeRequest = ((requestBody: RequestBody_$union): Async<any> => singleton_1.Delay<any>((): Async<any> => singleton_1.Bind<[uint8[], int32], any>(funcNeedParameters ? sendAndReadBinary(withCredentials_4(options.WithCredentials, withHeaders(headers, withBody(requestBody, post(url))))) : sendAndReadBinary(withCredentials_4(options.WithCredentials, withHeaders(headers, get$(url)))), (_arg: [uint8[], int32]): Async<any> => {
            const statusCode: int32 = _arg[1] | 0;
            const response_1: uint8[] = _arg[0];
            if (statusCode === 200) {
                return singleton_1.Return<any>(onOk(response_1));
            }
            else {
                const n: int32 = statusCode | 0;
                const responseAsBlob: any = new Blob([response_1.buffer], { type: 'text/plain' });
                return singleton_1.Bind<string, any>(Blob_readBlobAsText(responseAsBlob), (_arg_1: string): Async<any> => {
                    const response_2: HttpResponse = new HttpResponse(statusCode, _arg_1);
                    const errorMsg: string = (n === 500) ? toText(printf("Internal server error (500) while making request to %s"))(url) : toText(printf("Http error (%d) while making request to %s"))(n)(url);
                    return singleton_1.ReturnFrom<any>((() => {
                        throw ProxyRequestException_$ctor_76BC5104(response_2, errorMsg, response_2.ResponseBody);
                    })());
                });
            }
        })));
    }
    else {
        let returnType_1: TypeInfo_$union;
        switch (returnTypeAsync.tag) {
            case /* Async */ 25: {
                returnType_1 = returnTypeAsync.fields[0]();
                break;
            }
            case /* Promise */ 26: {
                returnType_1 = returnTypeAsync.fields[0]();
                break;
            }
            case /* Any */ 24: {
                const t: any = returnTypeAsync.fields[0]();
                returnType_1 = (fullName(t).startsWith("System.Threading.Tasks.Task`1") ? createTypeInfo(item(0, getGenerics(t))) : toFail(printf("Expected field %s to have a return type of Async<\'t> or Task<\'t>"))(func.FieldName));
                break;
            }
            default:
                returnType_1 = toFail(printf("Expected field %s to have a return type of Async<\'t> or Task<\'t>"))(func.FieldName);
        }
        executeRequest = ((requestBody_1: RequestBody_$union): Async<any> => singleton_1.Delay<any>((): Async<any> => singleton_1.Bind<HttpResponse, any>(funcNeedParameters ? send(withCredentials_4(options.WithCredentials, withHeaders(headers, withBody(requestBody_1, post(url))))) : send(withCredentials_4(options.WithCredentials, withHeaders(headers, get$(url)))), (_arg_2: HttpResponse): Async<any> => {
            const response_3: HttpResponse = _arg_2;
            const matchValue_5: int32 = response_3.StatusCode | 0;
            switch (matchValue_5) {
                case 200: {
                    const parsedJson: Json_$union = SimpleJson_parseNative(response_3.ResponseBody);
                    return singleton_1.Return<any>(Convert_fromJsonAs(parsedJson, returnType_1));
                }
                case 500:
                    return singleton_1.ReturnFrom<any>((() => {
                        throw ProxyRequestException_$ctor_76BC5104(response_3, toText(printf("Internal server error (500) while making request to %s"))(url), response_3.ResponseBody);
                    })());
                default:
                    return singleton_1.ReturnFrom<any>((() => {
                        throw ProxyRequestException_$ctor_76BC5104(response_3, toText(printf("Http error (%d) from server occured while making request to %s"))(matchValue_5)(url), response_3.ResponseBody);
                    })());
            }
        })));
    }
    return (arg0: $a): ((arg0: $b) => ((arg0: $c) => ((arg0: $d) => ((arg0: $e) => ((arg0: $f) => ((arg0: $g) => ((arg0: $h) => Async<any>))))))) => ((arg1: $b): ((arg0: $c) => ((arg0: $d) => ((arg0: $e) => ((arg0: $f) => ((arg0: $g) => ((arg0: $h) => Async<any>)))))) => ((arg2: $c): ((arg0: $d) => ((arg0: $e) => ((arg0: $f) => ((arg0: $g) => ((arg0: $h) => Async<any>))))) => ((arg3: $d): ((arg0: $e) => ((arg0: $f) => ((arg0: $g) => ((arg0: $h) => Async<any>)))) => ((arg4: $e): ((arg0: $f) => ((arg0: $g) => ((arg0: $h) => Async<any>))) => ((arg5: $f): ((arg0: $g) => ((arg0: $h) => Async<any>)) => ((arg6: $g): ((arg0: $h) => Async<any>) => ((arg7: $h): Async<any> => {
        let matchValue_6: int32;
        const inputArguments: any[] = funcNeedParameters ? take<any>(argumentCount, [arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7]) : [];
        return executeRequest(binaryInput ? RequestBody_Binary(arg0) : ((matchValue_6 = (inputArgumentTypes.length | 0), (matchValue_6 === 1) ? (!Convert_arrayLike(item(0, inputArgumentTypes)) ? RequestBody_Json(defaultArg(map<any, string>((arg_9: any): string => Convert_serialize(arg_9, TypeInfo_Tuple((): TypeInfo_$union[] => inputArgumentTypes)), tryHead<any>(inputArguments)), "{}")) : RequestBody_Json(Convert_serialize([item(0, inputArguments)], TypeInfo_Array((): TypeInfo_$union => item(0, inputArgumentTypes))))) : RequestBody_Json(Convert_serialize(inputArguments, TypeInfo_Tuple((): TypeInfo_$union[] => inputArgumentTypes))))));
    })))))));
}

