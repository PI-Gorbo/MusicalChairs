import { LogOut } from "lucide-vue-next"
import { defineStore } from "pinia"
import type { UserDto } from "~/utils/generated/MusicalChairs.Shared/UserApi/UserApi"

export const useUserStore = defineStore('user-store', () => {

    const api = useApi()
    const state = reactive<{
        user: UserDto | null
    }>({
        user: null
    })

    async function init() {
        const result = await api.user.me()
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

    async function logout() {
        if (state.user == null) { return }

        await api.user.logout();

        state.user = null;
        await navigateTo("/");
    }


    return {
        init,
        isLoggedIn,
        logout
    }
})