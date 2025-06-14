<template>
    <div>
        <div class="prose">
            <NuxtLink to="/" class="no-underline">
                <h2 class="text-white m-0">Musical Chairs</h2>
            </NuxtLink>
        </div>
        <Card class="p-4 bg-background">
            <CardHeader>
                <CardTitle>Sign up for free</CardTitle>
            </CardHeader>
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
                <div class="flex flex-col gap-4">
                    <Transition name="fade" mode="out-in">
                        <div
                            key="Submit"
                            v-if="
                                validPasswordLength &&
                                validPasswordHasLower &&
                                validPasswordHasUpper &&
                                validPasswordHasDigit &&
                                validPasswordHasSpecial
                            "
                            class="w-full"
                        >
                            <Button
                                type="submit"
                                class="w-full shadow-square-sm"
                                :disabled="!form.meta.value.valid"
                            >
                                {{
                                    !submitting ? "Register" : "Registering..."
                                }}
                            </Button>
                        </div>
                        <div v-else key="Password Requirements">
                            <div
                                class="rounded-md border border-ms-accent mt-4 p-2 text-sm transition-all"
                                :class="{
                                    'opacity-50 hidden':
                                        validPasswordLength &&
                                        validPasswordHasLower &&
                                        validPasswordHasUpper &&
                                        validPasswordHasDigit &&
                                        validPasswordHasSpecial,
                                }"
                            >
                                <label class="italic"
                                    >Password Requirements</label
                                >
                                <section
                                    class="grid grid-flow-row grid-cols-1 lg:grid-cols-2"
                                >
                                    <div>
                                        <FontAwesomeIcon
                                            :icon="
                                                validPasswordLength
                                                    ? 'check'
                                                    : 'x'
                                            "
                                            :class="
                                                validPasswordLength
                                                    ? 'text-primary'
                                                    : 'text-destructive'
                                            "
                                        />
                                        6 or more characters
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            :icon="
                                                validPasswordHasLower
                                                    ? 'check'
                                                    : 'x'
                                            "
                                            :class="
                                                validPasswordHasLower
                                                    ? 'text-primary'
                                                    : 'text-destructive'
                                            "
                                        />
                                        At least one lowercase character
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            :icon="
                                                validPasswordHasUpper
                                                    ? 'check'
                                                    : 'x'
                                            "
                                            :class="
                                                validPasswordHasUpper
                                                    ? 'text-primary'
                                                    : 'text-destructive'
                                            "
                                        />
                                        At least one uppercase character
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            :icon="
                                                validPasswordHasDigit
                                                    ? 'check'
                                                    : 'x'
                                            "
                                            :class="
                                                validPasswordHasDigit
                                                    ? 'text-primary'
                                                    : 'text-destructive'
                                            "
                                        />
                                        At least one digit
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            :icon="
                                                validPasswordHasSpecial
                                                    ? 'check'
                                                    : 'x'
                                            "
                                            :class="
                                                validPasswordHasSpecial
                                                    ? 'text-primary'
                                                    : 'text-destructive'
                                            "
                                        />
                                        At least one special character
                                    </div>
                                </section>
                            </div>
                        </div>
                    </Transition>
                    <Separator label="Or" />
                    <NuxtLink
                        to="/login"
                        class="text-sm cursor-pointer text-center"
                    >
                        <span class="underline">Login instead</span>
                    </NuxtLink>
                </div>
            </AutoForm>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
import { RegisterRequest } from "~/utils/generated/MusicalChairs.Shared/Apis/UserApi";

definePageMeta({
    layout: "auth",
});

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

const api = useApi();
async function onSubmit(data: RegisterDto) {
    const result = await api.user.register(
        new RegisterRequest(data.email, data.password)
    );
    if (result.name === "Error") {
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

    await navigateTo("/app/home");
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
