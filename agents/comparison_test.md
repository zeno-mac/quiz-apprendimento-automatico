# Test di Confronto: Estrazioni vs Raggruppamento

Questo test serve per confrontare le domande estratte dai PDF dei singoli esami con le domande presenti in `raggruppamento.json`.

## Obiettivo
Verificare che l'estrazione dai singoli esami (specialmente quelli immagine da cui estrarremo i testi in futuro) sia coerente con la source of truth "sporca" fornita dal documento raggruppato del 2023.

## Procedura di Test

1. **Caricamento Dati**
   - Caricare in memoria le domande dai file JSON degli esami singoli.
   - Caricare in memoria le domande da `raggruppamento.json`.

2. **Metriche di Matching (Fuzzy o Embedding)**
   - Per ogni domanda estratta dai singoli esami, cercare la domanda più simile all'interno di `raggruppamento.json`.
   - Utilizzare il testo della `domanda` per il matching primario (considerare rimozione della punteggiatura, spazi, lettere minuscole o metriche come Levenshtein / Cosine Similarity se disponibili).

3. **Verifica della Correttezza delle Risposte**
   - Quando viene trovato un match con alta confidenza tra una domanda singola e una del raggruppamento:
     - Confrontare il set delle `risposte_possibili` per vedere se coincidono.
     - Confrontare la `risposte_corrette`. Questo passaggio è fondamentale per controllare se l'esame singolo (soluzione) indica la stessa risposta corretta che era segnata in rosso nel raggruppamento.

4. **Gestione dei Disallineamenti**
   - **Mancata Corrispondenza Testo Domanda:** Se una domanda di un esame singolo non ha alcun match in `raggruppamento.json` (potrebbe essere di un esame post-2023 o rimossa), elencarla.
   - **Mismatch Risposta Corretta:** Se le due fonti divergono su quale sia la risposta corretta, segnalare *entrambe* nel report (con etichetta: "Conflitto con Raggruppamento").
   - Il raggruppamento **non** è la source of truth assoluta, quindi in caso di divergenza non sovrascrivere. Riportare le discrepanze in un file di log o JSON dedicato al report di QA (Quality Assurance).
