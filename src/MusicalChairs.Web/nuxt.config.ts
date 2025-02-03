import { head } from './utils/generated/fable_modules/fable-library-ts.4.24.0/Array';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/tailwindcss",
        "shadcn-nuxt",
        "@pinia/nuxt",
        "nuxt-typed-router",
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
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],
    app: {
        head: {
            title: 'Musical Chairs'
        }
    },
    typescript: {
        typeCheck: false,
        strict: false
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
            theme_color: 'hsl(109 24% 27%)'
        },
        devOptions: {
            suppressWarnings: true
        }
    }
});