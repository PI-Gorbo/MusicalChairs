export function useApi() {

    const nuxtApp = useNuxtApp()
    const appStateStore = useAppStateStore()
    const api = nuxtApp.$api

    function handleError(error) {
        appStateStore.setError("Something went wrong!", error)
        return error;
    }

    function wrapper<T extends { [key: string]: ((arg: any) => Promise<any>) | (() => Promise<any>) | T }>(api: T): T {
        let entries = Object.entries(api)
            .map(([key, value]) => {
                if (typeof value == 'object') {
                    return [key, wrapper(value)]
                }

                return [key, (arg) => value(arg).catch(handleError)]
            })

        return Object.fromEntries(entries)
    }

    return {
        user: wrapper(api)
    }
}