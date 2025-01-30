<template>
  <IonPage>
    <IonButton @click="clickData.refresh">
      {{ clickData.data ?? 'UNKNOWN' }}
    </IonButton>
  </IonPage>
</template>
<script setup lang="ts">
import {count} from '~/utils/generated/Library';

const clickData = useAsyncData(count)


</script>
