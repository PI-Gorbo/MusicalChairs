<template>
    <div>
        <div class="prose">
            <NuxtLink to="/" class="no-underline">
                <h2 class="text-white m-0">Musical Chairs</h2>
            </NuxtLink>
        </div>
        <Card class="p-4 bg-background">
            <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
            </CardHeader>
            <AutoForm
                :form="form"
                :schema="loginSchema"
                :fieldConfig="{
                    email: {
                        inputProps: {
                            type: 'email',
                            class: 'text-black',
                        },
                    },
                    password: {
                        inputProps: {
                            type: 'password',
                            class: 'text-black ',
                        },
                    },
                }"
                :handleSubmit="onSubmit"
                v-slot="{ submitting }"
            >
                <div class="flex flex-col gap-4">
                    <div
                        v-if="submitError != null"
                        class="border border-dashed border-destructive bg-destructive text-destructive-foreground rounded text-sm px-4"
                    >
                        {{ submitError }}
                    </div>
                    <div
                        class="flex flex-col gap-2 justify-between items-center"
                    >
                        <Button type="submit" class="w-full shadow-square-sm">
                            {{ !submitting ? "Login" : "Logging in..." }}
                        </Button>
                        <NuxtLink
                            to="/anonymous-request-reset-password"
                            class="underline text-sm cursor-pointer"
                        >
                            Forgot your password?
                        </NuxtLink>
                    </div>

                    <Separator label="Or" />
                    <div class="w-full flex justify-center items-center">
                        <NuxtLink
                            to="/register"
                            class="underline text-sm cursor-pointer"
                        >
                            Create an account
                        </NuxtLink>
                    </div>
                </div>
            </AutoForm>
        </Card>
    </div>
</template>
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";

definePageMeta({
    layout: "auth",
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string({
        required_error: "A password is required",
    }),
});
type LoginDto = z.infer<typeof loginSchema>;

const form = useForm({
    validationSchema: toTypedSchema(loginSchema),
});

const submitError = ref<string | null>(null);
async function onSubmit(data: LoginDto) {
    submitError.value = null;

    const result = await useUserStore().login(data.email, data.password);
    if (result.error) {
        submitError.value = result.errorMessage;
        return;
    }
}
</script>
