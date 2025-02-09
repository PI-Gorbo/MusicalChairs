import { joinURL } from 'ufo'

export default defineEventHandler(async event => {

    // // This api endpoint proxies /api/** requests to the backend api.
    // const rawApiEndpoint = event.path.replace(/^\/api/, '') // Maps from '/api/**' to /**, eg: '/api/user' -> /user

    // const apiUrl = useRuntimeConfig().apiUrl // Get the api url
    // return proxyRequest(event, joinURL(apiUrl, rawApiEndpoint))
})