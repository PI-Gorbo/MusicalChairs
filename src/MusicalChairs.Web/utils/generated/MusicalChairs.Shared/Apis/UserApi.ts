import { Union, Record } from "../../fable_modules/fable-library-ts.4.24.0/Types.js";
import { IComparable, IEquatable } from "../../fable_modules/fable-library-ts.4.24.0/Util.js";
import { lambda_type, unit_type, union_type, record_type, string_type, class_type, TypeInfo } from "../../fable_modules/fable-library-ts.4.24.0/Reflection.js";
import { Async } from "../../fable_modules/fable-library-ts.4.24.0/AsyncBuilder.js";
import { FSharpResult$2, FSharpResult$2_$union } from "../../fable_modules/fable-library-ts.4.24.0/Result.js";

export class UserDto extends Record implements IEquatable<UserDto>, IComparable<UserDto> {
    readonly id: string;
    readonly username: string;
    readonly email: string;
    constructor(id: string, username: string, email: string) {
        super();
        this.id = id;
        this.username = username;
        this.email = email;
    }
}

export function UserDto_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.UserApi.UserDto", [], UserDto, () => [["id", class_type("System.Guid")], ["username", string_type], ["email", string_type]]);
}

export class LoginRequest extends Record implements IEquatable<LoginRequest>, IComparable<LoginRequest> {
    readonly email: string;
    readonly password: string;
    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }
}

export function LoginRequest_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.UserApi.LoginRequest", [], LoginRequest, () => [["email", string_type], ["password", string_type]]);
}

export class RegisterRequest extends Record implements IEquatable<RegisterRequest>, IComparable<RegisterRequest> {
    readonly email: string;
    readonly password: string;
    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }
}

export function RegisterRequest_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.UserApi.RegisterRequest", [], RegisterRequest, () => [["email", string_type], ["password", string_type]]);
}

export type RegisterFailure_$union = 
    | RegisterFailure<0>
    | RegisterFailure<1>

export type RegisterFailure_$cases = {
    0: ["EmailAlreadyRegistered", []],
    1: ["PasswordInvalid", [string]]
}

export function RegisterFailure_EmailAlreadyRegistered() {
    return new RegisterFailure<0>(0, []);
}

export function RegisterFailure_PasswordInvalid(reason: string) {
    return new RegisterFailure<1>(1, [reason]);
}

export class RegisterFailure<Tag extends keyof RegisterFailure_$cases> extends Union<Tag, RegisterFailure_$cases[Tag][0]> {
    constructor(readonly tag: Tag, readonly fields: RegisterFailure_$cases[Tag][1]) {
        super();
    }
    cases() {
        return ["EmailAlreadyRegistered", "PasswordInvalid"];
    }
}

export function RegisterFailure_$reflection(): TypeInfo {
    return union_type("MusicalChairs.Shared.Apis.UserApi.RegisterFailure", [], RegisterFailure, () => [[], [["reason", string_type]]]);
}

export class RequestResetPasswordTokenRequest extends Record implements IEquatable<RequestResetPasswordTokenRequest>, IComparable<RequestResetPasswordTokenRequest> {
    readonly email: string;
    constructor(email: string) {
        super();
        this.email = email;
    }
}

export function RequestResetPasswordTokenRequest_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.UserApi.RequestResetPasswordTokenRequest", [], RequestResetPasswordTokenRequest, () => [["email", string_type]]);
}

export class ResetPasswordRequest extends Record implements IEquatable<ResetPasswordRequest>, IComparable<ResetPasswordRequest> {
    readonly email: string;
    readonly newPassword: string;
    readonly token: string;
    constructor(email: string, newPassword: string, token: string) {
        super();
        this.email = email;
        this.newPassword = newPassword;
        this.token = token;
    }
}

export function ResetPasswordRequest_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.UserApi.ResetPasswordRequest", [], ResetPasswordRequest, () => [["email", string_type], ["newPassword", string_type], ["token", string_type]]);
}

export type ResetPasswordError_$union = 
    | ResetPasswordError<0>
    | ResetPasswordError<1>

export type ResetPasswordError_$cases = {
    0: ["InvalidToken", []],
    1: ["InvalidNewPassword", [string]]
}

export function ResetPasswordError_InvalidToken() {
    return new ResetPasswordError<0>(0, []);
}

export function ResetPasswordError_InvalidNewPassword(error: string) {
    return new ResetPasswordError<1>(1, [error]);
}

export class ResetPasswordError<Tag extends keyof ResetPasswordError_$cases> extends Union<Tag, ResetPasswordError_$cases[Tag][0]> {
    constructor(readonly tag: Tag, readonly fields: ResetPasswordError_$cases[Tag][1]) {
        super();
    }
    cases() {
        return ["InvalidToken", "InvalidNewPassword"];
    }
}

export function ResetPasswordError_$reflection(): TypeInfo {
    return union_type("MusicalChairs.Shared.Apis.UserApi.ResetPasswordError", [], ResetPasswordError, () => [[], [["error", string_type]]]);
}

export class IUserApi extends Record {
    readonly me: (() => Async<FSharpResult$2_$union<UserDto, string>>);
    readonly login: ((arg0: LoginRequest) => Async<FSharpResult$2_$union<void, string>>);
    readonly logout: (() => Async<void>);
    readonly register: ((arg0: RegisterRequest) => Async<FSharpResult$2_$union<void, RegisterFailure_$union>>);
    readonly requestResetPasswordToken: ((arg0: RequestResetPasswordTokenRequest) => Async<void>);
    readonly resetPassword: ((arg0: ResetPasswordRequest) => Async<FSharpResult$2_$union<void, ResetPasswordError_$union>>);
    constructor(me: (() => Async<FSharpResult$2_$union<UserDto, string>>), login: ((arg0: LoginRequest) => Async<FSharpResult$2_$union<void, string>>), logout: (() => Async<void>), register: ((arg0: RegisterRequest) => Async<FSharpResult$2_$union<void, RegisterFailure_$union>>), requestResetPasswordToken: ((arg0: RequestResetPasswordTokenRequest) => Async<void>), resetPassword: ((arg0: ResetPasswordRequest) => Async<FSharpResult$2_$union<void, ResetPasswordError_$union>>)) {
        super();
        this.me = me;
        this.login = login;
        this.logout = logout;
        this.register = register;
        this.requestResetPasswordToken = requestResetPasswordToken;
        this.resetPassword = resetPassword;
    }
}

export function IUserApi_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.UserApi.IUserApi", [], IUserApi, () => [["me", lambda_type(unit_type, class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [UserDto_$reflection(), string_type], FSharpResult$2, () => [[["ResultValue", UserDto_$reflection()]], [["ErrorValue", string_type]]])]))], ["login", lambda_type(LoginRequest_$reflection(), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [unit_type, string_type], FSharpResult$2, () => [[["ResultValue", unit_type]], [["ErrorValue", string_type]]])]))], ["logout", lambda_type(unit_type, class_type("Microsoft.FSharp.Control.FSharpAsync`1", [unit_type]))], ["register", lambda_type(RegisterRequest_$reflection(), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [unit_type, RegisterFailure_$reflection()], FSharpResult$2, () => [[["ResultValue", unit_type]], [["ErrorValue", RegisterFailure_$reflection()]]])]))], ["requestResetPasswordToken", lambda_type(RequestResetPasswordTokenRequest_$reflection(), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [unit_type]))], ["resetPassword", lambda_type(ResetPasswordRequest_$reflection(), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [unit_type, ResetPasswordError_$reflection()], FSharpResult$2, () => [[["ResultValue", unit_type]], [["ErrorValue", ResetPasswordError_$reflection()]]])]))]]);
}

