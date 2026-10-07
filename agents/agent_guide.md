Obiettivo generale: creare un sito di quiz con le domande degli anni passati del corso di ML.

Step attuale: estrarre le domande dai PDF degli anni scorsi e salvarle in un JSON (lista di domande).

Regola fondamentale: nessun dato deve mai essere indovinato. Ogni informazione deve rispettare i dati originali. Se un dato non è ricavabile con certezza, va segnalato, non completato.

Schema di ogni domanda:
- `data_esame`: str
- `numero_domanda`: str
- `domanda`: str
- `risposte possibili`: [str]
- `risposte corrette`: [str], contiene il testo della risposta

Invarianti attesi (non certi): se risultano violati, non correggere e non scartare: segnalarlo in un report e continuare. Sarò io a decidere se è sbagliato il modello mentale o il parsing.

- Ogni esame ha 30 domande, tranne la simulazione del 22-11-18 (6 domande) e l'esame del 2022-12-21 (24 domande).
- Le domande sono numerate in ordine, senza duplicati.
- Ogni domanda ha 4 risposte possibili.
- Quasi tutte hanno una risposta corretta, alcune due.

Formati: alcuni PDF sono testuali, altri raccolte di screenshot. I PDF con immagini vanno ignorati per ora ma elencati.

Raggruppamento 2023: usa il rosso per le risposte corrette. Non è source of truth; serve solo per il confronto finale.
