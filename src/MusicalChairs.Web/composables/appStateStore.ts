export const useAppStateStore = defineStore('app-store', () => {
    const state = reactive<{
        error: null | {
            errorMessage: string,
            error: Error
        }
    }>({
        error: null
    })

    const hasError = computed(() => state.error != null)

    function setError(errorMessage: string, error: Error) {
        state.error = {
            errorMessage,
            error
        }
    }

    function resetError() {
        state.error = null
    }

    return {
        state,
        hasError,
        setError,
        resetError
    }
})