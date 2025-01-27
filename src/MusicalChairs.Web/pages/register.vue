<template>
    <main class="flex justify-center items-center h-full bg-accent">
        <div
            class="bg-primary text-primary-foreground p-4 w-3/5 md:w-2/5 rounded shadow shadow-ms-primary"
        >
            <header>Register</header>
            <AutoForm
                :form="form"
                :schema="registerSchema"
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
                    confirmPassword: {
                        inputProps: {
                            type: 'password',
                            class: 'text-black ',
                        },
                    },
                }"
                :handleSubmit="onSubmit"
                v-slot="{ submitting }"
            >
                <div class="rounded-md border border-ms-accent mt-4 p-2">
                    <label class="text-sm italic">Password Requirements</label>
                    <section
                        class="grid grid-flow-row grid-cols-1 lg:grid-cols-2"
                    >
                        <div>
                            <FontAwesomeIcon
                                :icon="validPasswordLength ? 'check' : 'x'"
                            />
                            6 or more characters
                        </div>
                        <div>
                            <FontAwesomeIcon
                                :icon="validPasswordHasLower ? 'check' : 'x'"
                            />
                            At least one lowercase character
                        </div>
                        <div>
                            <FontAwesomeIcon
                                :icon="validPasswordHasUpper ? 'check' : 'x'"
                            />
                            At least one uppercase character
                        </div>
                        <div>
                            <FontAwesomeIcon
                                :icon="validPasswordHasDigit ? 'check' : 'x'"
                            />
                            At least one digit
                        </div>
                        <div>
                            <FontAwesomeIcon
                                :icon="validPasswordHasSpecial ? 'check' : 'x'"
                            />
                            At least one special character
                        </div>
                    </section>
                </div>
                <div class="flex justify-between items-center">
                    <Button
                        type="submit"
                        class="bg-ms-accent text-ms-accent-foreground hover:bg-ms-accent hover:brightness-90 mt-4"
                    >
                        {{ !submitting ? "Register" : "Registering..." }}
                    </Button>

                    <NuxtLink to="/login" class="underline text-sm cursor-pointer">
                        Login Instead
                    </NuxtLink>
                </div>
            </AutoForm>
        </div>
    </main>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { toTypedSchema } from "@vee-validate/zod";
import type { ArgumentsType } from "@vueuse/core";
import { useForm, type SubmissionContext } from "vee-validate";
import { z } from "zod";
import { RegisterRequest } from "~/utils/generated/MusicalChairs.Shared/UserApi/UserApi";
import { register } from "~/utils/generated/UserApi";

const testPasswordLength = (password: string) => password.length >= 6;
const testPasswordHasLower = (p: string) => p.match(/[a-z]/) != null;
const testPasswordHasUpper = (p: string) => p.match(/[A-Z]/) != null;
const testPasswordHasDigit = (p: string) => p.match(/\d/) != null;
const testPasswordHasSpecial = (p: string) => p.match(/[^a-zA-Z0-9]/) != null;

const registerSchema = z
    .object({
        email: z.string().email(),
        password: z
            .string({
                required_error: "A password is required",
            })
            .refine(testPasswordLength, "Must be at least 6 characters long")
            .refine(
                testPasswordHasLower,
                "Must have at least one lowercase character."
            )
            .refine(
                testPasswordHasUpper,
                "Must have at least one uppercase character."
            )
            .refine(
                testPasswordHasDigit,
                "Must have at least one digit character."
            )
            .refine(
                testPasswordHasSpecial,
                "Must have at least one special character."
            ),
        confirmPassword: z.string({
            required_error: "Please confirm your password",
        }),
    })
    .refine(
        (obj) => obj.password == obj.confirmPassword,
        "Passwords do not match."
    );

const form = useForm({
    validationSchema: toTypedSchema(registerSchema),
});


async function onSubmit(data: RegisterDto) {
    const result = await register(new RegisterRequest(data.email, data.password));
    if (result.name === 'Error') {
        // Error
        switch (result.fields[0].name) {
            case "EmailAlreadyRegistered":
                form.setFieldError("email", "Email already registered");
                break;
            case "PasswordInvalid":
                form.setFieldError("password", result.fields[0].fields[0]);
                break;
        }
        return;
    }

    await navigateTo('/home')
}

type RegisterDto = z.infer<typeof registerSchema>;

// Computed Form Password display
const validPasswordLength = computed(() =>
    testPasswordLength(form.values.password ?? "")
);
const validPasswordHasLower = computed(() =>
    testPasswordHasLower(form.values.password ?? "")
);
const validPasswordHasUpper = computed(() =>
    testPasswordHasUpper(form.values.password ?? "")
);
const validPasswordHasDigit = computed(() =>
    testPasswordHasDigit(form.values.password ?? "")
);
const validPasswordHasSpecial = computed(() =>
    testPasswordHasSpecial(form.values.password ?? "")
);
</script>
