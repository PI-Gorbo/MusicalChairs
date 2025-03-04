import { Record } from "../../../fable_modules/fable-library-ts.4.24.0/Types.js";
import { IComparable, IEquatable } from "../../../fable_modules/fable-library-ts.4.24.0/Util.js";
import { lambda_type, union_type, unit_type, list_type, option_type, record_type, string_type, class_type, TypeInfo } from "../../../fable_modules/fable-library-ts.4.24.0/Reflection.js";
import { Option } from "../../../fable_modules/fable-library-ts.4.24.0/Option.js";
import { FSharpList } from "../../../fable_modules/fable-library-ts.4.24.0/List.js";
import { DraftPosition_$reflection, DraftTemplate_$reflection, DraftPosition, DraftTemplate } from "./Job.js";
import { Async } from "../../../fable_modules/fable-library-ts.4.24.0/AsyncBuilder.js";
import { FSharpResult$2, FSharpResult$2_$union } from "../../../fable_modules/fable-library-ts.4.24.0/Result.js";

export class ActiveJobDto extends Record implements IEquatable<ActiveJobDto>, IComparable<ActiveJobDto> {
    readonly id: string;
    readonly name: string;
    constructor(id: string, name: string) {
        super();
        this.id = id;
        this.name = name;
    }
}

export function ActiveJobDto_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.JobApi.ActiveJobDto", [], ActiveJobDto, () => [["id", class_type("System.Guid")], ["name", string_type]]);
}

export class DraftJobDto extends Record implements IEquatable<DraftJobDto>, IComparable<DraftJobDto> {
    readonly id: string;
    readonly name: Option<string>;
    constructor(id: string, name: Option<string>) {
        super();
        this.id = id;
        this.name = name;
    }
}

export function DraftJobDto_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.JobApi.DraftJobDto", [], DraftJobDto, () => [["id", class_type("System.Guid")], ["name", option_type(string_type)]]);
}

export class MyJobsResponse extends Record implements IEquatable<MyJobsResponse>, IComparable<MyJobsResponse> {
    readonly activeJobs: FSharpList<ActiveJobDto>;
    readonly draftJobs: FSharpList<DraftJobDto>;
    constructor(activeJobs: FSharpList<ActiveJobDto>, draftJobs: FSharpList<DraftJobDto>) {
        super();
        this.activeJobs = activeJobs;
        this.draftJobs = draftJobs;
    }
}

export function MyJobsResponse_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.JobApi.MyJobsResponse", [], MyJobsResponse, () => [["activeJobs", list_type(ActiveJobDto_$reflection())], ["draftJobs", list_type(DraftJobDto_$reflection())]]);
}

export class UpdateJobDraftRequest extends Record implements IEquatable<UpdateJobDraftRequest>, IComparable<UpdateJobDraftRequest> {
    readonly id: string;
    readonly name: Option<string>;
    readonly templates: Option<FSharpList<DraftTemplate>>;
    readonly positions: Option<FSharpList<DraftPosition>>;
    constructor(id: string, name: Option<string>, templates: Option<FSharpList<DraftTemplate>>, positions: Option<FSharpList<DraftPosition>>) {
        super();
        this.id = id;
        this.name = name;
        this.templates = templates;
        this.positions = positions;
    }
}

export function UpdateJobDraftRequest_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.JobApi.UpdateJobDraftRequest", [], UpdateJobDraftRequest, () => [["id", class_type("System.Guid")], ["name", option_type(string_type)], ["templates", option_type(list_type(DraftTemplate_$reflection()))], ["positions", option_type(list_type(DraftPosition_$reflection()))]]);
}

export class IJobApi extends Record {
    readonly myJobs: (() => Async<FSharpResult$2_$union<MyJobsResponse, void>>);
    readonly getJob: ((arg0: string) => Async<FSharpResult$2_$union<ActiveJobDto, string>>);
    readonly getDraftJob: ((arg0: string) => Async<FSharpResult$2_$union<DraftJobDto, string>>);
    readonly createDraft: (() => Async<FSharpResult$2_$union<DraftJobDto, string>>);
    readonly updateDraft: ((arg0: UpdateJobDraftRequest) => Async<FSharpResult$2_$union<void, string>>);
    readonly startJob: ((arg0: string) => Async<FSharpResult$2_$union<void, string>>);
    constructor(myJobs: (() => Async<FSharpResult$2_$union<MyJobsResponse, void>>), getJob: ((arg0: string) => Async<FSharpResult$2_$union<ActiveJobDto, string>>), getDraftJob: ((arg0: string) => Async<FSharpResult$2_$union<DraftJobDto, string>>), createDraft: (() => Async<FSharpResult$2_$union<DraftJobDto, string>>), updateDraft: ((arg0: UpdateJobDraftRequest) => Async<FSharpResult$2_$union<void, string>>), startJob: ((arg0: string) => Async<FSharpResult$2_$union<void, string>>)) {
        super();
        this.myJobs = myJobs;
        this.getJob = getJob;
        this.getDraftJob = getDraftJob;
        this.createDraft = createDraft;
        this.updateDraft = updateDraft;
        this.startJob = startJob;
    }
}

export function IJobApi_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.JobApi.IJobApi", [], IJobApi, () => [["myJobs", lambda_type(unit_type, class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [MyJobsResponse_$reflection(), unit_type], FSharpResult$2, () => [[["ResultValue", MyJobsResponse_$reflection()]], [["ErrorValue", unit_type]]])]))], ["getJob", lambda_type(class_type("System.Guid"), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [ActiveJobDto_$reflection(), string_type], FSharpResult$2, () => [[["ResultValue", ActiveJobDto_$reflection()]], [["ErrorValue", string_type]]])]))], ["getDraftJob", lambda_type(class_type("System.Guid"), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [DraftJobDto_$reflection(), string_type], FSharpResult$2, () => [[["ResultValue", DraftJobDto_$reflection()]], [["ErrorValue", string_type]]])]))], ["createDraft", lambda_type(unit_type, class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [DraftJobDto_$reflection(), string_type], FSharpResult$2, () => [[["ResultValue", DraftJobDto_$reflection()]], [["ErrorValue", string_type]]])]))], ["updateDraft", lambda_type(UpdateJobDraftRequest_$reflection(), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [unit_type, string_type], FSharpResult$2, () => [[["ResultValue", unit_type]], [["ErrorValue", string_type]]])]))], ["startJob", lambda_type(class_type("System.Guid"), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [unit_type, string_type], FSharpResult$2, () => [[["ResultValue", unit_type]], [["ErrorValue", string_type]]])]))]]);
}

