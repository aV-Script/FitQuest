## **1\. Document Information**

**Project Name:** RankEX  
**Document Title:** Business Logic & Algorithms  
**Version:** 1.0

## **2\. Introduction**

Il presente documento descrive le logiche di business e gli algoritmi principali che regolano il funzionamento della piattaforma RankEX.

L’obiettivo è formalizzare in modo chiaro e non ambiguo le regole utilizzate per il calcolo delle performance, la progressione degli utenti e la gestione dei dati derivati. Questo documento rappresenta la fonte di verità per tutte le logiche computazionali del sistema e deve essere considerato vincolante per lo sviluppo e la validazione delle funzionalità.

Le logiche descritte sono indipendenti dall’implementazione tecnica e devono essere interpretate come specifiche funzionali formali.

## **3\. Performance Evaluation Model**

La valutazione delle performance degli utenti si basa esclusivamente sui risultati ottenuti nei test atletici.

Ogni test produce un valore numerico che viene trasformato in un percentile, rappresentando la posizione relativa dell’utente rispetto a una popolazione di riferimento. Questo approccio consente di normalizzare risultati eterogenei e di confrontare performance diverse su una scala comune.

La media dei percentili ottenuti nei test costituisce il valore sintetico principale utilizzato dal sistema per rappresentare il livello complessivo dell’utente.

È importante sottolineare che tutti i calcoli di performance sono indipendenti da qualsiasi altra informazione, inclusi dati fisiologici o attività svolte.

## **4\. Percentile Calculation**

Il percentile rappresenta la posizione relativa di un valore all’interno di una distribuzione di riferimento.

Per ogni test, il sistema utilizza tabelle predefinite che associano valori numerici a percentili, tenendo conto di variabili come età e sesso. Questo consente di garantire una valutazione equa e comparabile tra utenti con caratteristiche diverse.

Nel caso in cui più test condividano la stessa metrica di riferimento, il sistema utilizza un identificativo univoco del test per determinare la corretta tabella di valutazione, evitando ambiguità.

Il risultato finale del calcolo è un valore normalizzato compreso tra 0 e 100.

## **5\. Rank Determination**

Il rank rappresenta una classificazione sintetica del livello dell’utente ed è derivato direttamente dalla media dei percentili.

Il sistema definisce una serie di soglie che suddividono la scala dei valori in intervalli, ciascuno associato a un livello di rank. Questa classificazione consente di rappresentare in modo immediato il livello dell’utente, mantenendo coerenza tra diversi contesti applicativi.

Il rank viene aggiornato automaticamente ogni volta che vengono registrati nuovi risultati nei test atletici.

È fondamentale evidenziare che il rank dipende esclusivamente dai test e non è influenzato da altri fattori, inclusi experience points o dati di composizione corporea.

## **6\. Experience Points System (XP)**

Il sistema di experience points è progettato per incentivare la partecipazione e la continuità degli utenti.

Gli XP vengono assegnati in seguito a specifiche azioni, tra cui la partecipazione alle sessioni e la registrazione di dati. La quantità di punti assegnata dipende dalla frequenza delle attività e da configurazioni predefinite.

La progressione dei livelli segue una logica incrementale, in cui ogni livello richiede una quantità crescente di punti rispetto al precedente. Questo approccio introduce una curva di progressione che mantiene l’engagement nel lungo periodo.

Il sistema prevede inoltre bonus legati alla costanza, premiando gli utenti che mantengono una partecipazione regolare nel tempo.

## **7\. Session XP Logic**

Le sessioni rappresentano una delle principali fonti di accumulo di experience points.

Al termine di una sessione, il sistema assegna XP esclusivamente agli utenti presenti. Gli utenti assenti non ricevono alcun punto, indipendentemente dal motivo dell’assenza.

Nel caso in cui una sessione venga contrassegnata come non svolta, il sistema non assegna XP a nessun partecipante.

La quantità di XP assegnata per sessione può variare in funzione della frequenza settimanale delle attività, garantendo un bilanciamento tra utenti con diversi livelli di partecipazione.

## **8\. BIA Evaluation Logic**

Nel modulo personal training, la piattaforma supporta la valutazione dei dati di composizione corporea tramite BIA.

Ogni misurazione viene analizzata confrontando i valori con range di riferimento specifici per ciascun parametro. Il sistema identifica eventuali miglioramenti o regressioni rispetto alle misurazioni precedenti.

Sulla base di questa analisi, vengono assegnati experience points secondo una logica che premia il miglioramento e la costanza. La prima misurazione riceve un bonus iniziale, mentre le successive vengono valutate in funzione dell’evoluzione dei parametri.

I dati BIA non influenzano in alcun modo il calcolo del rank, mantenendo separati i due sistemi di valutazione.

## **9\. Profile Type Logic**

Il comportamento del sistema varia in funzione del tipo di profilo associato al cliente.

I profili possono essere configurati per supportare esclusivamente i test atletici, esclusivamente la BIA oppure entrambe le funzionalità. Questa distinzione determina quali dati possono essere registrati e quali logiche vengono applicate.

Nel caso in cui un profilo venga aggiornato per includere nuove funzionalità, il sistema gestisce la transizione mantenendo la coerenza dei dati esistenti. In alcuni casi, è previsto il reset di specifiche informazioni per garantire integrità del modello.

## **10\. Plan Limitation Logic**

La piattaforma implementa un sistema di limiti basato sul piano sottoscritto dall’organizzazione.

I limiti principali riguardano il numero di membri del team e il numero di clienti gestibili. Questi vincoli vengono verificati al momento della creazione di nuove entità.

Nel caso in cui il limite venga raggiunto, il sistema blocca l’operazione e restituisce un messaggio esplicativo. Le operazioni di aggiornamento o eliminazione non sono soggette a queste restrizioni.

Questo approccio consente di mantenere controllo sull’utilizzo della piattaforma senza introdurre complessità nelle operazioni quotidiane.

## **11\. Data Update Logic**

Le operazioni che modificano lo stato del sistema seguono un modello coerente basato su aggiornamenti atomici e gestione degli errori.

Quando un’azione coinvolge più entità, il sistema garantisce che tutte le modifiche vengano applicate in modo consistente. In caso di errore, nessuna modifica viene salvata, evitando stati intermedi non validi.

A livello di interfaccia, viene adottato un approccio di aggiornamento ottimistico, che migliora la percezione di reattività senza compromettere l’integrità dei dati.

## **12\. Consistency Between Systems**

RankEX mantiene una separazione netta tra i diversi sistemi di valutazione, evitando interferenze tra logiche indipendenti.

In particolare, il sistema di rank e quello di experience points operano su dimensioni diverse e non si influenzano reciprocamente. Allo stesso modo, i dati di composizione corporea sono gestiti separatamente rispetto alle performance atletiche.

Questa separazione garantisce chiarezza, coerenza e facilità di interpretazione dei dati.

## **13\. Edge Cases and Exceptions**

Il sistema gestisce una serie di casi particolari per garantire robustezza.

Tra questi rientrano situazioni in cui dati incompleti o incoerenti potrebbero compromettere i calcoli. In tali casi, il sistema adotta comportamenti conservativi, evitando di produrre risultati non affidabili.

Le modifiche retroattive, come l’aggiornamento di dati passati, vengono gestite con attenzione per preservare la consistenza dello storico.