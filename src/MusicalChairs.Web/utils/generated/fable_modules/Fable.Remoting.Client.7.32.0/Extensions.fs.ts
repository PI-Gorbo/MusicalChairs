import { uint8 } from "../fable-library-ts.4.24.0/Int32.js";
import { fromContinuations } from "../fable-library-ts.4.24.0/Async.js";
import { Async } from "../fable-library-ts.4.24.0/AsyncBuilder.js";
import { class_type, TypeInfo } from "../fable-library-ts.4.24.0/Reflection.js";
import { isNullOrWhiteSpace } from "../fable-library-ts.4.24.0/String.js";

/**
 * Creates a typed byte array of binary data if it not already typed
 */
export function InternalUtilities_toUInt8Array(data: uint8[]): uint8[] {
    if (data instanceof Uint8Array) {
        return data;
    }
    else {
        return new Uint8Array(data);
    }
}

/**
 * Asynchronously reads the File content as byte[]
 */
export function Browser_Types_File__File_ReadAsByteArray(instance: any): Async<uint8[]> {
    return fromContinuations<uint8[]>((tupledArg: [((arg0: uint8[]) => void), ((arg0: Error) => void), ((arg0: any) => void)]): void => {
        const reader: any = new FileReader();
        reader.onload = ((_arg_2: any): void => {
            if (reader.readyState === 2) {
                tupledArg[0](new Uint8Array(reader.result));
            }
        });
        reader.readAsArrayBuffer(instance);
    });
}

/**
 * Asynchronously reads the File content as a data url string
 */
export function Browser_Types_File__File_ReadAsDataUrl(instance: any): Async<string> {
    return fromContinuations<string>((tupledArg: [((arg0: string) => void), ((arg0: Error) => void), ((arg0: any) => void)]): void => {
        const reader: any = new FileReader();
        reader.onload = ((_arg_2: any): void => {
            if (reader.readyState === 2) {
                tupledArg[0](reader.result);
            }
        });
        reader.readAsDataURL(instance);
    });
}

/**
 * Asynchronously reads the File contents as text
 */
export function Browser_Types_File__File_ReadAsText(instance: any): Async<string> {
    return fromContinuations<string>((tupledArg: [((arg0: string) => void), ((arg0: Error) => void), ((arg0: any) => void)]): void => {
        const reader: any = new FileReader();
        reader.onload = ((_arg_2: any): void => {
            if (reader.readyState === 2) {
                tupledArg[0](reader.result);
            }
        });
        reader.readAsText(instance);
    });
}

export class ByteArrayExtensions {
    constructor() {
    }
}

export function ByteArrayExtensions_$reflection(): TypeInfo {
    return class_type("Fable.Remoting.Client.ByteArrayExtensions", undefined, ByteArrayExtensions);
}

/**
 * Saves the binary content as a file using the provided file name.
 */
export function ByteArrayExtensions_SaveFileAs_5EF83E14(content: uint8[], fileName: string): void {
    if (isNullOrWhiteSpace(fileName)) {
    }
    else {
        const binaryData: uint8[] = InternalUtilities_toUInt8Array(content);
        const blob: any = new Blob([binaryData.buffer], { type: "application/octet-stream" });
        const dataUrl: string = window.URL.createObjectURL(blob);
        const anchor: any = document.createElement("a");
        anchor.style = "display: none";
        anchor.href = dataUrl;
        anchor.download = fileName;
        anchor.rel = "noopener";
        anchor.click();
        anchor.remove();
        window.setTimeout((): void => {
            URL.revokeObjectURL(dataUrl);
        }, 40 * 1000);
    }
}

/**
 * Saves the binary content as a file using the provided file name.
 */
export function ByteArrayExtensions_SaveFileAs_Z4C1C8351(content: uint8[], fileName: string, mimeType: string): void {
    if (isNullOrWhiteSpace(fileName)) {
    }
    else {
        const binaryData: uint8[] = InternalUtilities_toUInt8Array(content);
        const blob: any = new Blob([binaryData.buffer], { type: mimeType });
        const dataUrl: string = window.URL.createObjectURL(blob);
        const anchor: any = document.createElement("a");
        anchor.style = "display: none";
        anchor.href = dataUrl;
        anchor.download = fileName;
        anchor.rel = "noopener";
        anchor.click();
        anchor.remove();
        window.setTimeout((): void => {
            URL.revokeObjectURL(dataUrl);
        }, 40 * 1000);
    }
}

/**
 * Converts the binary content into a data url by first converting it to a Blob of type "application/octet-stream" and reading it as a data url.
 */
export function ByteArrayExtensions_AsDataUrl_Z3F6BC7B1(content: uint8[]): string {
    const binaryData: uint8[] = InternalUtilities_toUInt8Array(content);
    const blob: any = new Blob([binaryData.buffer], { type: "application/octet-stream" });
    return window.URL.createObjectURL(blob);
}

/**
 * Converts the binary content into a data url by first converting it to a Blob of the provided mime-type and reading it as a data url.
 */
export function ByteArrayExtensions_AsDataUrl_5EF83E14(content: uint8[], mimeType: string): string {
    const binaryData: uint8[] = InternalUtilities_toUInt8Array(content);
    const blob: any = new Blob([binaryData.buffer], { type: mimeType });
    return window.URL.createObjectURL(blob);
}

