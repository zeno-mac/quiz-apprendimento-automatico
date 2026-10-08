import json

data_esame = "scritto-2023-01-16-soluzione"
origine = "screenshot_llm"
revisione = "automatica"

questions = [
    {
        "numero_domanda": "1",
        "domanda": "Selezionare la sentenza corretta riguardo agli alberi di decisione",
        "risposte_possibili": [
            "Possono essere utilizzati solo con features discrete",
            "Possono espimere qualunque funzione di classificazione",
            "Non presentano problemi di overfitting",
            "Il costo computazionale della predizione è piuttosto elevato"
        ],
        "risposte_corrette": ["Possono espimere qualunque funzione di classificazione"]
    },
    {
        "numero_domanda": "2",
        "domanda": "Se un modello calcola una distribuzione di probabilità, aggiungere alla funzione obiettivo una componente tesa a diminuire l'entropia avrà l'effetto di:",
        "risposte_possibili": [
            "nessun effetto concreto",
            "focalizzare le scelte sui casi più probabili",
            "ridistribuire le probabilità in modo più bilanciato tra tutti i casi",
            "favorire l'uscita da minimi locali"
        ],
        "risposte_corrette": ["focalizzare le scelte sui casi più probabili"]
    },
    {
        "numero_domanda": "3",
        "domanda": "Selezionare la sentenza corretta relativa alla crossentropy H(P,Q) tra P e Q",
        "risposte_possibili": [
            "E' uguale alla divergenza di Kullback-Leibler KL(P,Q) più l'entropia H(P) di P",
            "Misura la loglikelihood di P data la distribuzione Q",
            "Ha un valore massimo quando P = Q",
            "E' una funzione simmetrica: H(P,Q) = H(Q,P)"
        ],
        "risposte_corrette": ["E' uguale alla divergenza di Kullback-Leibler KL(P,Q) più l'entropia H(P) di P"]
    },
    {
        "numero_domanda": "4",
        "domanda": "Selezionare la sentenza ERRATA relativa alla derivata della funzione logistica:",
        "risposte_possibili": [
            "è una funzione monotona",
            "tende a 0 quando x tende a meno infinito",
            "ha il suo massimo in corrispondenza dello 0",
            "è una funzione simmetrica"
        ],
        "risposte_corrette": ["è una funzione simmetrica", "è una funzione monotona"]
    },
    {
        "numero_domanda": "5",
        "domanda": "Ci sono due dadi, uno normale e uno truccato che restituisce un 6 con probabilità .5, e gli altri valori con probabilità 0.1\nFaccio tre lanci con lo stesso dado e osservo un 3, un 6 e un 2. Cosa posso concludere?",
        "risposte_possibili": [
            "La probabilità di usare uno o l'altro dei dadi è esattamente la stessa",
            "Nulla",
            "E' più probabile che il dato sia normale",
            "E' più probabile che il dato sia truccato"
        ],
        "risposte_corrette": ["E' più probabile che il dato sia truccato"]
    },
    {
        "numero_domanda": "6",
        "domanda": "Selezionare la sentenza ERRATA riguardo all'apprendimento supervisionato",
        "risposte_possibili": [
            "Richiede la costante supervisione di un esperto durante il training",
            "Può comprendere sia problemi di regressione che di classificazione",
            "Si riferisce all'apprendimento di funzioni basato su esempi di training composti da coppie input-output",
            "La definizione della ground truth può richiedere l'intervento umano ed essere onerosa"
        ],
        "risposte_corrette": ["Richiede la costante supervisione di un esperto durante il training"]
    },
    {
        "numero_domanda": "7",
        "domanda": "Selezionare la sentenza ERRATA relativa alla tecnica Naive Bayes",
        "risposte_possibili": [
            "E' una tecnica di tipo generativo in quanto cerca di determinare la distribuzione delle varie categorie dei dati",
            "Deriva dall'ipotesi teorica semplificativa che le features siano indipendenti tra loro, date le classi",
            "Non può essere utilizzata se le features non sono tra loro indipendenti, date le classi",
            "Fornisce un modo computazionalmente efficiente per approssimare la distribuzione congiunta di probabilità delle features"
        ],
        "risposte_corrette": ["Non può essere utilizzata se le features non sono tra loro indipendenti, date le classi"]
    },
    {
        "numero_domanda": "8",
        "domanda": "Un dataset contiene 1/3 di positivi e 2/3 di negativi. La recall del modello è di 2/3.\nChe percentuale dei dati sono Falsi Positivi?",
        "risposte_possibili": [
            "2/9",
            "1/9",
            "1/3",
            "Non può essere stabilito"
        ],
        "risposte_corrette": ["Non può essere stabilito"]
    },
    {
        "numero_domanda": "9",
        "domanda": "Selezionare la sentenza SCORRETTA riguardo alla regressione logistica",
        "risposte_possibili": [
            "Permette di associare una probabilità alla predizione della classe",
            "Il calcolo della predizione si basa sulla loglikelihood dei dati di training",
            "La predizione dipende dal bilanciamento dei dati di training rispetto alle classi",
            "I parametri del modello possono essere tipicamente calcolati in forma chiusa, mediante una formula esplicita"
        ],
        "risposte_corrette": ["I parametri del modello possono essere tipicamente calcolati in forma chiusa, mediante una formula esplicita"]
    },
    {
        "numero_domanda": "10",
        "domanda": "Riguardo alla regressione multinomiale, selezionare la sentenza corretta tra le seguenti",
        "risposte_possibili": [
            "Per n features di input e m classi, il numero dei parametri del modello cresce come O(n+m)",
            "Il peso con cui è valutata ogni feature è tipicamente diverso per ogni classe",
            "I pesi delle features sono sempre tutti positivi, i bias possono essere negativi",
            "Per ogni input, esiste almeno una classe con probabilità > 0.5"
        ],
        "risposte_corrette": ["Il peso con cui è valutata ogni feature è tipicamente diverso per ogni classe"]
    },
    {
        "numero_domanda": "11",
        "domanda": "Selezionare la sentenza corretta relativa alla funzione softmax",
        "risposte_possibili": [
            "Non può essere utilizzata nel caso di una classificazione binaria",
            "Restituisce una distribuzione di probabilità sulle classi",
            "Per una data classe, la somma dei valori su tutti gli input di un minibatch è sempre 1",
            "Produce valori compresi nell'intervallo [-1,1]"
        ],
        "risposte_corrette": ["Restituisce una distribuzione di probabilità sulle classi"]
    },
    {
        "numero_domanda": "12",
        "domanda": "In quale di questi casi una tecnica di classificazione lineare potrebbe non fornire risultati soddisfacenti:",
        "risposte_possibili": [
            "Quando la classificazione dipende da un confronto tra features",
            "Quando esiste una elevata correlazione tra le features",
            "Quando non tutte le features di input sono rilevanti ai fini della classificazione",
            "Quando le features sono indipendenti tra loro, data la classe."
        ],
        "risposte_corrette": ["Quando la classificazione dipende da un confronto tra features"]
    },
    {
        "numero_domanda": "13",
        "domanda": "Selezionare la sentenza corretta relativa alle tecniche discriminative",
        "risposte_possibili": [
            "Cercano di determinare le distribuzioni di probabilità delle varie classi di dati",
            "Si focalizzano sulla definizione delle frontiere di decisione (decision boundaries)",
            "Si applicano per lo più in ambito di apprendimento non supervisionato",
            "Sono tipicamente meno espressive delle tecniche generative"
        ],
        "risposte_corrette": ["Si focalizzano sulla definizione delle frontiere di decisione (decision boundaries)"]
    },
    {
        "numero_domanda": "14",
        "domanda": "Selezionare la sentenza ERRATA relativa alla funzione ReLU(x) (rectified linear unit):",
        "risposte_possibili": [
            "Lei o le sue varianti sono tipicamente utilizzate per i livelli interni delle reti neurali profonde",
            "La sua derivata è una funzione a gradino",
            "è una funzione monotona non decrescente",
            "non può essere utilizzata per layer convoluzionali"
        ],
        "risposte_corrette": ["non può essere utilizzata per layer convoluzionali"]
    },
    {
        "numero_domanda": "15",
        "domanda": "Selezionare la sentenza ERRATA relativa all'entropia per la distribuzione di probabilità di una variabile aleatoria discreta",
        "risposte_possibili": [
            "Il suo valore è minimo (e uguale a 0) quando la probabilità è tutta concentrata in una classe",
            "Il range del suo valore è tra 0 e log n dove n sono i possibili valori di X",
            "è una misura del grado di disordine della variabile aleatoria",
            "Il suo valore è minimo (e uguale a 0) quando la probabilità è equamente distribuita tra tutte le classi"
        ],
        "risposte_corrette": ["Il suo valore è minimo (e uguale a 0) quando la probabilità è equamente distribuita tra tutte le classi"]
    },
    {
        "numero_domanda": "16",
        "domanda": "Quale delle seguenti sentenze relative agli autoencoders è SCORRETTA?",
        "risposte_possibili": [
            "Possono essere utilizzate per la rimozione di rumore (denoising)",
            "La rappresentazione interna prodotta dall'encoder abitualmente ha una dimensione ridotta rispetto a quella di partenza",
            "L'encoder e il decoder non devono essere necessariamente simmetrici",
            "Gli Autoencoders richiedono l'uso di livelli densi"
        ],
        "risposte_corrette": ["Gli Autoencoders richiedono l'uso di livelli densi"]
    },
    {
        "numero_domanda": "17",
        "domanda": "Selezionare la sentenza SCORRETTA relativa alla backpropagation per reti neurali",
        "risposte_possibili": [
            "Richiede la memorizzazione delle attivazioni di tutti i neuroni della rete durante la forward pass",
            "Ha un costo computazionale paragonabile a quello del calcolo \"in avanti\" (inference) lungo la rete",
            "Si basa tipicamente su algoritmi di tipo genetico",
            "Tipicamente, si effettua solo durante la fase di \"training\" della rete"
        ],
        "risposte_corrette": ["Si basa tipicamente su algoritmi di tipo genetico"]
    },
    {
        "numero_domanda": "18",
        "domanda": "Selezionare la sentenza scorretta relativa al campo ricettivo (receptive field) di un neurone di una CNN:",
        "risposte_possibili": [
            "Definisce la porzione dell'input che influenza l'attivazione di un determinato neurone",
            "Dipende dalla profondità del layer in cui si trova il neurone e dalle dimensioni e gli strides dei kernel dei layers precedenti",
            "E' sempre almeno pari alla dimensione spaziale del dato di input",
            "Aumenta rapidamente con l'attraversamento di livelli con downsampling"
        ],
        "risposte_corrette": ["E' sempre almeno pari alla dimensione spaziale del dato di input"]
    },
    {
        "numero_domanda": "19",
        "domanda": "Quale di queste reti NON è stata progettata per la classificazione di immagini?",
        "risposte_possibili": [
            "Inception-v3",
            "U-Net",
            "VGG19",
            "ResNet"
        ],
        "risposte_corrette": ["U-Net"]
    },
    {
        "numero_domanda": "20",
        "domanda": "Il tensore di input di un layer convolutivo 2D ha dimensione (16,16,32). Sintetizzo 8 kernel con dimensione spaziale (3,3), stride 2, nessun padding (valid mode). Quale sarà la dimensione dell'output?",
        "risposte_possibili": [
            "(7,7,15)",
            "(8,8,8)",
            "(7,7,8)",
            "(8,8,32)"
        ],
        "risposte_corrette": ["(7,7,8)"]
    },
    {
        "numero_domanda": "21",
        "domanda": "Quale è l'effetto tipico dell'aumento della dimensione del minibatch durante il training?",
        "risposte_possibili": [
            "La Backpropagation è effettuata più frequentemente e l'aggiornamento dei parametri è più accurato",
            "La Backpropagation è effettuata più frequentemente ma l'aggiornamento dei parametri è meno accurato",
            "La Backpropagation è effettuata meno frequentemente e l'aggiornamento dei parametri è meno accurato",
            "La Backpropagation è effettuata meno frequentemente ma l'aggiornamento dei parametri è più accurato"
        ],
        "risposte_corrette": ["La Backpropagation è effettuata meno frequentemente ma l'aggiornamento dei parametri è più accurato"]
    },
    {
        "numero_domanda": "22",
        "domanda": "Selezionare la sentenza SCORRETTA relativa alla tecnica a discesa del gradiente.",
        "risposte_possibili": [
            "Potrebbe convergere a un minimo locale",
            "Può essere applicata solo se la funzione da minimizzare ha una superficie concava",
            "Il risultato può dipendere dalla inizializzazione dei parametri del modello",
            "E' opportuno decrementare il learning rate verso la fine dell'apprendimento"
        ],
        "risposte_corrette": ["Può essere applicata solo se la funzione da minimizzare ha una superficie concava"]
    },
    {
        "numero_domanda": "23",
        "domanda": "Selezionare la sentenza SCORRETTA realtiva ai Long-Short Term Memory Models (LSTMs)",
        "risposte_possibili": [
            "Utilizzano delle particolari porte (gates) per gestire l'evoluzione della cella di memoria durante l'elaborazione di una sequenza di dati",
            "Sono una particolare tipologia di Rete Ricorrente",
            "Sono prevalentemente utilizzati per l'elaborazione di sequenze di dati",
            "Sono prevalentemente utilizzati per la segmentazione di immagini mediche"
        ],
        "risposte_corrette": ["Sono prevalentemente utilizzati per la segmentazione di immagini mediche"]
    },
    {
        "numero_domanda": "24",
        "domanda": "Quale funzione di loss è tipicamente utilizzata in una rete neurale per classificazione binaria che utilizza una sigmoid come attivazione finale?",
        "risposte_possibili": [
            "categorical crossentropy",
            "absolute error",
            "binary crossentropy",
            "mean squared error"
        ],
        "risposte_corrette": ["binary crossentropy"]
    },
    {
        "numero_domanda": "25",
        "domanda": "Selezionare la sentenza SCORRETTA riguardo ai modelli generativi",
        "risposte_possibili": [
            "Generative Adversarial Networks, Variational Autoencoders e Diffusion models sono esempi di tecniche generative profonde",
            "Un tipico esempio di tecnica generativa è Naive Bayes",
            "Sono modelli che cercano di apprendere la distribuzione di probabilità dei dati",
            "Sono modelli meta-teorici rivolti alla automatizzazione della generazione di reti neurali"
        ],
        "risposte_corrette": ["Sono modelli meta-teorici rivolti alla automatizzazione della generazione di reti neurali"]
    },
    {
        "numero_domanda": "26",
        "domanda": "Selezionare la sentenza SCORRETTA relativa ai neuroni artificiali",
        "risposte_possibili": [
            "Un neurone artificiale tipicamente calcola una combinazione lineare dei suoi input, seguita dalla applicazione di una funzione di attivazione non lineare",
            "Il numero dei parametri di un neurone artificiale è lineare nel numero dei suoi input",
            "Un neurone artificiale definisce un semplice modello matematico che simula il neurone biologico",
            "Un neurone artificiale può apprendere qualunque funzione dei suoi input"
        ],
        "risposte_corrette": ["Un neurone artificiale può apprendere qualunque funzione dei suoi input"]
    },
    {
        "numero_domanda": "27",
        "domanda": "Un layer convolutivo 2D con stride 1, kernel size 3x3, e senza padding prende in input un layer con dimensioni (32,32,3) e restituisce un layer di dimensione (32,32,16). Quanti sono i suoi parametri?",
        "risposte_possibili": [
            "160",
            "28",
            "432",
            "448"
        ],
        "risposte_corrette": ["448"]
    },
    {
        "numero_domanda": "28",
        "domanda": "Selezionare la sentenza SCORRETTA relativa al problema della scomparsa del gradiente (vanishing gradient)",
        "risposte_possibili": [
            "Se il gradiente tende a zero anche parametri e le attivazioni dei neuroni tendono a zero",
            "Se il gradiente tende a zero i parametri non sono più aggiornati e la rete smette di apprendere",
            "Il problema è mitigato dall'uso di link residuali all'interno della rete",
            "Il problema è fortemente attenuato dall'uso di ReLU (o sue varianti) come funzione di attivazione per i livelli nascosti della rete"
        ],
        "risposte_corrette": ["Se il gradiente tende a zero anche parametri e le attivazioni dei neuroni tendono a zero"]
    },
    {
        "numero_domanda": "29",
        "domanda": "Selezionare al sentenza ERRATA relativa alle Transposed Convolutions",
        "risposte_possibili": [
            "Possono essere interpretate come convoluzioni normali con stride sub-unitario",
            "Sono prevalentemente utilizzate in architetture per Image-to-Image processing, come autoencoders o U-Nets",
            "Sono essenzialmente equivalenti alla applicazione di un livello di upsampling seguito da una convoluzione normale",
            "Richiedono la trasposizione dell'input prima di calcolare la convoluzione del Kernel"
        ],
        "risposte_corrette": ["Richiedono la trasposizione dell'input prima di calcolare la convoluzione del Kernel"]
    },
    {
        "numero_domanda": "30",
        "domanda": "Selezionare la sentenza SCORRETTA relativa alla U-Net",
        "risposte_possibili": [
            "E' un componente tipico dei modelli generativi a diffusione",
            "E' spesso impiegata per problemi di segmentazione semantica di immagini",
            "Può essere usata per la rimozione del rumore (denoising) di immagini",
            "Viene spesso utilizzata nell'ambito della classificazione dei generi musicali"
        ],
        "risposte_corrette": ["Viene spesso utilizzata nell'ambito della classificazione dei generi musicali"]
    }
]

for q in questions:
    q["data_esame"] = data_esame
    q["origine"] = origine
    q["revisione"] = revisione

with open("../domande_estratte_img.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, ensure_ascii=False, indent=4)
print("Saved 30 questions to domande_estratte_img.json")
