<template>
    <main class="flex justify-center items-center bg-primary h-full">
        <Card class="p-4 bg-background border-primary w-9/12 xl:w-1/3">
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
                <div
                    v-if="submitError != null"
                    class="border border-dashed border-destructive bg-destructive text-destructive-foreground rounded"
                >
                    {{ submitError }}
                </div>

                <div class="flex justify-between items-center mt-4">
                    <Button type="submit">
                        {{ !submitting ? "Login" : "Logging in..." }}
                    </Button>

                    <NuxtLink
                        to="/register"
                        class="underline text-sm cursor-pointer"
                    >
                        Register Instead
                    </NuxtLink>
                </div>
            </AutoForm>
        </Card>
    </main>
</template>
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import type { ArgumentsType } from "@vueuse/core";
import { useForm, type SubmissionContext } from "vee-validate";
import { z } from "zod";
import { LoginRequest } from "~/utils/generated/MusicalChairs.Shared/UserApi/UserApi";
import { userApi } from "~/utils/generated/UserApi";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string({
        required_error: "A password is required",
    }),
});

const form = useForm({
    validationSchema: toTypedSchema(loginSchema),
});

const submitError = ref<string | null>(null);
async function onSubmit(data: LoginDto) {
    submitError.value = null;
    const result = await userApi.login(
        new LoginRequest(data.email, data.password)
    );
    if (result.name === "Error") {
        submitError.value = result.fields[0];
        return;
    }

    await navigateTo("/home");
}

type LoginDto = z.infer<typeof loginSchema>;
</script>
