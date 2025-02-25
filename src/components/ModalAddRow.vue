<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <slot></slot> <!-- Contenuto dinamico -->
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="chiudi">Annulla</v-btn>
        <v-btn color="blue darken-1" text @click="salva">Salva</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const props = defineProps(['title']);
const emits = defineEmits(['salva']);
const isOpen = ref(false);

const apri = () => {
  isOpen.value = true;
};

const chiudi = () => {
  isOpen.value = false;
};

const salva = () => {
  emits('salva'); // Emette un evento quando si salva
};

defineExpose({ apri, chiudi });
</script>

<style scoped>
/* Aggiungi eventuali stili per la modale qui */
</style>
