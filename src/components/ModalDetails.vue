<template>
    <v-dialog v-model="isOpen" max-width="1000px">
      <v-card>
        <v-card-title class="container">
          <strong>Nome Registro:</strong> {{ registro?.title }}
        </v-card-title>
        <v-card-text>

            <v-row>
                <v-col cols="3">
                    <v-text-field v-model="nuovaData" label="Data" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field v-model="nuoveOre" label="Ore" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field v-model="nuoviMinuti" label="Minuti" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-btn @click="aggiungiDettaglio()">Aggiungi</v-btn>
                </v-col>
            </v-row>
  
          <v-table class="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Ore</th>
                <th>Minuti</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(riga, index) in registroDettagli" :key="index">
                <td>{{ riga.nuovaData }}</td>
                <td>{{ riga.nuoveOre }}</td>
                <td>{{ riga.nuoviMinuti }}</td>
                <td>
                  <v-btn color="red" small @click="rimuoviRiga(index)">Elimina</v-btn>
                </td>
              </tr>
              <tr v-if="registroDettagli.length === 0">
                <td colspan="4">Nessun dettaglio presente.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="chiudi">Chiudi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, defineExpose } from "vue";
  import GestoreRighe from "../componentsjs/GestoreRighe"; // Importa il tuo gestore
  
  // Crea un'istanza del gestore per gestire i dati
  const gestore = new GestoreRighe();
  const isOpen = ref(false);
  const registro = ref(null);
  const registroDettagli = ref({});
  const nuovaData = ref("");
  const nuoveOre = ref("");
  const nuoviMinuti = ref("");
  
  // Metodo per aprire la modale e caricare i dettagli
  const apri = (datiRegistro) => {
    registro.value = datiRegistro;
    registroDettagli.value = [...(datiRegistro.dettagli || [])]; // Assicurati che i dettagli siano già presenti
    isOpen.value = true;
  };
  
  // Metodo per chiudere la modale
  const chiudi = () => {
    isOpen.value = false;
  };

  const aggiungiDettaglio = () => {
    const dizionario = {
            nuovaData: nuovaData.value,   // Passa il valore di nuovaData
            nuoveOre: nuoveOre.value,     // Passa il valore di nuoveOre
            nuoviMinuti: nuoviMinuti.value // Passa il valore di nuoviMinuti
        };

        // Aggiungi la riga dettagli alla lista
        gestore.aggiungiRigaDettagli(registro.value.id, dizionario);

        // Aggiungi la riga ai dettagli del registro
        registroDettagli.value.push(dizionario);

        // Pulisci i campi dopo aver aggiunto i dati
        nuovaData.value = '';
        nuoveOre.value = '';
        nuoviMinuti.value = '';
    }

  
  // Espone il metodo apri() al componente principale
  defineExpose({ apri });
  </script>
  
  <style>
  .container {
    text-align: center;
  }
  
  .table {
    margin: 20px auto;
    border-collapse: collapse;
    width: 100%;
  }
  
  .table th,
  .table td {
    border: 1px solid black;
    padding: 10px;
    text-align: center;
  }
  </style>
  