import { ActiveJobDto, DraftJobDto, MyJobsResponse } from "~/utils/generated/MusicalChairs.Shared/Apis/Job/JobApi"

export const useJobStore = defineStore('job-store', () => {
    const api = useApi()



    const state = reactive<{
        myJobs: {
            activeJobs: ActiveJobDto[],
            draftJobs: DraftJobDto[]
        }
    }>({
        myJobs: {
            activeJobs: [],
            draftJobs: []
        }
    })

    async function init() {
        const myJobs = await api.job.myJobs()
        if (myJobs.name == 'Ok') {
            state.myJobs.activeJobs = [...myJobs.fields[0].activeJobs]
            state.myJobs.draftJobs = [...myJobs.fields[0].draftJobs]
        }
    }

    return {
        refresh: init,
        state
    }
})