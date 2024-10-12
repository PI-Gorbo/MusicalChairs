<template>
    <IonMenu menu-id="main-content-menu" content-id="main-content">
        <IonContent>
            <RouterItem label="Home" routerLink="/home" @click="closeMenu" />
            <RouterItem
                label="Entires"
                routerLink="/entires"
                @click="closeMenu"
            />
            <RouterItem
                label="Settings"
                routerLink="/settings"
                @click="closeMenu"
            />
        </IonContent>
    </IonMenu>

    <IonRouterOutlet id="main-content"></IonRouterOutlet>
</template>

<script setup lang="ts">
import RouterItem from "@/components/Menu/RouterItem.vue";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonMenu,
    IonRouterOutlet,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonIcon,
    menuController,
} from "@ionic/vue";
import { menuOutline } from "ionicons/icons";
import { useRouter } from "vue-router";

const closeMenu = () => menuController.close("main-content-menu");
const router = useRouter();
</script>
