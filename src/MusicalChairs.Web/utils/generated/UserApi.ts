import { Remoting_buildProxy_64DC51C } from "./fable_modules/Fable.Remoting.Client.7.32.0/Remoting.fs.js";
import { RemotingModule_createApi, RemotingModule_withBaseUrl } from "./fable_modules/Fable.Remoting.Client.7.32.0/Remoting.fs.js";
import { RequestResetPasswordTokenRequest, ResetPasswordError, ResetPasswordRequest, RegisterFailure, RegisterRequest, UserDto, LoginRequest, IUserApi, IUserApi_$reflection } from "./MusicalChairs.Shared/UserApi/UserApi.js";
import { startAsPromise } from "./fable_modules/fable-library-ts.4.24.0/Async.js";
import { FSharpResult$2_$union } from "./fable_modules/fable-library-ts.4.24.0/Result.js";

export const userApi: IUserApi = Remoting_buildProxy_64DC51C<IUserApi>(RemotingModule_withBaseUrl("http://localhost:5000", RemotingModule_createApi()), IUserApi_$reflection());

export function login(req: LoginRequest): Promise<FSharpResult$2_$union<void, string>> {
    return startAsPromise(userApi.login(req));
}

export function me(): Promise<FSharpResult$2_$union<UserDto, void>> {
    return startAsPromise(userApi.me());
}

export function register(req: RegisterRequest): Promise<FSharpResult$2_$union<void, RegisterFailure>> {
    return startAsPromise(userApi.register(req));
}

export function resetPassword(req: ResetPasswordRequest): Promise<FSharpResult$2_$union<void, ResetPasswordError>> {
    return startAsPromise(userApi.resetPassword(req));
}

export function requestResetPasswordToken(req: RequestResetPasswordTokenRequest): Promise<void> {
    return startAsPromise(userApi.requestResetPasswordToken(req));
}

