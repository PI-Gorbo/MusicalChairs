import { head } from './utils/generated/fable_modules/fable-library-ts.4.24.0/Array';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@pinia/nuxt"],
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
    }
});