<template>
    <Tabs :modelValue="useRoute().path">
        <TabsList
            class=""
            :class="{
                'w-full border-t border-black rounded-none py-2': displayMode.isMobile.value,
                'border border-black shadow-square-sm': displayMode.isWeb.value,
            }"
        >
            <TabsTrigger value="/app/drafts" v-ripple>
                <NuxtLink to="/app/drafts" class="flex items-center gap-1">
                    <FontAwesomeIcon
                        :icon="faAddressBook"
                        :size="displayMode.isMobile.value ? '2xl' : 'lg'"
                    />
                    <div>Drafts</div>
                </NuxtLink>
            </TabsTrigger>
            <TabsTrigger value="/app/home" v-ripple>
                <NuxtLink to="/app/home" class="flex items-center gap-1">
                    <FontAwesomeIcon
                        :icon="faHouse"
                        :size="displayMode.isMobile.value ? '2xl' : 'lg'"
                    />
                    <div>Home</div>
                </NuxtLink>
            </TabsTrigger>
            <TabsTrigger value="/app/profile" v-ripple>
                <NuxtLink to="/app/profile" class="flex items-center gap-1">
                    <FontAwesomeIcon
                        :icon="faCircleUser"
                        :size="displayMode.isMobile.value ? '2xl' : 'lg'"
                    />
                    <div>Profile</div>
                </NuxtLink>
            </TabsTrigger>
        </TabsList>
    </Tabs>
</template>

<script setup lang="ts">
import {
    faAddressBook,
    faCircleUser,
    faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const displayMode = useDisplayMode();
</script>
