import { HttpResponse, RequestBody_$union, HttpMethod_$union, HttpMethod_POST, HttpRequest, RequestBody_Empty, HttpMethod_GET } from "./Types.fs.js";
import { FSharpList, empty } from "../fable-library-ts.4.24.0/List.js";
import { Async, singleton } from "../fable-library-ts.4.24.0/AsyncBuilder.js";
import { isCancellationRequested, fromContinuations, cancellationToken } from "../fable-library-ts.4.24.0/Async.js";
import { Option, some, value as value_1 } from "../fable-library-ts.4.24.0/Option.js";
import { IDisposable, disposeSafe, IEnumerator, getEnumerator } from "../fable-library-ts.4.24.0/Util.js";
import { uint8, int32 } from "../fable-library-ts.4.24.0/Int32.js";
import { InternalUtilities_toUInt8Array } from "./Extensions.fs.js";

const defaultRequestConfig: HttpRequest = new HttpRequest(HttpMethod_GET(), "/", empty<[string, string]>(), RequestBody_Empty(), false);

/**
 * Creates a GET request to the specified url
 */
export function get$(url: string): HttpRequest {
    return new HttpRequest(HttpMethod_GET(), url, defaultRequestConfig.Headers, defaultRequestConfig.RequestBody, defaultRequestConfig.WithCredentials);
}

/**
 * Creates a POST request to the specified url
 */
export function post(url: string): HttpRequest {
    return new HttpRequest(HttpMethod_POST(), url, defaultRequestConfig.Headers, defaultRequestConfig.RequestBody, defaultRequestConfig.WithCredentials);
}

/**
 * Creates a request using the given method and url
 */
export function request(method: HttpMethod_$union, url: string): HttpRequest {
    return new HttpRequest(method, url, defaultRequestConfig.Headers, defaultRequestConfig.RequestBody, defaultRequestConfig.WithCredentials);
}

/**
 * Appends a request with headers as key-value pairs
 */
export function withHeaders(headers: FSharpList<[string, string]>, req: HttpRequest): HttpRequest {
    return new HttpRequest(req.HttpMethod, req.Url, headers, req.RequestBody, req.WithCredentials);
}

/**
 * Sets the withCredentials option on the XHR request, useful for CORS requests
 */
export function withCredentials(withCredentials_1: boolean, req: HttpRequest): HttpRequest {
    return new HttpRequest(req.HttpMethod, req.Url, req.Headers, req.RequestBody, withCredentials_1);
}

/**
 * Appends a request with string body content
 */
export function withBody(body: RequestBody_$union, req: HttpRequest): HttpRequest {
    return new HttpRequest(req.HttpMethod, req.Url, req.Headers, body, req.WithCredentials);
}

function sendAndRead<$a>(preparation: Option<((arg0: any) => void)>, resultMapper: ((arg0: any) => $a), req: HttpRequest): Async<$a> {
    return singleton.Delay<$a>((): Async<$a> => singleton.Bind<any, $a>(cancellationToken(), (_arg: any): Async<$a> => {
        const token: any = _arg;
        const request_1: Async<$a> = fromContinuations<$a>((tupledArg: [((arg0: $a) => void), ((arg0: Error) => void), ((arg0: any) => void)]): void => {
            const xhr: any = new XMLHttpRequest();
            if (req.HttpMethod.tag === /* POST */ 1) {
                xhr.open("POST", req.Url);
            }
            else {
                xhr.open("GET", req.Url);
            }
            if (preparation != null) {
                value_1(preparation)(xhr);
            }
            const cancellationTokenRegistration: any = token.register((): void => {
                xhr.abort();
                tupledArg[2](new Error(token));
            });
            const enumerator: IEnumerator<[string, string]> = getEnumerator(req.Headers);
            try {
                while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                    const forLoopVar: [string, string] = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                    xhr.setRequestHeader(forLoopVar[0], forLoopVar[1]);
                }
            }
            finally {
                disposeSafe(enumerator as IDisposable);
            }
            xhr.withCredentials = req.WithCredentials;
            xhr.onreadystatechange = ((): void => {
                const matchValue_1: int32 = xhr.readyState | 0;
                let matchResult: int32;
                if (matchValue_1 === 4) {
                    if (!isCancellationRequested(token)) {
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
                    case 0: {
                        disposeSafe(cancellationTokenRegistration);
                        tupledArg[0](resultMapper(xhr));
                        break;
                    }
                    case 1: {
                        break;
                    }
                }
            });
            const matchValue_2: RequestBody_$union = req.RequestBody;
            switch (matchValue_2.tag) {
                case /* Json */ 1: {
                    const content: string = matchValue_2.fields[0];
                    xhr.send(some(content));
                    break;
                }
                case /* Binary */ 2: {
                    const content_1: uint8[] = matchValue_2.fields[0];
                    xhr.send(some(InternalUtilities_toUInt8Array(content_1)));
                    break;
                }
                default:
                    xhr.send();
            }
        });
        return singleton.ReturnFrom<$a>(request_1);
    }));
}

export const send = (req: HttpRequest): Async<HttpResponse> => sendAndRead<HttpResponse>(undefined, (xhr: any): HttpResponse => (new HttpResponse(xhr.status, xhr.responseText)), req);

export const sendAndReadBinary = (req: HttpRequest): Async<[uint8[], int32]> => sendAndRead<[uint8[], int32]>((xhr: any): void => {
    xhr.responseType = "arraybuffer";
}, (xhr_1: any): [uint8[], int32] => ([new Uint8Array(xhr_1.response), xhr_1.status] as [uint8[], int32]), req);

