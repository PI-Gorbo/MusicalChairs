import { some, Option } from "../fable-library-ts.4.24.0/Option.js";
import { float64 } from "../fable-library-ts.4.24.0/Int32.js";

export function $007CNativeString$007C_$007C(x: any): Option<string> {
    if (typeof (x) === 'string') {
        return x;
    }
    else {
        return undefined;
    }
}

export function $007CNativeBool$007C_$007C(x: any): Option<boolean> {
    if (typeof (x) === 'boolean') {
        return x;
    }
    else {
        return undefined;
    }
}

export function $007CNativeNumber$007C_$007C(x: any): Option<float64> {
    if (typeof (x) === 'number') {
        return x;
    }
    else {
        return undefined;
    }
}

export function $007CNativeObject$007C_$007C(x: any): Option<any> {
    if (typeof (x) === 'object') {
        return some(x);
    }
    else {
        return undefined;
    }
}

export function $007CNull$007C_$007C(x: any): Option<any> {
    if (x == null) {
        return some(x);
    }
    else {
        return undefined;
    }
}

export function $007CNativeArray$007C_$007C(x: any): Option<any[]> {
    if (Array.isArray(x)) {
        return x;
    }
    else {
        return undefined;
    }
}

