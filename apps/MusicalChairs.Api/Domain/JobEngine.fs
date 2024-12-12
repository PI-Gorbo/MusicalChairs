module MusicalChairs.Api.Domain.JobEngine

open System
open System.Threading.Tasks
open FsToolkit.ErrorHandling
open FsToolkit.ErrorHandling.Operator.TaskResult

module JobEngine =

    type MapPlannedCombatDependencies = {
        createExternalUsers: PlannedContact list -> TaskResult<List<Guid>, string>
    }
    let mapPlannedContact (plannedContacts: PlannedContact list) (dependencies: MapPlannedCombatDependencies) : TaskResult<List<Contact>, string> =

        plannedContacts
        |> List.filter(fun pc -> pc.UserId.IsNone)
        |> dependencies.createExternalUsers
        <*> (fun )

        plannedContacts
        |> List.map (fun pc ->
            { UserId = pc.UserId |> Option.defaultValue (Guid.NewGuid())
              State = ContactState.NotContacted
              ContactMethods = pc.ContactMethods })

    let startJob userId (plannedJob: PlannedJob) : IJobEvent list =
        [ JobStarted(
              userId,
              plannedJob.CreatorId,
              plannedJob.Templates,
              plannedJob.Positions
              |> List.map (fun plannedPosition ->
                  { PositionName = plannedPosition.PositionName
                    PositionsAvailable = plannedPosition.PositionsAvailable
                    Contacts = mapPlannedContact plannedPosition.Contacts })
          ) ]

    let stepJob (job : Job) : IJobEvent list = []

module Sample =

    let AlexUserId = Guid.NewGuid()

    let plannedJob: PlannedJob =
        { CreatorId = AlexUserId
          Templates =
            [ { TemplateId = Guid.NewGuid()
                TemplateDetails =
                  Email
                      { TemplatedHtml = Raw "Testing {{testing}} 123"
                        Schema = [ "testing" ] } } ]
          Positions =
            [ { PositionName = "Tenor"
                PositionsAvailable = uint 1
                Contacts =
                  [ { Name = "Alex Gorbatov"
                      ContactMethods = [ ContactMethod.Email { EmailAddress = "alex@gorbatov.com" } ] } ] } ] }

    let job = JobEngine.startJob AlexUserId plannedJob
