module MusicalChairs.Api.Domain.Jobs.JobCommands

open System

type StartJobCommand = { UserId: Guid; PlannedJobId: Guid }
type CreateContactMessageCommand = { JobId: Guid; ContactId: Guid }
type EnqueueContactMessageCommand = { JobId: Guid; ContactId: Guid }

type JobCommand =
    | StartJob of StartJobCommand
    | CreateContactMessage of CreateContactMessageCommand
    | EnqueueContactMessage of EnqueueContactMessageCommand
