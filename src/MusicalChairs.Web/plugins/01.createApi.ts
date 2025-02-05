import { createApi } from "~/utils/generated/UserApi"

export default defineNuxtPlugin(nuxtApp => {

    const api = createApi(nuxtApp.$config.public.apiUrl as string)

    return {
        provide: {
            api
        }
    }
})