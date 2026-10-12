# Controlli di Integrità dei Dati

Questo file funge da guida per gli agenti successivi incaricati di validare e controllare i file JSON generati dall'estrazione delle domande.

## Controlli da Effettuare

1. **Conteggio delle Domande**
   - L'esame di simulazione del 22-11-2018 deve contenere esattamente 6 domande.
   - L'esame del 2023-02-12 deve contenere esattamente 24 domande.
   - Tutti gli altri esami devono contenere esattamente 30 domande per file.
   - Segnalare se il numero di domande estratte non corrisponde.

2. **Ordinamento e Numerazione Senza Duplicati**
   - L'intero file JSON deve essere ordinato primariamente in base a `data_esame` e secondariamente in base a `numero_domanda`.
   - Verificare che i campi `numero_domanda` all'interno di ogni esame siano strettamente crescenti e senza alcun duplicato.

3. **Numero di Risposte Possibili**
   - Ogni domanda deve avere esattamente 4 risposte possibili (lunghezza dell'array `risposte_possibili` == 4).
   - Segnalare domande che hanno un numero diverso di risposte.

4. **Matching Corrette vs Possibili**
   - Ogni stringa presente nell'array `risposte_corrette` deve essere presente (esattamente identica, o con tolleranza per spazi bianchi) all'interno dell'array `risposte_possibili`.
   - Se c'è un mismatch, segnalare la discrepanza nel report (possibile errore di OCR o estrazione).

5. **Requisito Quantità Risposte Corrette**
   - Quasi tutte le domande dovrebbero avere 1 risposta corretta. Alcune potrebbero averne 2.
   - **Nota per la Web App:** L'utente nell'interfaccia può selezionare solo una risposta. Se sono presenti più risposte corrette nel JSON, significa semplicemente che ci sono più possibilità valide e all'utente basterà selezionarne una qualsiasi per ottenere il punto.
   - Nessuna domanda deve avere 0 risposte corrette. Segnalare come avviso se ce ne sono 0 o >2.

## Output Atteso
Un report dettagliato che elenca in modo chiaro quali di queste invarianti non sono state rispettate per quali specifiche domande in quali esami. **Non correggere né scartare nulla automaticamente**, l'umano prenderà le decisioni basandosi sul report.
