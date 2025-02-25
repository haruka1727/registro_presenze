<template>
  <v-dialog v-model="isOpen" max-width="1000px">
    <v-card>
      <v-card-title class="container">
        <strong>Nome Registro:</strong> {{ registro?.title }}
      </v-card-title>


        <!-- Mostra ore totali e percentuale -->
        <div class="totali">
          <p><strong>Ore Totali:</strong> {{ oreTotali }}</p>
          <p><strong>Minuti Totali:</strong> {{ minutiTotali }}</p>
          <p><strong>Percentuale presenza:</strong> {{ percentualePresenza.toFixed(2) }}%</p>
          <p><strong>Assenza totali:</strong> {{ oreAssenzaTotali }} di {{ oreAssenzaPossibili }}</p>
          
        </div>

      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="nuovaData"
                label="Data"
                variant="outlined"
                type="date"
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
import { ref, defineExpose, computed, nextTick } from "vue";
import GestoreRighe from "../componentsjs/GestoreRighe"; 

const gestore = new GestoreRighe();
const isOpen = ref(false);
const registro = ref(null);
const registroDettagli = ref([]);
const nuovaData = ref("");
const nuoveOre = ref("");
const nuoviMinuti = ref("");
const form = ref(null);

// Metodo per aprire la modale e caricare i dettagli
const apri = (datiRegistro) => {
  registro.value = datiRegistro;
  registroDettagli.value = [...(datiRegistro.dettagli || [])];
  isOpen.value = true;
};

// Metodo per chiudere la modale
const chiudi = () => {
  isOpen.value = false;
};

// Aggiungi dettaglio e aggiorna i totali
const aggiungiDettaglio = async () => {
  await nextTick();
  const { valid } = await form.value.validate(); 

  if (!valid) {
      console.log("Errore: dati non validi!");
      return;
  }

  console.log("Dati validi, aggiungo il dettaglio!");

  const dettaglio = {
      nuovaData: nuovaData.value,
      nuoveOre: Number(nuoveOre.value),
      nuoviMinuti: Number(nuoviMinuti.value)
  };

  gestore.aggiungiRigaDettagli(registro.value.id, dettaglio);
  registroDettagli.value.push(dettaglio);

  nuovaData.value = '';
  nuoveOre.value = '';
  nuoviMinuti.value = '';

  await nextTick();
  form.value.resetValidation();
};

// Rimuovi una riga e aggiorna i totali
const rimuoviRiga = (index) => {
  gestore.rimuoviRigaDettagli(registro.value.id, index);
  registroDettagli.value = [...gestore.righe.find(r => r.id === registro.value.id)?.dettagli || []];
};

// Calcolo ore totali lavorate
const oreTotali = computed(() => {
  return registroDettagli.value.reduce((total, riga) => total + Number(riga.nuoveOre), 0);
});

// Calcolo minuti totali
const minutiTotali = computed(() => {
  return registroDettagli.value.reduce((total, riga) => total + Number(riga.nuoviMinuti), 0);
});

// Converti i minuti in ore
const oreConvertite = computed(() => Math.floor(minutiTotali.value / 60));
const minutiResidui = computed(() => minutiTotali.value % 60);
const oreFinali = computed(() => oreTotali.value + oreConvertite.value);

// Calcolo percentuale presenza
const percentualePresenza = computed(() => (oreFinali.value / 240) * 100);

const oreAssenzaPossibili = computed(() => {
  console.log(registro.value)
  return registro.value.hours - (registro.value.hours * (registro.value.perc / 100));
});

// Calcolo totale delle ore di assenza possibili
const oreAssenzaTotali = computed(() => {
  // Somma le ore di assenza giornaliere
  return registroDettagli.value.reduce((total, riga) => {
    const totaleGiorno = riga.nuoveOre + Math.floor(riga.nuoviMinuti / 60);
    const oreLavoroGiorno = registro.value.hoursDay; // ore previste per ogni giorno
    const assenza = oreLavoroGiorno - totaleGiorno;
    return total + (assenza > 0 ? assenza : 0);
  }, 0);
});

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

.totali {
  text-align: center;
  margin-top: 20px;
}
</style>
