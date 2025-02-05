import { LogOut } from "lucide-vue-next"
import { defineStore } from "pinia"
import { LoginRequest, type UserDto } from "~/utils/generated/MusicalChairs.Shared/UserApi/UserApi"

export const useUserStore = defineStore('user-store', () => {

    const api = useApi()
    const state = reactive<{
        user: UserDto | null
    }>({
        user: null
    })

    async function init() {
        try {
            const result = await api.user.me()
            if (result.name == 'Error') {
                return { authorized: false }
            }

            state.user = result.fields[0]

            return { authorized: true }
        } catch {
            return { authorized: false }
        }
    }

    async function isLoggedIn() {
        if (state.user != null) {
            return true;
        }

        const result = await init()
        return result.authorized
    }

    async function login(email: string, password: string): Promise<{ error: true; errorMessage: string } | { error: false }> {
        const result = await api.user.login(
            new LoginRequest(email, password)
        );
        if (result.name === "Error") {
            return { error: true, errorMessage: result.fields[0] };
        }

        await init()

        await navigateTo("/home");

        return { error: false }
    }

    async function logout() {
        try {
            if (state.user == null) { return }

            await api.user.logout();

            state.user = null;
            await navigateTo("/");
        } catch {

        }
    }


    return {
        init,
        isLoggedIn,
        logout,
        login
    }
})