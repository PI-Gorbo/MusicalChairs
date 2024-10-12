<template>
    <ion-page>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton
                        ><ion-icon :icon="menuOutline"></ion-icon
                    ></IonMenuButton>
                </IonButtons>
                Tab 3
            </IonToolbar>
        </IonHeader>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Tab 3</ion-title>
                </ion-toolbar>
            </ion-header>

            <ExploreContainer name="Tab 3 page" />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonContent,
    IonMenuButton,
    IonButtons,
} from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";
import { menuOutline } from "ionicons/icons";
</script>
