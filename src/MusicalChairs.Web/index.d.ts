// from https://nuxt.com/docs/guide/directory-structure/pages#page-metadata
declare module "#app" {
    interface PageMeta {
        requiresAuth: Boolean;
    }
}

// It is always important to ensure you import/export something when augmenting a type
export { };
