<template>
    <div class="container">
      <h1>Registro presenze</h1>
      <v-btn class="add-button" @click="apriModale">Aggiungi Registro</v-btn>
      <modal-add-row ref="modale" title="Aggiungi Registro" @salva="aggiungiRegistro">
        <v-text-field v-model="nuovoTitolo" label="Titolo"></v-text-field>
      </modal-add-row>
      
      <table class="table">
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(registro, index) in registri" :key="index" class="clickable-row">
            <td>{{ registro.title }}</td>
            <td>
              <v-btn @click="vaiADettagli(registro)">Dettagli</v-btn>
              <v-btn @click.stop="rimuoviRiga(registro.id)">Elimina</v-btn>
            </td>
          </tr>
          <tr v-if="registri.length === 0">
            <td colspan="2">Nessun registro presente.</td>
          </tr>
        </tbody>
      </table>
        <modal-details ref="modalDetails"></modal-details>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import GestoreRighe from '../componentsjs/GestoreRighe';
  import ModalAddRow from './ModalAddRow.vue'; // Importa la modale generica
  import ModalDetails from './ModalDetails.vue'; // Importa la modale generica
  
  const gestore = new GestoreRighe();
  const registri = ref([]);
  const nuovoTitolo = ref(''); // Variabile per il titolo del nuovo registro
  const modale = ref(null); // Riferimento alla modale
  const modalDetails = ref(null); // Riferimento alla modale
  
    const caricaRegistri = () => {
        registri.value = gestore.righe;
    };
  
    const aggiungiRegistro = () => {
        gestore.aggiungiRiga(nuovoTitolo.value);
        registri.value = [...gestore.righe]; // Forza la reattività
        nuovoTitolo.value = ''; 
    };

    const rimuoviRiga = (registroId) => {
        gestore.rimuoviRiga(registroId);
        registri.value = [...gestore.righe]; // Aggiorna la lista in modo reattivo
    };

  
    const apriModale = () => {
        modale.value.apri(); // Chiama il metodo apri della modale
    };

    const vaiADettagli = (registro) => {
        modalDetails.value.apri(registro);
    };

  
  // Carica i registri quando il componente è montato
  onMounted(() => {
    caricaRegistri(); 
  });
  </script>
  
  <style>
  .container {
    text-align: center;
  }
  
  .table {
    margin: 20px auto;
    border-collapse: collapse;
    width: 50%;
  }
  
  .table th,
  .table td {
    border: 1px solid black;
    padding: 10px;
    text-align: center;
  } 
  </style>
  