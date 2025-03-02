module MusicalChairs.Shared.Apis.Job

open MusicalChairs.Shared.Apis.Email

type TemplateContent =
    | Email of EmailTemplate

type DraftTemplate = {
    name: string
    content: TemplateContent
}
