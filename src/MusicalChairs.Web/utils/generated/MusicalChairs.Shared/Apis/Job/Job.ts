import { Record, Union } from "../../../fable_modules/fable-library-ts.4.24.0/Types.js";
import { EmailTemplate_$reflection, EmailTemplate } from "../Email/Email.js";
import { record_type, string_type, union_type, TypeInfo } from "../../../fable_modules/fable-library-ts.4.24.0/Reflection.js";
import { IComparable, IEquatable } from "../../../fable_modules/fable-library-ts.4.24.0/Util.js";

export class TemplateContent extends Union<0, "Email"> {
    constructor(Item: EmailTemplate) {
        super();
        this.tag = 0;
        this.fields = [Item];
    }
    readonly tag: 0;
    readonly fields: [EmailTemplate];
    cases() {
        return ["Email"];
    }
}

export function TemplateContent_$reflection(): TypeInfo {
    return union_type("MusicalChairs.Shared.Apis.Job.TemplateContent", [], TemplateContent, () => [[["Item", EmailTemplate_$reflection()]]]);
}

export class DraftTemplate extends Record implements IEquatable<DraftTemplate>, IComparable<DraftTemplate> {
    readonly name: string;
    readonly content: TemplateContent;
    constructor(name: string, content: TemplateContent) {
        super();
        this.name = name;
        this.content = content;
    }
}

export function DraftTemplate_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.Job.DraftTemplate", [], DraftTemplate, () => [["name", string_type], ["content", TemplateContent_$reflection()]]);
}

