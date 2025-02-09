// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: [
        "nuxt-typed-router",
        "@nuxtjs/tailwindcss",
        "shadcn-nuxt",
        "@pinia/nuxt",
        "@vite-pwa/nuxt"
    ],
    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: "",
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: "./components/ui",
    },
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
            theme_color: 'hsl(109 24% 27%)',
        },
        devOptions: {
            enabled: true,
        },
    },
    runtimeConfig: {
        apiUrl: 'http://localhost:5000'
    },
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],
    app: {
        head: {
            title: 'Musical Chairs'
        },
        pageTransition: {
            name: 'page',
            mode: 'out-in'
        }
    },
    typescript: {
        typeCheck: false,
        strict: false
    },
});