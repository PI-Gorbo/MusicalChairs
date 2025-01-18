import { Record } from "../../fable_modules/fable-library-ts.4.24.0/Types.js";
import { IComparable, IEquatable } from "../../fable_modules/fable-library-ts.4.24.0/Util.js";
import { lambda_type, union_type, unit_type, record_type, string_type, class_type, TypeInfo } from "../../fable_modules/fable-library-ts.4.24.0/Reflection.js";
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
    return record_type("MusicalChairs.Shared.UserApi.UserDto", [], UserDto, () => [["id", class_type("System.Guid")], ["username", string_type], ["email", string_type]]);
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
    return record_type("MusicalChairs.Shared.UserApi.LoginRequest", [], LoginRequest, () => [["email", string_type], ["password", string_type]]);
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
    return record_type("MusicalChairs.Shared.UserApi.RegisterRequest", [], RegisterRequest, () => [["email", string_type], ["password", string_type]]);
}

export type RegisterFailure = 
    | { type: "emailAlreadyRegistered" }
    | { type: "passwordInvalid", reason: string }

export class RequestResetPasswordTokenRequest extends Record implements IEquatable<RequestResetPasswordTokenRequest>, IComparable<RequestResetPasswordTokenRequest> {
    readonly email: string;
    constructor(email: string) {
        super();
        this.email = email;
    }
}

export function RequestResetPasswordTokenRequest_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.UserApi.RequestResetPasswordTokenRequest", [], RequestResetPasswordTokenRequest, () => [["email", string_type]]);
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
    return record_type("MusicalChairs.Shared.UserApi.ResetPasswordRequest", [], ResetPasswordRequest, () => [["email", string_type], ["newPassword", string_type], ["token", string_type]]);
}

export type ResetPasswordError = 
    | { type: "invalidToken" }
    | { type: "invalidNewPassword", error: string }

export class IUserApi extends Record {
    readonly me: (() => Async<FSharpResult$2_$union<UserDto, void>>);
    readonly login: ((arg0: LoginRequest) => Async<FSharpResult$2_$union<void, string>>);
    readonly register: ((arg0: RegisterRequest) => Async<FSharpResult$2_$union<void, RegisterFailure>>);
    readonly requestResetPasswordToken: ((arg0: RequestResetPasswordTokenRequest) => Async<void>);
    readonly resetPassword: ((arg0: ResetPasswordRequest) => Async<FSharpResult$2_$union<void, ResetPasswordError>>);
    constructor(me: (() => Async<FSharpResult$2_$union<UserDto, void>>), login: ((arg0: LoginRequest) => Async<FSharpResult$2_$union<void, string>>), register: ((arg0: RegisterRequest) => Async<FSharpResult$2_$union<void, RegisterFailure>>), requestResetPasswordToken: ((arg0: RequestResetPasswordTokenRequest) => Async<void>), resetPassword: ((arg0: ResetPasswordRequest) => Async<FSharpResult$2_$union<void, ResetPasswordError>>)) {
        super();
        this.me = me;
        this.login = login;
        this.register = register;
        this.requestResetPasswordToken = requestResetPasswordToken;
        this.resetPassword = resetPassword;
    }
}

export function IUserApi_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.UserApi.IUserApi", [], IUserApi, () => [["me", lambda_type(unit_type, class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [UserDto_$reflection(), unit_type], FSharpResult$2, () => [[["ResultValue", UserDto_$reflection()]], [["ErrorValue", unit_type]]])]))], ["login", lambda_type(LoginRequest_$reflection(), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [unit_type, string_type], FSharpResult$2, () => [[["ResultValue", unit_type]], [["ErrorValue", string_type]]])]))], ["register", lambda_type(RegisterRequest_$reflection(), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [unit_type, class_type("MusicalChairs.Shared.UserApi.RegisterFailure")], FSharpResult$2, () => [[["ResultValue", unit_type]], [["ErrorValue", class_type("MusicalChairs.Shared.UserApi.RegisterFailure")]]])]))], ["requestResetPasswordToken", lambda_type(RequestResetPasswordTokenRequest_$reflection(), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [unit_type]))], ["resetPassword", lambda_type(ResetPasswordRequest_$reflection(), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [unit_type, class_type("MusicalChairs.Shared.UserApi.ResetPasswordError")], FSharpResult$2, () => [[["ResultValue", unit_type]], [["ErrorValue", class_type("MusicalChairs.Shared.UserApi.ResetPasswordError")]]])]))]]);
}

