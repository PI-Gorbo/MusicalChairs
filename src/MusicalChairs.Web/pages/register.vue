<template>
    <main class="flex justify-center items-center h-full bg-accent">
        <div class="bg-primary text-primary-foreground p-4 w-2/5 rounded shadow shadow-ms-primary">
            <header>Register</header>
            <AutoForm
                :schema="loginSchema"
                :fieldConfig="{
                    email: {
                        inputProps: {
                            class: 'text-black ',
                        },
                    },
                    password: {
                        inputProps: {
                            type: 'password',
                            class: 'text-black ',
                        },
                    },
                    confirmPassword: {
                        inputProps: {
                            type: 'password',
                            class: 'text-black ',
                        },
                    },
                }"
                @submit="() => {

                }"
                v-slot="{submitting}"
            >
                <Button type="submit" class="bg-ms-accent text-ms-accent-foreground hover:bg-ms-accent hover:brightness-90 mt-4">
                    {{ !submitting ? 'Login' : 'Logging in...' }}
                </Button>
        </AutoForm>
        </div>
    </main>
</template>
<script setup lang="ts">
import { z } from "zod";

const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
});
</script>
