# Piano di Sviluppo WebApp Frontend

Questo documento descrive le specifiche tecniche, architetturali e lo stato di avanzamento per lo sviluppo della WebApp Frontend dedicata ai quiz di Apprendimento Automatico.

## 1. Stack Tecnologico [COMPLETATO]
- **Framework:** React configurato tramite Vite.
- **Hosting:** GitHub Pages (SPA statica, nessun backend).
- **Styling:** CSS puro, niente Tailwind. Palette Dark/Light mode tramite CSS variables.
- **Gestione Dati Originali:** File unico master `data/domande.json` (nella root del repository), importato direttamente dall'app React. Nessuna duplicazione o copia statica ridondante.
- **Database Utente / Salvataggi:** Esclusivamente `localStorage` del browser.

## 2. Dati e Salvataggio (Local Storage) [COMPLETATO]
La logica di salvataggio tiene traccia dello storico e gestisce un pool di errori intelligente.
- **Formato salvataggio:** JSON `quiz_progress` nel localStorage.
- **Pool errori intelligente:** Quando un utente sbaglia una domanda, l'ID viene inserito nel cestino. Se l'utente risponde correttamente in futuro (in un nuovo esame o in un ripasso), l'ID viene rimosso dal cestino.
- **Funzionalità Importa/Esporta:** Presenti tasti per scaricare il JSON come backup o sovrascrivere il localStorage per ripristinarlo.

## 3. Viste dell'Applicazione [COMPLETATO]

### A. Dashboard Iniziale
- **Lista Esami:** Dati raggruppati per `data_esame`.
- **Stato completamento:** Badge "Fatto" / "Da fare" basato sullo storico.
- **Dettagli Storico:** Sezione espandibile che elenca tutti i tentativi passati con date, orari e punteggi.
- **Azioni Rapide:**
  - *Quiz Totale:* Avvia un quiz con tutte le domande del database mescolate.
  - *Quiz Random:* L'utente seleziona $N$ domande tramite un input; l'app genera un quiz casuale.
  - *Ripasso Errori:* Genera un quiz pescando solo dalle domande attualmente nel `wrongQuestionsPool`.

### B. View del Quiz
- **Testo e Formule:** Renderizzati in markdown e LaTeX tramite `react-katex`.
- **Navigazione:** Tasti Avanti/Indietro standard.
- **Griglia Rapida:** Menù a comparsa (overlay) dal counter (es. `1/30`) che mostra una griglia con tutti i numeri delle domande. Permette il salto rapido e indica (tramite CSS) le domande già risposte.
- **Selezione:** Scelta singola; possibilità di deselezione ricliccando la stessa opzione.
- **Metadata:** Mostra l'ID e, per la revisione, differenzia tra estrazioni verificate e non verificate (con badge UI chiari, ottimizzati nelle ultime revisioni).
- **Correzione e Spiegazione Immediata (Modal):** Tasto centrale dedicato ("Mostra Correzione") tra i tasti Precedente e Successivo. Apre un modal che:
  - Valuta e indica lo stato della risposta data dall'utente (corretta con evidenziazione verde, errata con evidenziazione rossa, oppure non ancora selezionata con avviso giallo/neutro).
  - Mostra la sezione con la risposta corretta attesa solo qualora la risposta data sia errata o non ancora selezionata (evitando duplicazioni se la risposta è già corretta; nel caso di risposte corrette multiple, elenca eventuali opzioni alternative valide).
  - Mostra la spiegazione associata alla domanda (campo `spiegazione` nel JSON) oppure, qualora non ancora presente, un box di placeholder informativo (*"Nessuna spiegazione disponibile al momento per questa domanda. Verrà integrata nelle prossime revisioni del dataset."*).
- **Termina Esame:** Consegna dell'esame con riepilogo complessivo e salvataggio dei risultati nel localStorage.

### C. View Risultati
- **Punteggio:** Score complessivo bene in vista (es. `28/30`).
- **Revisione Errori:** Lista di tutte le domande del quiz; la risposta dell'utente evidenziata in rosso (se errata/saltata) e la risposta corretta indicata in verde.
- **Risposte Multiple:** Il sistema riconosce ed elenca tutte le opzioni valide se la domanda ha più stringhe di risposta accettabili.

## 4. UI/UX e Design System [COMPLETATO]
- **Temi:** Supporto integrato a Dark Mode e Light Mode. Switch tramite icona (Sole/Luna) nell'header, con persistenza nel LocalStorage.
- **Palette Dark:** Sfondi scuri `#17181F` e `#232530`, testi chiari, accenti indaco vibrante (`#4F46E5`).
- **Palette Light:** Sfondi puliti `#F9FAFB` e `#FFFFFF`, mantenendo gli stessi accenti e i colori semantici (verde/rosso).
- **Responsive Design:** Perfetto adattamento per layout mobile e desktop.
- **Usabilità:** Animazioni fluide, hover visibili e bottoni chiari che informano esplicitamente l'utente di poterne interagire (es. freccetta giù sulla griglia di navigazione).

## 5. Prossimi Passi (Next Steps) [IN ATTESA]
- **Build di Produzione:** Eseguire `npm run build` e preparare la cartella `dist`.
- **Configurazione GitHub Pages:** Impostare il base-path corretto per Vite (se necessario per il repo) e gestire l'eventuale workflow per esporre la build nel branch `gh-pages` o equivalenti.
- **Verifica Deploy:** Poiché `domande.json` viene importato direttamente nel bundle compilato, non ci sono dipendenze da path relativi o chiamate `fetch` a runtime, garantendo un caricamento immediato e privo di errori 404 su GitHub Pages.
