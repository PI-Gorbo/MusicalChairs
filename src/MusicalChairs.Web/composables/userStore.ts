import type { UserDto } from "~/utils/generated/MusicalChairs.Shared/UserApi/UserApi"
import { me } from "~/utils/generated/UserApi"

export const useUserStore = defineStore('user-store', () => {

    const state = reactive<{
        user: UserDto | null
    }>({
        user: null
    })

    async function init() {
        const result = await me()
        if (result.name == 'Error') {
            return { authorized: false }
        }

        state.user = result.fields[0]

        return { authorized: true }
    }

    async function isLoggedIn() {
        if (state.user != null) {
            return true;
        }

        const result = await init()
        return result.authorized
    }


    return {
        init,
        isLoggedIn
    }
})