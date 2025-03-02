import { Union, Record } from "../../../fable_modules/fable-library-ts.4.24.0/Types.js";
import { IComparable, IEquatable } from "../../../fable_modules/fable-library-ts.4.24.0/Util.js";
import { list_type, uint32_type, class_type, union_type, record_type, string_type, TypeInfo } from "../../../fable_modules/fable-library-ts.4.24.0/Reflection.js";
import { EmailTemplate_$reflection, EmailTemplate } from "../Email/Email.js";
import { uint32 } from "../../../fable_modules/fable-library-ts.4.24.0/Int32.js";
import { FSharpList } from "../../../fable_modules/fable-library-ts.4.24.0/List.js";

export class EmailDetails extends Record implements IEquatable<EmailDetails>, IComparable<EmailDetails> {
    readonly EmailAddress: string;
    constructor(EmailAddress: string) {
        super();
        this.EmailAddress = EmailAddress;
    }
}

export function EmailDetails_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.Job.EmailDetails", [], EmailDetails, () => [["EmailAddress", string_type]]);
}

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

export class ContactMethod extends Union<0, "Email"> {
    constructor(Item: EmailDetails) {
        super();
        this.tag = 0;
        this.fields = [Item];
    }
    readonly tag: 0;
    readonly fields: [EmailDetails];
    cases() {
        return ["Email"];
    }
}

export function ContactMethod_$reflection(): TypeInfo {
    return union_type("MusicalChairs.Shared.Apis.Job.ContactMethod", [], ContactMethod, () => [[["Item", EmailDetails_$reflection()]]]);
}

export class DraftContact extends Record implements IEquatable<DraftContact>, IComparable<DraftContact> {
    readonly Name: string;
    readonly UserId: string;
    readonly TemplateId: string;
    readonly ContactMethod: ContactMethod;
    constructor(Name: string, UserId: string, TemplateId: string, ContactMethod: ContactMethod) {
        super();
        this.Name = Name;
        this.UserId = UserId;
        this.TemplateId = TemplateId;
        this.ContactMethod = ContactMethod;
    }
}

export function DraftContact_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.Job.DraftContact", [], DraftContact, () => [["Name", string_type], ["UserId", class_type("System.Guid")], ["TemplateId", class_type("System.Guid")], ["ContactMethod", ContactMethod_$reflection()]]);
}

export class DraftPosition extends Record implements IEquatable<DraftPosition>, IComparable<DraftPosition> {
    readonly PositionName: string;
    readonly PositionsAvailable: uint32;
    readonly Contacts: FSharpList<DraftContact>;
    constructor(PositionName: string, PositionsAvailable: uint32, Contacts: FSharpList<DraftContact>) {
        super();
        this.PositionName = PositionName;
        this.PositionsAvailable = PositionsAvailable;
        this.Contacts = Contacts;
    }
}

export function DraftPosition_$reflection(): TypeInfo {
    return record_type("MusicalChairs.Shared.Apis.Job.DraftPosition", [], DraftPosition, () => [["PositionName", string_type], ["PositionsAvailable", uint32_type], ["Contacts", list_type(DraftContact_$reflection())]]);
}

