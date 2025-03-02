// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: [
        "nuxt-typed-router",
        "@nuxtjs/tailwindcss",
        "shadcn-nuxt",
        "@pinia/nuxt",
        "@vite-pwa/nuxt",
        "@nuxtjs/device",
        'nuxt-ripple'
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
            name: "Musical Chairs",
            short_name: "Musical Chairs",
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
            suppressWarnings: true
        },
    },
    device: {
        defaultUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36'
    },
    runtimeConfig: {
        public: {
            apiUrl: 'http://localhost:5000',
            device: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36'
        }
    },
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],
    app: {
        head: {
            title: 'Musical Chairs'
        },
        pageTransition: {
            name: 'slide',
            mode: 'out-in'
        },
        layoutTransition: {
            name: 'slide',
            mode: 'out-in'
        }
    },
    typescript: {
        typeCheck: false,
        strict: false
    },
    ripple: {
        color: 'rgba(0, 0, 0, 0.4)',
    },
    routeRules: {
        "/app/**": { ssr: false }
    }
});