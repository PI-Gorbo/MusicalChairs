import { Record } from "../../../fable_modules/fable-library-ts.4.24.0/Types.js";
import { IComparable, IEquatable } from "../../../fable_modules/fable-library-ts.4.24.0/Util.js";
import { record_type, string_type, TypeInfo } from "../../../fable_modules/fable-library-ts.4.24.0/Reflection.js";

export class EmailTemplate extends Record implements IEquatable<EmailTemplate>, IComparable<EmailTemplate> {
    readonly html: string;
    constructor(html: string) {
        super();
        this.html = html;
    }
}

export function EmailTemplate_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.Email.EmailTemplate", [], EmailTemplate, () => [["html", string_type]]);
}

