import { Record } from "../../../fable_modules/fable-library-ts.4.24.0/Types.js";
import { IComparable, IEquatable } from "../../../fable_modules/fable-library-ts.4.24.0/Util.js";
import { lambda_type, union_type, unit_type, option_type, string_type, list_type, record_type, class_type, TypeInfo } from "../../../fable_modules/fable-library-ts.4.24.0/Reflection.js";
import { FSharpList } from "../../../fable_modules/fable-library-ts.4.24.0/List.js";
import { Option } from "../../../fable_modules/fable-library-ts.4.24.0/Option.js";
import { Async } from "../../../fable_modules/fable-library-ts.4.24.0/AsyncBuilder.js";
import { FSharpResult$2, FSharpResult$2_$union } from "../../../fable_modules/fable-library-ts.4.24.0/Result.js";

export class ActiveJobDto extends Record implements IEquatable<ActiveJobDto>, IComparable<ActiveJobDto> {
    readonly id: string;
    constructor(id: string) {
        super();
        this.id = id;
    }
}

export function ActiveJobDto_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.JobApi.ActiveJobDto", [], ActiveJobDto, () => [["id", class_type("System.Guid")]]);
}

export class DraftJobDto extends Record implements IEquatable<DraftJobDto>, IComparable<DraftJobDto> {
    readonly id: string;
    constructor(id: string) {
        super();
        this.id = id;
    }
}

export function DraftJobDto_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.JobApi.DraftJobDto", [], DraftJobDto, () => [["id", class_type("System.Guid")]]);
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
    constructor(id: string, name: Option<string>) {
        super();
        this.id = id;
        this.name = name;
    }
}

export function UpdateJobDraftRequest_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.JobApi.UpdateJobDraftRequest", [], UpdateJobDraftRequest, () => [["id", class_type("System.Guid")], ["name", option_type(string_type)]]);
}

export class IJobApi extends Record {
    readonly myJobs: (() => Async<FSharpResult$2_$union<MyJobsResponse, void>>);
    readonly createDraft: (() => Async<FSharpResult$2_$union<string, void>>);
    constructor(myJobs: (() => Async<FSharpResult$2_$union<MyJobsResponse, void>>), createDraft: (() => Async<FSharpResult$2_$union<string, void>>)) {
        super();
        this.myJobs = myJobs;
        this.createDraft = createDraft;
    }
}

export function IJobApi_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.JobApi.IJobApi", [], IJobApi, () => [["myJobs", lambda_type(unit_type, class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [MyJobsResponse_$reflection(), unit_type], FSharpResult$2, () => [[["ResultValue", MyJobsResponse_$reflection()]], [["ErrorValue", unit_type]]])]))], ["createDraft", lambda_type(unit_type, class_type("Microsoft.FSharp.Control.FSharpAsync`1", [union_type("Microsoft.FSharp.Core.FSharpResult`2", [class_type("System.Guid"), unit_type], FSharpResult$2, () => [[["ResultValue", class_type("System.Guid")]], [["ErrorValue", unit_type]]])]))]]);
}

