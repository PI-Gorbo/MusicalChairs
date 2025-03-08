<template>
    <main>
        <Stepper>
            <StepperItem :step="1">
                <StepperTrigger>
                    <StepperIndicator>1</StepperIndicator>
                    <StepperTitle>Step 1</StepperTitle>
                    <StepperDescription
                        >This is the first step</StepperDescription
                    >
                </StepperTrigger>
                <StepperSeparator />
            </StepperItem>
            <StepperItem :step="2">
                <StepperTrigger>
                    <StepperIndicator>2</StepperIndicator>
                    <StepperTitle>Step 2</StepperTitle>
                    <StepperDescription
                        >This is the second step</StepperDescription
                    >
                </StepperTrigger>
            </StepperItem>
        </Stepper>
        {{ draftJob.data }}
    </main>
</template>
<script setup lang="ts">
const api = useApi();

const id: string = useRoute().params.id as string;
const draftJob = useAsyncData("draft-job", async () => {
    const value = await api.job.getDraftJob(id);
    if (value.name == "Ok") {
        return value.fields[0];
    } else {
        throw new Error(value.fields[0]);
    }
});

definePageMeta({
    requiresAuth: true,
    layout: "logged-in",
});
</script>
