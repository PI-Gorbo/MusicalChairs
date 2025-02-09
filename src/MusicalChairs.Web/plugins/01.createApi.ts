import { createApi } from "~/utils/generated/UserApi"

export default defineNuxtPlugin(nuxtApp => {

    const runtimeConig = useRuntimeConfig()
    const api = createApi(runtimeConig.public.apiUrl)

    return {
        provide: {
            api
        }
    }
})