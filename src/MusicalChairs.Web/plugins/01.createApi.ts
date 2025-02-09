import { createApi } from "~/utils/generated/UserApi"

export default defineNuxtPlugin(nuxtApp => {

    const api = createApi("/api/")

    return {
        provide: {
            api
        }
    }
})