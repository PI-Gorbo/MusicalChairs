export function useDisplayMode() {
    const { $pwa } = useNuxtApp();
    const mode = computed(() => $pwa.isPWAInstalled ? 'Mobile' : 'Web')
    return {
        mode,
        isMobile: computed(() => mode.value == 'Mobile'),
        isWeb: computed(() => mode.value == 'Web')
    }
}