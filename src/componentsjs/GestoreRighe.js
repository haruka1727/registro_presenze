class GestoreRighe {
  constructor() {
    this.righe = this.caricaDati();
    console.log(this.righe) // Carica i dati dal localStorage
  }

  // Carica i dati da localStorage
  caricaDati() {
    const data = localStorage.getItem('righe');
    return data ? JSON.parse(data) : []; // Restituisce un array vuoto se non ci sono dati
  }

  // Salva i dati in localStorage
  salvaDati() {
    localStorage.setItem('righe', JSON.stringify(this.righe)); // Salva i dati come stringa JSON
  }

  // Aggiunge un registro
  aggiungiRiga(titleRow) {
    const nuovoID = this.righe.length + 1; // Genera un nuovo ID
    this.righe.push({ id: nuovoID, title: titleRow, dettagli: [] }); // Inizializza con array vuoto di dettagli
    this.salvaDati();
  }

  // Rimuove un registro
  rimuoviRiga(idRegistro) {
    this.righe = this.righe.filter(r => r.id !== idRegistro); // Rimuove il registro con quell'ID
    this.salvaDati();
  }

  aggiungiRigaDettagli(idRegistro, dettaglio) {
    // Trova la riga con l'id dato
    const riga = this.righe.find(r => r.id === idRegistro);
    console.log(idRegistro)
      if (riga) {
        riga.dettagli.push(dettaglio); // Aggiungi il dettaglio alla riga
        this.salvaDati();
      } else {
        console.error("Registro non trovato");
      }
  }

  rimuoviRigaDettagli(idRegistro, index) {
    // Trova il registro con l'id dato
    const riga = this.righe.find(r => r.id === idRegistro);
    
    if (riga) {
        // Rimuove il dettaglio dall'array usando l'indice
        riga.dettagli.splice(index, 1);
        
        // Salva i dati aggiornati
        this.salvaDati();
    } else {
        console.error("Registro non trovato");
    }
}

}

export default GestoreRighe;

  