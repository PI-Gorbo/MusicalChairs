import { RemotingModule_createApi, RemotingModule_withBaseUrl, RemotingModule_withCredentials } from "./fable_modules/Fable.Remoting.Client.7.32.0/Remoting.fs.js";
import { RemoteBuilderOptions } from "./fable_modules/Fable.Remoting.Client.7.32.0/Types.fs.js";
import { Remoting_buildProxy_64DC51C } from "./fable_modules/Fable.Remoting.Client.7.32.0/Remoting.fs.js";
import { ResetPasswordError_$union, ResetPasswordRequest, RequestResetPasswordTokenRequest, RegisterFailure_$union, RegisterRequest, UserDto, LoginRequest, IUserApi, IUserApi_$reflection } from "./MusicalChairs.Shared/Apis/UserApi.js";
import { startAsPromise } from "./fable_modules/fable-library-ts.4.24.0/Async.js";
import { FSharpResult$2_$union } from "./fable_modules/fable-library-ts.4.24.0/Result.js";
import { UpdateJobDraftRequest, MyJobsResponse, ActiveJobDto, DraftJobDto, IJobApi, IJobApi_$reflection } from "./MusicalChairs.Shared/Apis/Job/JobApi.js";

export function createApi(url: string): { jobAPi: { createDraft: (() => Promise<FSharpResult$2_$union<DraftJobDto, string>>), getDraftJob: ((arg0: string) => Promise<FSharpResult$2_$union<DraftJobDto, string>>), getJob: ((arg0: string) => Promise<FSharpResult$2_$union<ActiveJobDto, string>>), myJobs: (() => Promise<FSharpResult$2_$union<MyJobsResponse, void>>), startJob: ((arg0: string) => Promise<FSharpResult$2_$union<void, string>>), updateDraft: ((arg0: UpdateJobDraftRequest) => Promise<FSharpResult$2_$union<void, string>>) }, userApi: { login: ((arg0: LoginRequest) => Promise<FSharpResult$2_$union<void, string>>), logout: (() => Promise<void>), me: (() => Promise<FSharpResult$2_$union<UserDto, string>>), register: ((arg0: RegisterRequest) => Promise<FSharpResult$2_$union<void, RegisterFailure_$union>>), requestResetPasswordToken: ((arg0: RequestResetPasswordTokenRequest) => Promise<void>), resetPassword: ((arg0: ResetPasswordRequest) => Promise<FSharpResult$2_$union<void, ResetPasswordError_$union>>) } } {
    const builder: RemoteBuilderOptions = RemotingModule_withCredentials(true, RemotingModule_withBaseUrl(url, RemotingModule_createApi()));
    const _userApi: IUserApi = Remoting_buildProxy_64DC51C<IUserApi>(builder, IUserApi_$reflection());
    const userApi: { login: ((arg0: LoginRequest) => Promise<FSharpResult$2_$union<void, string>>), logout: (() => Promise<void>), me: (() => Promise<FSharpResult$2_$union<UserDto, string>>), register: ((arg0: RegisterRequest) => Promise<FSharpResult$2_$union<void, RegisterFailure_$union>>), requestResetPasswordToken: ((arg0: RequestResetPasswordTokenRequest) => Promise<void>), resetPassword: ((arg0: ResetPasswordRequest) => Promise<FSharpResult$2_$union<void, ResetPasswordError_$union>>) } = {
        login: (arg: LoginRequest): Promise<FSharpResult$2_$union<void, string>> => startAsPromise(_userApi.login(arg)),
        logout: (): Promise<void> => startAsPromise(_userApi.logout()),
        me: (): Promise<FSharpResult$2_$union<UserDto, string>> => startAsPromise(_userApi.me()),
        register: (arg_2: RegisterRequest): Promise<FSharpResult$2_$union<void, RegisterFailure_$union>> => startAsPromise(_userApi.register(arg_2)),
        requestResetPasswordToken: (arg_4: RequestResetPasswordTokenRequest): Promise<void> => startAsPromise(_userApi.requestResetPasswordToken(arg_4)),
        resetPassword: (arg_3: ResetPasswordRequest): Promise<FSharpResult$2_$union<void, ResetPasswordError_$union>> => startAsPromise(_userApi.resetPassword(arg_3)),
    };
    const _jobApi: IJobApi = Remoting_buildProxy_64DC51C<IJobApi>(builder, IJobApi_$reflection());
    return {
        jobAPi: {
            createDraft: (): Promise<FSharpResult$2_$union<DraftJobDto, string>> => startAsPromise(_jobApi.createDraft()),
            getDraftJob: (arg_8: string): Promise<FSharpResult$2_$union<DraftJobDto, string>> => startAsPromise(_jobApi.getDraftJob(arg_8)),
            getJob: (arg_7: string): Promise<FSharpResult$2_$union<ActiveJobDto, string>> => startAsPromise(_jobApi.getJob(arg_7)),
            myJobs: (): Promise<FSharpResult$2_$union<MyJobsResponse, void>> => startAsPromise(_jobApi.myJobs()),
            startJob: (arg_11: string): Promise<FSharpResult$2_$union<void, string>> => startAsPromise(_jobApi.startJob(arg_11)),
            updateDraft: (arg_10: UpdateJobDraftRequest): Promise<FSharpResult$2_$union<void, string>> => startAsPromise(_jobApi.updateDraft(arg_10)),
        },
        userApi: userApi,
    };
}

