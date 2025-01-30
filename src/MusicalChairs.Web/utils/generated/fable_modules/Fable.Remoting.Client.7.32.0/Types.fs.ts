import { Record, Union } from "../fable-library-ts.4.24.0/Types.js";
import { obj_type, class_type, lambda_type, option_type, int32_type, record_type, bool_type, list_type, tuple_type, array_type, uint8_type, string_type, union_type, TypeInfo } from "../fable-library-ts.4.24.0/Reflection.js";
import { int32, uint8 } from "../fable-library-ts.4.24.0/Int32.js";
import { FSharpList } from "../fable-library-ts.4.24.0/List.js";
import { IComparable, IEquatable } from "../fable-library-ts.4.24.0/Util.js";
import { Option } from "../fable-library-ts.4.24.0/Option.js";

export type HttpMethod_$union = 
    | HttpMethod<0>
    | HttpMethod<1>

export type HttpMethod_$cases = {
    0: ["GET", []],
    1: ["POST", []]
}

export function HttpMethod_GET() {
    return new HttpMethod<0>(0, []);
}

export function HttpMethod_POST() {
    return new HttpMethod<1>(1, []);
}

export class HttpMethod<Tag extends keyof HttpMethod_$cases> extends Union<Tag, HttpMethod_$cases[Tag][0]> {
    constructor(readonly tag: Tag, readonly fields: HttpMethod_$cases[Tag][1]) {
        super();
    }
    cases() {
        return ["GET", "POST"];
    }
}

export function HttpMethod_$reflection(): TypeInfo {
    return union_type("Fable.Remoting.Client.HttpMethod", [], HttpMethod, () => [[], []]);
}

export type RequestBody_$union = 
    | RequestBody<0>
    | RequestBody<1>
    | RequestBody<2>

export type RequestBody_$cases = {
    0: ["Empty", []],
    1: ["Json", [string]],
    2: ["Binary", [uint8[]]]
}

export function RequestBody_Empty() {
    return new RequestBody<0>(0, []);
}

export function RequestBody_Json(Item: string) {
    return new RequestBody<1>(1, [Item]);
}

export function RequestBody_Binary(Item: uint8[]) {
    return new RequestBody<2>(2, [Item]);
}

export class RequestBody<Tag extends keyof RequestBody_$cases> extends Union<Tag, RequestBody_$cases[Tag][0]> {
    constructor(readonly tag: Tag, readonly fields: RequestBody_$cases[Tag][1]) {
        super();
    }
    cases() {
        return ["Empty", "Json", "Binary"];
    }
}

export function RequestBody_$reflection(): TypeInfo {
    return union_type("Fable.Remoting.Client.RequestBody", [], RequestBody, () => [[], [["Item", string_type]], [["Item", array_type(uint8_type)]]]);
}

export class HttpRequest extends Record implements IEquatable<HttpRequest>, IComparable<HttpRequest> {
    readonly HttpMethod: HttpMethod_$union;
    readonly Url: string;
    readonly Headers: FSharpList<[string, string]>;
    readonly RequestBody: RequestBody_$union;
    readonly WithCredentials: boolean;
    constructor(HttpMethod: HttpMethod_$union, Url: string, Headers: FSharpList<[string, string]>, RequestBody: RequestBody_$union, WithCredentials: boolean) {
        super();
        this.HttpMethod = HttpMethod;
        this.Url = Url;
        this.Headers = Headers;
        this.RequestBody = RequestBody;
        this.WithCredentials = WithCredentials;
    }
}

export function HttpRequest_$reflection(): TypeInfo {
    return record_type("Fable.Remoting.Client.HttpRequest", [], HttpRequest, () => [["HttpMethod", HttpMethod_$reflection()], ["Url", string_type], ["Headers", list_type(tuple_type(string_type, string_type))], ["RequestBody", RequestBody_$reflection()], ["WithCredentials", bool_type]]);
}

export class HttpResponse extends Record implements IEquatable<HttpResponse>, IComparable<HttpResponse> {
    readonly StatusCode: int32;
    readonly ResponseBody: string;
    constructor(StatusCode: int32, ResponseBody: string) {
        super();
        this.StatusCode = (StatusCode | 0);
        this.ResponseBody = ResponseBody;
    }
}

export function HttpResponse_$reflection(): TypeInfo {
    return record_type("Fable.Remoting.Client.HttpResponse", [], HttpResponse, () => [["StatusCode", int32_type], ["ResponseBody", string_type]]);
}

export class RemoteBuilderOptions extends Record {
    readonly CustomHeaders: FSharpList<[string, string]>;
    readonly BaseUrl: Option<string>;
    readonly Authorization: Option<string>;
    readonly WithCredentials: boolean;
    readonly RouteBuilder: ((arg0: string, arg1: string) => string);
    readonly CustomResponseSerialization: Option<((arg0: uint8[], arg1: any) => any)>;
    constructor(CustomHeaders: FSharpList<[string, string]>, BaseUrl: Option<string>, Authorization: Option<string>, WithCredentials: boolean, RouteBuilder: ((arg0: string, arg1: string) => string), CustomResponseSerialization: Option<((arg0: uint8[], arg1: any) => any)>) {
        super();
        this.CustomHeaders = CustomHeaders;
        this.BaseUrl = BaseUrl;
        this.Authorization = Authorization;
        this.WithCredentials = WithCredentials;
        this.RouteBuilder = RouteBuilder;
        this.CustomResponseSerialization = CustomResponseSerialization;
    }
}

export function RemoteBuilderOptions_$reflection(): TypeInfo {
    return record_type("Fable.Remoting.Client.RemoteBuilderOptions", [], RemoteBuilderOptions, () => [["CustomHeaders", list_type(tuple_type(string_type, string_type))], ["BaseUrl", option_type(string_type)], ["Authorization", option_type(string_type)], ["WithCredentials", bool_type], ["RouteBuilder", lambda_type(string_type, lambda_type(string_type, string_type))], ["CustomResponseSerialization", option_type(lambda_type(array_type(uint8_type), lambda_type(class_type("System.Type"), obj_type)))]]);
}

export class ProxyRequestException extends Error {
    readonly response: HttpResponse;
    readonly reponseText: string;
    constructor(response: HttpResponse, errorMsg: string, reponseText: string) {
        super(errorMsg);
        this.response = response;
        this.reponseText = reponseText;
    }
}

export function ProxyRequestException_$reflection(): TypeInfo {
    return class_type("Fable.Remoting.Client.ProxyRequestException", undefined, ProxyRequestException, class_type("System.Exception"));
}

export function ProxyRequestException_$ctor_76BC5104(response: HttpResponse, errorMsg: string, reponseText: string): ProxyRequestException {
    return new ProxyRequestException(response, errorMsg, reponseText);
}

export function ProxyRequestException__get_Response(this$: ProxyRequestException): HttpResponse {
    return this$.response;
}

export function ProxyRequestException__get_StatusCode(this$: ProxyRequestException): int32 {
    return this$.response.StatusCode;
}

export function ProxyRequestException__get_ResponseText(this$: ProxyRequestException): string {
    return this$.reponseText;
}

