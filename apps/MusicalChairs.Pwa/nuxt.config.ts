// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    modules: ['@nuxtjs/ionic', '@vite-pwa/nuxt'],
    pwa: {
        registerWebManifestInRouteRules: true,
        client: {
            installPrompt: true,
        },
        strategies: 'injectManifest',
        registerType: 'autoUpdate',
        manifest: {
            name: 'Musical Chairs',
            short_name: 'MusicalChairs',
            theme_color: '#ffffff',
            icons: [
                {
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
            ],
        },
        workbox: {
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        },
        injectManifest: {
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        },
    },
})
