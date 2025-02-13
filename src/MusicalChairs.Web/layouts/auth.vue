<template>
    <div>
        <NuxtLayout name="default">
            <main class="flex justify-center items-center bg-primary h-full">
                <div class="w-9/12 xl:w-1/3">
                    <div class="prose">
                        <NuxtLink to="/" class="no-underline">
                            <h2 class="text-white m-0">Musical Chairs</h2>
                        </NuxtLink>
                    </div>
                    <NuxtPage />
                </div>
            </main>
        </NuxtLayout>
    </div>
</template>
