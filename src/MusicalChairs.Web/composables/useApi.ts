import { userApi } from "~/utils/generated/UserApi";

export function useApi() {

    // function wrapper<T extends { [key: string]: ((arg: any) => Promise<any>) | (() => Promise<any>) | T }>(api: T): T {
    //     let entries = Object.entries(api)
    //         .map(([key, value]) => {
    //             if (typeof value == 'object') {
    //                 return [key, wrapper(value)]
    //             }

    //             return [key, (arg) => value(arg).catch((error) => {
    //                 debugger;
    //                 console.log('Something went wrong!', error)
    //                 return error;
    //             })]
    //         })

    //     return Object.fromEntries(entries)
    // }

    return {
        user: userApi
    }
}