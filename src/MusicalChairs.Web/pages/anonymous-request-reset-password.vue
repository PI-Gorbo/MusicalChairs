<template>
    <div>
        <div class="prose">
            <NuxtLink to="/" class="no-underline">
                <h2 class="text-white m-0">Musical Chairs</h2>
            </NuxtLink>
        </div>
        <Card class="p-4 bg-background">
            <CardHeader>
                <CardTitle>Forgot your password?</CardTitle>
            </CardHeader>
            <header class="text-muted-foreground">
                Give us your email, and if we find a matching account, we'll
                send you a link to reset your password.
            </header>
            <AutoForm
                :form="form"
                :schema="emailSchema"
                :fieldConfig="{
                    email: {
                        inputProps: {
                            type: 'email',
                            class: 'text-black',
                        },
                    },
                }"
                :handleSubmit="onSubmit"
                v-slot="{ submitting }"
            >
                <div class="flex gap-2 justify-between items-center">
                    <Button type="submit">
                        {{
                            !submitting
                                ? "Request Reset Password Email"
                                : "Requesting..."
                        }}
                    </Button>
                    <NuxtLink
                        to="/login"
                        class="underline text-sm cursor-pointer"
                    >
                        Try logging in instead
                    </NuxtLink>
                </div>
                <div
                    v-if="showSubmitted"
                    class="border border-accent rounded flex gap-4"
                >
                    <div class="flex justify-center items-center px-4">
                        <FontAwesomeIcon :icon="faCheck" />
                    </div>
                    <div clas="text-sm text-muted-foreground">
                        If a user with email the email
                        {{ form.values.email }} exists, we will send a password
                        reset email now.
                    </div>
                </div>
            </AutoForm>
        </Card>
    </div>
</template>
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { refDebounced } from "@vueuse/core";
import { useForm } from "vee-validate";
import { z } from "zod";
import { RequestResetPasswordTokenRequest } from "~/utils/generated/MusicalChairs.Shared/UserApi/UserApi";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

definePageMeta({
    layout: "auth",
});

const emailSchema = z.object({
    email: z.string().email(),
});
type ResetEmailDto = z.infer<typeof emailSchema>;

const form = useForm({
    validationSchema: toTypedSchema(emailSchema),
});

const showSubmitted = ref(false);
async function onSubmit(data: ResetEmailDto) {
    const result = await useApi().user.requestResetPasswordToken(
        new RequestResetPasswordTokenRequest(data.email)
    );
    showSubmitted.value = true;
}
</script>
