// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@vite-pwa/nuxt", "@nuxtjs/ionic"],
    pwa: {
        registerType: "autoUpdate",
        registerWebManifestInRouteRules: true,
        manifest: {
            name: "musical chairs",
            short_name: "musical chairs",
            description: "An app about musical chairs...",
            lang: "en",
            orientation: "portrait",
            icons: [
                {
                    src: "band.png",
                    sizes: "512x512",
                    type: "image/png",
                },
            ],
        },
    },
});