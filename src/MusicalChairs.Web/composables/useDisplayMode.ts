export function useDisplayMode() {

    const { isMobile } = useDevice()

    const mode = computed(() => isMobile ? 'Mobile' : 'Web')
    return {
        mode,
        isMobile: computed(() => mode.value == 'Mobile'),
        isWeb: computed(() => mode.value == 'Web')
    }
}