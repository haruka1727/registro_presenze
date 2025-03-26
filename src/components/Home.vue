<template>
    <div class="container">

      <v-row class="justify-center mt-4">
        <v-col cols="auto">
          <h1>Registro presenze</h1>
        </v-col>
        <v-col cols="auto">
          <v-btn class="add-button" @click="apriModale" icon="mdi-plus" color="secondary"></v-btn>
        </v-col>
      </v-row>

      <modal-add-row ref="modale" title="Aggiungi Registro" @salva="aggiungiRegistro">
        <v-form ref="form">
          <v-text-field 
            v-model="nuovoTitolo" 
            label="Titolo"
            variant="outlined"
            :rules="[v => !!v || 'Campo obbligatorio']">
          </v-text-field>
          <v-text-field 
            v-model="oreTotali" 
            label="Ore totali"
            variant="outlined"
            :rules="[v => !!v || 'Campo obbligatorio', v => /^\d+$/.test(v) || 'Deve essere un numero']">
          </v-text-field>
          <v-text-field 
            v-model="percentualePresenza" 
            label="Percentuale presenza"
            variant="outlined"
            :rules="[v => !!v || 'Campo obbligatorio', v => /^\d+$/.test(v) || 'Deve essere un numero']">
          </v-text-field>
          <v-text-field 
            v-model="oreGiornaliere" 
            label="Ore giornaliere"
            variant="outlined"
            :rules="[v => !!v || 'Campo obbligatorio', v => /^\d+$/.test(v) || 'Deve essere un numero']">
          </v-text-field>
        </v-form>   
      </modal-add-row>
      
      <table class="table mt-10">
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Ore Totali</th>
            <th>Presenza</th>
            <th>Ore giornaliere</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(registro, index) in registri" :key="index">
            <td>{{ registro.title }}</td>
            <td>{{ registro.hours }}</td>
            <td>{{ registro.perc}}%</td>
            <td>{{ registro.hoursDay}}</td>
            <td>
              <v-btn @click="vaiADettagli(registro)" icon="mdi-list-box" color="primary"></v-btn>
              <v-btn @click.stop="rimuoviRiga(registro.id)"icon="mdi-delete" class="ml-2" color="secondary"></v-btn>
            </td>
          </tr>
          <tr v-if="registri.length === 0">
            <td colspan="5">Nessun registro presente.</td>
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
  const oreTotali = ref(''); 
  const percentualePresenza = ref('');
  const oreGiornaliere = ref('')
  const modale = ref(null); // Riferimento alla modale
  const modalDetails = ref(null); // Riferimento alla modale
  const form = ref(null);
  
    const caricaRegistri = () => {
        registri.value = gestore.righe;
    };
  
    const aggiungiRegistro = async () => {
        await nextTick(); // Assicura che il form sia completamente renderizzato
        const { valid } = await form.value.validate(); 
          if (!valid) {
            console.log("Errore: dati non validi!");
            return; // Esce dalla funzione se i dati non sono validi
          }
        gestore.aggiungiRiga(nuovoTitolo.value, oreTotali.value, percentualePresenza.value, oreGiornaliere.value);
        registri.value = [...gestore.righe]; // Forza la reattività
        nuovoTitolo.value = ''; 
        oreTotali.value = ''; 
        percentualePresenza.value = '';
        oreGiornaliere.value = '';


        await nextTick();
        form.value.resetValidation()
        // Chiude la modale solo dopo la validazione
        modale.value.chiudi(); 
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

  .table th,
  .table td {
    border: 1px solid rgb(4, 91, 132);
    padding: 10px;
    text-align: center;
  } 
  </style>
  