# Guida all'Estrazione OCR tramite Vision LLM per PDF basati su Immagini

Questo documento definisce la procedura operativa standard (SOP) per gli agenti incaricati di estrarre le domande dai PDF degli esami passati costituiti da screenshot (es. esami di Moodle stampati come immagini), utilizzando un'API multimodale (Vision LLM).

## Obiettivo
L'obiettivo è estrarre le domande da immagini mantenendo la stessa struttura e gli stessi rigidi vincoli di integrità applicati ai PDF testuali, ottenendo un output JSON validabile e privo di allucinazioni.

## Strategia di Esecuzione (Agentica)
Poiché **non è disponibile una chiave API esterna**, l'agente incaricato dovrà eseguire l'estrazione agendo lui stesso come Vision LLM, seguendo questi step:

1. **Conversione PDF-to-Image:** 
   Utilizzare/scrivere un piccolo script Python con librerie come `PyMuPDF` (`fitz`) per convertire le singole pagine del PDF in file immagine (es. PNG) all'interno di una cartella temporanea.
2. **Lettura Visiva (tramite tool):**
   L'agente deve leggere le immagini generate utilizzando il tool `view_file` (possibilmente in chiamate parallele per velocizzare il processo).
3. **Trascrizione e Generazione JSON:** 
   L'agente elabora mentalmente ogni immagine estraendo le domande in base alle regole, e scrive uno script (es. `build_json.py`) che contiene i dati estratti per generare e salvare il file `data/domande_img.json`.
4. **Validazione:**
   Eseguire script di controllo (es. `run_checks_img.py`) per garantire l'aderenza formale (es. 30 domande per esame, nessun duplicato, 4 risposte possibili, match perfetto tra corrette e possibili).
5. **Pulizia (Archiviazione):**
   Terminata l'estrazione, lo script ad-hoc utilizzato (`build_json.py`) va spostato nella cartella `scripts/archive/` per mantenere ordinata la directory principale.

## Prompt di Sistema per il Vision LLM

> [!TIP] 
> **Miglioria post-test:** L'esperienza passata ha dimostrato che basarsi sulle "spunte verdi" o sulle "X rosse" presenti sulle opzioni può indurre l'LLM in errore o far trascrivere testo troncato. Spesso le immagini di Moodle riportano alla base della domanda una frase esplicita come *"La risposta corretta è: [TESTO]"*. Il prompt sottostante ordina esplicitamente al modello di sfruttare quel testo come truth, garantendo il match 1-a-1 con le opzioni.

Inviare al modello Vision il seguente prompt:

```text
Sei un estrattore di dati precisissimo. Il tuo compito è estrarre domande di test a risposta multipla dalle immagini fornite e restituire il risultato rigorosamente in formato JSON.

Regole di Parsing Invariabili:
1. Nessuna Allucinazione: Estrai ESATTAMENTE il testo che vedi nell'immagine. Non completare frasi tagliate, non correggere la grammatica se è sbagliata e mantieni inalterata la punteggiatura originale.
2. Pulizia del Testo: Ignora l'intestazione della pagina, i numeri di pagina, i punteggi (es. "Punteggio ottenuto 1,00 su 1,00"), le label di navigazione ("Domanda 1") e i metadati temporali (date/orari Moodle). Estrai esclusivamente il testo della domanda e le opzioni.
3. Individuazione Risposte Corrette: Cerca sempre il box testuale in calce alla domanda che indica esplicitamente la/e risposta/e giusta/e (es. "La risposta corretta è: ..."). Trascrivi il testo della risposta corretta in modo IDENTICO a come appare tra le opzioni e inseriscilo nell'array `risposte_corrette`. Affidati maggiormente al testo in calce piuttosto che a spunte grafiche (✅ o ❌).
4. Match 1-a-1: Assicurati che ogni stringa inserita in `risposte_corrette` sia una copia esatta, carattere per carattere, di una delle 4 stringhe inserite nell'array `risposte_possibili`.

Formato Schema Obbligatorio:
L'output DEVE aderire a questo schema JSON per OGNI domanda trovata:
{
    "data_esame": "YYYY-MM-DD", 
    "numero_domanda": "str",
    "domanda": "str",
    "risposte_possibili": ["str", "str", "str", "str"],
    "risposte_corrette": ["str"],
    "origine": "screenshot_llm",
    "revisione": "automatica"
}
```
*(Nota: Assicurati che "YYYY-MM-DD" venga popolato correttamente, ad esempio "2023-12-19" se il file elaborato è `scritto-2023-12-19-soluzione.pdf`)*

## Criteri di Successo
L'estrazione di un PDF immagine è conclusa con successo quando:
- Lo script di estrazione produce un JSON array ben formattato.
- Lo script di validazione restituisce semaforo verde per tutti i vincoli (conteggio, duplicati, matching interno).
- (Opzionale ma consigliato) Il cross-check semantico rileva una ragionevole sovrapposizione con le domande base (identificando chiaramente quali varianti sono inedite).
