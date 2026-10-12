# Agent Guide - Quiz ML

**Obiettivo generale:** creare una web app di quiz con le domande degli esami passati del corso di Machine Learning.

## Stato del Progetto

Il progetto è diviso in fasi. L'agente AI che prende in carico il lavoro deve posizionarsi in base a questa timeline:

- **Fase 1: Estrazione e Validazione (Completata per i PDF testuali)**: I PDF testuali sono stati convertiti in formato JSON (`data/domande.json`). I dati estratti sono stati revisionati manualmente, ripuliti e validati tramite appositi script per assicurare un'integrità perfetta al 100%.
- **Fase 2: Gestione dei PDF basati su Immagini**: I PDF composti da screenshot (elencati in `agents/docs/pdf_formats.md`) vengono elaborati seguendo le indicazioni presenti in [`agents/docs/vision_extraction_guide.md`](agents/docs/vision_extraction_guide.md).
- **Fase 3: Sviluppo Web App (Prossimo step)**: Creazione dell'interfaccia utente per il sito di quiz, che consumerà il file `data/domande.json`.

---

## Linee Guida per i Dati

**Regola fondamentale:** nessun dato deve mai essere "indovinato" automaticamente. Ogni informazione deve rispecchiare i dati originali dei PDF. Se un dato non è ricavabile con certezza, va segnalato nel report di estrazione, senza tentare completamenti "creativi". Qualsiasi incertezza deve essere decisa dall'umano.

### Schema JSON di ogni domanda

I dati si trovano attualmente all'interno del file `data/domande.json`, come lista di oggetti strutturati in questo modo:

- `data_esame`: `str` (Data dell'esame in formato YYYY-MM-DD)
- `numero_domanda`: `str`
- `domanda`: `str`
- `risposte_possibili`: `[str]` (Array contenente i 4 testi)
- `risposte_corrette`: `[str]` (Array contenente il testo esatto della/e risposta/e)
- `origine`: `str` (Es. `"moodle_testuale"`, indica la provenienza dell'estrazione)
- `revisione`: `str` (Es. `"correzione_manuale"` o `"automatica"`, traccia se il record è stato aggiustato manualmente dall'umano)
- `spiegazione`: `str` (Opzionale. Testo della spiegazione del perché la risposta corretta è valida. Attualmente non ancora popolata nel dataset: la Web App gestisce la sua eventuale assenza mostrando un placeholder di cortesia fino all'inserimento definitivo).


### Invarianti Attesi per l'Integrità dei Dati

Le regole che definiscono la validità di un esame estratto sono codificate in `agents/docs/agent_checks.md`. In sintesi:
- Ogni esame ha 30 domande, tranne la simulazione del `22-11-18` (6 domande) e l'esame `2023-02-12` (24 domande).
- L'intero file JSON deve essere ordinato primariamente per `data_esame` e secondariamente per `numero_domanda`.
- Le domande sono numerate in ordine crescente, senza duplicati all'interno di uno stesso esame.
- Ogni domanda ha esattamente 4 risposte possibili.
- Le stringhe inserite in `risposte_corrette` devono far match 1-a-1 con un elemento in `risposte_possibili` (tolleranza concessa solo per gli spazi bianchi).
- Quasi tutte le domande hanno una risposta corretta. Alcune ne hanno due. (In ogni caso: mai 0 risposte corrette).

**Nota per il Raggruppamento 2023:** L'esame raggruppato usa il testo in rosso per evidenziare le risposte corrette. Tale file non è la "source of truth", ma serve solo per il `comparison_test.md` finale e l'audit dei dati.

---

## Strumenti e Script

Se viene eseguita una qualsiasi modifica o una nuova estrazione all'interno di `data/domande.json`, l'agente deve verificare che il nuovo JSON non rompa l'integrità dei dati:
- **Come validare**: Esegui lo script Python `scripts/run_checks.py`.
- **Output**: Lo script produrrà (o aggiornerà) il report di validazione in `agents/reports/validation_report.md`. I risultati dovranno poi essere consultati e analizzati assieme all'utente.

### Gestione degli Script
Per mantenere il repository ordinato, seguiamo queste regole di organizzazione per la directory `scripts/`:
- **Script di Pipeline (`scripts/`)**: In questa cartella principale vanno mantenuti solo gli script fondamentali e riutilizzabili (es. `run_checks.py`, `build_json.py`).
- **Script Usa e Getta / Estrazione (`scripts/archive/`)**: Ogni volta che viene creato uno script ad-hoc per estrarre o parsare un singolo PDF, al termine dell'operazione e una volta confermati i dati, lo script deve essere spostato nella sottocartella `archive/`. Non va cancellato (funge da storico), ma non deve inquinare la cartella principale.
