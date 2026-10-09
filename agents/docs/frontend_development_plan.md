# Piano di Sviluppo WebApp Frontend

Questo documento descrive le specifiche tecniche, architetturali e lo stato di avanzamento per lo sviluppo della WebApp Frontend dedicata ai quiz di Apprendimento Automatico.

## 1. Stack Tecnologico [COMPLETATO]
- **Framework:** React configurato tramite Vite.
- **Hosting:** GitHub Pages (SPA statica, nessun backend).
- **Styling:** CSS puro, niente Tailwind. Palette Dark/Light mode tramite CSS variables.
- **Gestione Dati Originali:** File `domande.json` servito come static asset in `public/data/`.
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
- **Termina Esame:** Nessun feedback immediato alla risposta; i calcoli avvengono solo alla consegna.

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
- **Verifica Deploy:** Assicurarsi che il path assoluto o relativo della chiamata `fetch` per `domande.json` (`/data/domande.json` o `./data/...`) continui a funzionare dopo aver rilocato i file in produzione.
