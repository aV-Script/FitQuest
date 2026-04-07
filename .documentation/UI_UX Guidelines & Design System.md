## **1\. Document Information**

**Project Name:** RankEX  
**Document Title:** UI/UX Guidelines & Design System  
**Version:** 1.0

## **2\. Introduction**

Il presente documento definisce i principi di design, le linee guida UX e le regole del design system adottato all’interno della piattaforma RankEX.

L’obiettivo è garantire coerenza visiva, qualità dell’esperienza utente e scalabilità dello sviluppo frontend. Le linee guida qui descritte rappresentano il riferimento per tutte le evoluzioni future dell’interfaccia e devono essere applicate in modo consistente da designer e sviluppatori.

Il design system non è inteso come un insieme statico di regole, ma come un framework evolutivo che consente di mantenere uniformità pur supportando nuove esigenze funzionali.

## **3\. Design Principles**

L’esperienza utente di RankEX è guidata da alcuni principi fondamentali che orientano tutte le scelte di design.

Il primo principio è la chiarezza. Ogni elemento dell’interfaccia deve essere immediatamente comprensibile, evitando ambiguità e riducendo il carico cognitivo per l’utente. Le informazioni più rilevanti devono emergere in modo naturale, senza richiedere interpretazioni complesse.

Un secondo principio è la coerenza. Componenti simili devono comportarsi nello stesso modo in tutte le parti dell’applicazione, garantendo prevedibilità e riducendo il tempo necessario per apprendere l’utilizzo del sistema.

Un ulteriore elemento chiave è la gerarchia visiva. L’interfaccia deve guidare l’attenzione dell’utente, evidenziando le informazioni più importanti e organizzando i contenuti in modo strutturato.

Infine, l’esperienza deve essere reattiva. Le azioni dell’utente devono produrre feedback immediato, anche in presenza di operazioni asincrone, mantenendo alta la percezione di fluidità.

## **4\. Visual Identity**

L’identità visiva di RankEX è costruita attorno a un linguaggio moderno e tecnologico, con un forte utilizzo di colori ad alta intensità su sfondi scuri.

La palette colori è caratterizzata da tonalità di verde e ciano, utilizzate per evidenziare elementi interattivi e stati positivi. Il contrasto con sfondi scuri consente di migliorare la leggibilità e di creare un effetto visivo distintivo.

L’uso del colore non è puramente estetico, ma funzionale alla comunicazione dello stato degli elementi. Ad esempio, il verde viene utilizzato per indicare azioni primarie o stati positivi, mentre altre tonalità possono essere introdotte per segnalare warning o errori.

## **5\. Typography**

La tipografia è progettata per garantire leggibilità e chiarezza in tutti i contesti.

Viene utilizzata una distinzione tra font per titoli e font per contenuti testuali. I titoli hanno una funzione gerarchica e devono risultare immediatamente riconoscibili, mentre il testo corrente deve essere facilmente leggibile anche su lunghe sezioni.

Le dimensioni e i pesi dei font sono utilizzati per costruire una gerarchia chiara, evitando l’uso eccessivo di varianti che potrebbe generare confusione.

## **6\. Layout and Spacing**

Il layout dell’applicazione segue una struttura modulare basata su griglie e spaziature consistenti.

Gli elementi dell’interfaccia sono organizzati in blocchi logici, con una chiara separazione tra sezioni. Le spaziature sono definite in modo sistematico e devono essere rispettate per mantenere coerenza visiva.

Le card rappresentano uno degli elementi principali del layout e vengono utilizzate per raggruppare contenuti correlati. Questo approccio facilita la scansione visiva e migliora l’organizzazione delle informazioni.

## **7\. Component System**

Il design system è basato su un insieme di componenti riutilizzabili che rappresentano i mattoni fondamentali dell’interfaccia.

Questi componenti includono elementi base come bottoni, input, card e badge, oltre a componenti più complessi utilizzati per visualizzare dati e interazioni specifiche.

Ogni componente è progettato per essere flessibile ma coerente, consentendo variazioni controllate senza compromettere l’identità visiva complessiva.

L’utilizzo dei componenti deve essere preferito rispetto alla creazione di soluzioni ad hoc, al fine di garantire uniformità e ridurre la duplicazione.

## **8\. Interaction Patterns**

Le interazioni all’interno della piattaforma seguono pattern definiti, progettati per garantire prevedibilità e facilità d’uso.

Le azioni principali sono sempre chiaramente identificabili e posizionate in modo consistente. Le operazioni secondarie sono invece meno prominenti, ma comunque accessibili.

Il sistema fornisce feedback immediato in risposta alle azioni dell’utente, attraverso animazioni, cambi di stato o notifiche. Questo contribuisce a migliorare la percezione di controllo e a ridurre l’incertezza.

Le operazioni potenzialmente critiche, come eliminazioni o modifiche irreversibili, sono sempre accompagnate da meccanismi di conferma.

## **9\. Forms and Data Input**

La gestione degli input è progettata per essere semplice e guidata.

I form sono organizzati in modo logico, con una sequenza chiara di campi e una validazione immediata dei dati inseriti. Gli errori vengono segnalati in modo esplicito, indicando all’utente come correggerli.

Nei flussi più complessi, come la creazione di un nuovo cliente, viene utilizzato un approccio a step che suddivide il processo in fasi più gestibili.

Questo approccio riduce la complessità percepita e migliora l’esperienza complessiva.

## **10\. Module-Based UX Variations**

Il comportamento dell’interfaccia varia in funzione del modulo attivo, mantenendo però una base comune.

Nel modulo personal training, l’interfaccia enfatizza la categorizzazione dei clienti e la personalizzazione dei test. Nel modulo soccer academy, invece, l’esperienza è più standardizzata e orientata alla gestione di gruppi e ruoli.

Queste differenze sono progettate per adattarsi al contesto operativo senza compromettere la coerenza generale del sistema.

## **11\. Readonly Mode**

La piattaforma prevede una modalità di sola lettura per alcuni utenti.

In questo stato, le funzionalità di modifica vengono disabilitate o nascoste, mantenendo comunque la piena visibilità dei dati. L’interfaccia comunica chiaramente questa condizione attraverso elementi visivi dedicati.

Questo approccio consente di garantire sicurezza e controllo senza compromettere l’accessibilità delle informazioni.

## **12\. Feedback and Notifications**

Il sistema utilizza diversi meccanismi per fornire feedback all’utente.

Le notifiche vengono utilizzate per comunicare eventi rilevanti, mentre messaggi contestuali informano l’utente sull’esito delle azioni. Gli stati di caricamento sono gestiti tramite elementi visivi che indicano chiaramente quando un’operazione è in corso.

Questo insieme di feedback contribuisce a creare un’esperienza fluida e prevedibile.

## **13\. Error Handling**

La gestione degli errori è progettata per essere chiara e non invasiva.

Gli errori vengono comunicati in modo esplicito, evitando messaggi generici e fornendo indicazioni utili per la risoluzione. L’obiettivo è ridurre la frustrazione dell’utente e facilitare il completamento delle operazioni.

## **14\. Responsiveness and Accessibility**

L’interfaccia è progettata per adattarsi a diversi dispositivi, garantendo una buona esperienza sia su desktop che su mobile.

Particolare attenzione è dedicata alla leggibilità e alla dimensione degli elementi interattivi, per assicurare facilità d’uso anche su schermi ridotti.

Sono inoltre adottate buone pratiche di accessibilità, al fine di rendere la piattaforma utilizzabile da un pubblico più ampio.

## **15\. Evolution of the Design System**

Il design system è progettato per evolvere nel tempo.

Nuovi componenti e pattern possono essere introdotti, purché rispettino i principi fondamentali definiti in questo documento. Ogni estensione deve essere valutata in termini di coerenza e riutilizzabilità.

L’obiettivo è mantenere un sistema flessibile ma controllato, in grado di supportare la crescita della piattaforma senza perdere uniformità.