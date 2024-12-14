namespace MusicalChairs.Api.Domain.ContactMethodProcessor

open FsToolkit.ErrorHandling
open MusicalChairs.Api.Domain.Job

module ContactMethodProcessor =
    type IContactMethodProcessor<'Method> =
        abstract member PublishMessage : Contact -> 'Method -> TaskResult<unit, string>

    type EmailProcessor() =
        interface
