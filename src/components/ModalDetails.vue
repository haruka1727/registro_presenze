<template>
    <v-dialog v-model="isOpen" max-width="1000px">
      <v-card>
        <v-card-title class="container">
          <strong>Nome Registro:</strong> {{ registro?.title }}
        </v-card-title>
        <v-card-text>

          <v-form ref="form">
            <v-row>
              <v-col cols="3">
                <v-text-field 
                  v-model="nuovaData" 
                  label="Data" 
                  variant="outlined"
                  :rules="[v => !!v || 'Campo obbligatorio']"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field 
                  v-model="nuoveOre" 
                  label="Ore" 
                  variant="outlined"
                  :rules="[v => !!v || 'Campo obbligatorio', v => /^\d+$/.test(v) || 'Deve essere un numero']"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field 
                  v-model="nuoviMinuti" 
                  label="Minuti" 
                  variant="outlined"
                  :rules="[v => !!v || 'Campo obbligatorio', v => /^\d+$/.test(v) || 'Deve essere un numero']"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-btn @click="aggiungiDettaglio">Aggiungi</v-btn>
              </v-col>
            </v-row>
          </v-form>

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
  const form = ref(null);
  
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

  const aggiungiDettaglio = async () => {
    const { valid } = await form.value.validate(); // Usa await per attendere la validazione (il validate restituisce una promise)

      if (!valid) {
          console.log("Errore: dati non validi!");
          return; // Esce dalla funzione se i dati non sono validi
      }

      console.log("Dati validi, aggiungo il dettaglio!");
      
      const dizionario = {
          nuovaData: nuovaData.value,
          nuoveOre: nuoveOre.value,
          nuoviMinuti: nuoviMinuti.value
      };

      // Aggiungi la riga dettagli alla lista
      gestore.aggiungiRigaDettagli(registro.value.id, dizionario);
      registroDettagli.value.push(dizionario);

      // Pulisci i campi dopo aver aggiunto i dati
      nuovaData.value = '';
      nuoveOre.value = '';
      nuoviMinuti.value = '';
  };

  
    const rimuoviRiga = (index) => {
    // Rimuovi direttamente dal gestore
      gestore.rimuoviRigaDettagli(registro.value.id, index);

      // Ricarica i dettagli aggiornati dal gestore
      registroDettagli.value = [...gestore.righe.find(r => r.id === registro.value.id)?.dettagli || []];
    };


  
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
  