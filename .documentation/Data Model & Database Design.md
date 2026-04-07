## **1\. Document Information**

**Project Name:** RankEX  
**Document Title:** Data Model & Database Design  
**Version:** 1.0

## **2\. Introduction**

Il presente documento descrive il modello dati della piattaforma RankEX e le scelte progettuali adottate nella definizione della struttura del database.

L’obiettivo è fornire una visione chiara delle entità principali, delle loro relazioni e delle logiche di organizzazione dei dati all’interno del sistema. Il documento rappresenta un riferimento fondamentale per lo sviluppo, la manutenzione e l’evoluzione della piattaforma, in particolare in contesti che richiedono scalabilità e coerenza dei dati.

RankEX utilizza Firestore come database principale, adottando un modello document-based che privilegia flessibilità, performance e semplicità di accesso ai dati.

## **3\. Data Model Overview**

Il modello dati è progettato per supportare un’architettura multi-tenant, in cui tutte le informazioni operative sono organizzate attorno al concetto di organizzazione.

Ogni organizzazione rappresenta un contenitore logico indipendente, all’interno del quale vengono gestiti utenti, clienti, sessioni e tutte le altre entità applicative. Questo approccio consente di garantire isolamento dei dati e di semplificare la gestione dei permessi.

La struttura del database segue una logica gerarchica, in cui le entità principali sono organizzate in collezioni e sotto-collezioni. Le informazioni globali, come i profili utente, sono invece gestite a livello root.

## **4\. Firestore Structure**

La struttura del database è organizzata in due livelli principali: collezioni globali e collezioni specifiche per organizzazione.

A livello globale è presente la collezione degli utenti, che contiene le informazioni necessarie per gestire autenticazione e autorizzazione. Parallelamente, esiste una collezione di organizzazioni, che rappresenta il punto di ingresso per tutte le entità operative.

All’interno di ciascuna organizzazione sono presenti diverse sotto-collezioni che gestiscono clienti, gruppi, sessioni, ricorrenze e notifiche. Questa struttura consente di mantenere una chiara separazione tra i dati e di semplificare le query.

## **5\. Core Entities**

### **5.1 Users**

La collezione degli utenti rappresenta il punto di accesso al sistema e contiene le informazioni necessarie per determinare ruolo, organizzazione di appartenenza e permessi.

Per gli utenti operativi, il documento include dati come ruolo e identificativo dell’organizzazione. Per gli utenti di tipo client, il documento funge da collegamento tra l’account di autenticazione e il profilo cliente presente all’interno dell’organizzazione.

Questa separazione consente di gestire in modo indipendente autenticazione e dati operativi.

### **5.2 Organizations**

Le organizzazioni rappresentano l’unità principale del modello multi-tenant. Ogni organizzazione contiene informazioni di configurazione, come il tipo di modulo attivo, il piano sottoscritto e i contatori relativi a membri e clienti.

I contatori vengono mantenuti in modo atomico per garantire coerenza anche in presenza di operazioni concorrenti. Questo consente di applicare in modo efficiente i limiti previsti dai piani SaaS.

### **5.3 Clients**

I clienti rappresentano gli utenti finali del sistema e costituiscono una delle entità più rilevanti del modello dati.

Ogni cliente è associato a una specifica organizzazione e contiene informazioni anagrafiche, dati fisici e storico delle attività. Il documento include anche dati derivati, come il rank e la media delle performance, che vengono calcolati a partire dai test atletici.

La struttura del documento è progettata per supportare sia il modulo personal training che il modulo soccer academy, adattandosi alle differenze tra i due contesti.

### **5.4 Groups**

I gruppi consentono di organizzare i clienti in insiemi logici, facilitando la gestione delle attività collettive.

Ogni gruppo contiene un elenco di identificativi dei clienti associati. Questa relazione è mantenuta in forma denormalizzata per semplificare l’accesso ai dati e ridurre il numero di query necessarie.

### **5.5 Slots (Sessions)**

Le sessioni rappresentano gli eventi pianificati all’interno del calendario.

Ogni sessione contiene informazioni temporali, riferimenti ai clienti e ai gruppi coinvolti, e lo stato della sessione. Il sistema registra inoltre la presenza o assenza dei partecipanti, informazione utilizzata per il calcolo degli experience points.

La struttura è progettata per supportare sia sessioni singole che generate da ricorrenze.

### **5.6 Recurrences**

Le ricorrenze rappresentano schemi ripetitivi utilizzati per generare automaticamente sessioni nel tempo.

Ogni ricorrenza definisce giorni della settimana, intervallo temporale e partecipanti. Il sistema utilizza queste informazioni per creare e aggiornare le sessioni future, mantenendo coerenza con eventuali modifiche.

### **5.7 Notifications**

Le notifiche rappresentano eventi comunicati agli utenti.

Ogni documento contiene un riferimento al cliente destinatario, il messaggio e lo stato di lettura. Questa struttura consente di gestire in modo semplice la comunicazione interna alla piattaforma.

## **6\. Data Relationships**

Il modello dati di RankEX non utilizza relazioni tradizionali come nei database relazionali, ma si basa su riferimenti espliciti tra documenti.

Le relazioni tra entità sono gestite tramite identificativi, ad esempio collegando clienti a gruppi o sessioni tramite array di ID. Questo approccio consente di mantenere flessibilità e di adattarsi facilmente a nuovi requisiti.

In alcuni casi, le informazioni vengono replicate per migliorare le performance, accettando una certa ridondanza controllata.

## **7\. Denormalization Strategy**

Firestore non supporta join complessi, pertanto il modello dati è progettato per minimizzare la necessità di operazioni multiple.

Le informazioni più frequentemente utilizzate vengono memorizzate direttamente nei documenti principali, evitando la necessità di recuperare dati da più fonti. Questo approccio migliora significativamente le performance, soprattutto in scenari real-time.

La denormalizzazione è gestita in modo controllato, assicurando che eventuali aggiornamenti siano propagati correttamente attraverso operazioni batch.

## **8\. Atomic Counters**

Per gestire i limiti dei piani SaaS, il sistema utilizza contatori atomici memorizzati a livello di organizzazione.

Questi contatori vengono aggiornati in modo sincrono durante le operazioni di creazione o eliminazione di membri e clienti. L’utilizzo di operazioni atomiche garantisce consistenza anche in presenza di accessi concorrenti.

Questo meccanismo consente di verificare rapidamente se un’organizzazione ha raggiunto i limiti previsti dal proprio piano, evitando query costose.

## **9\. Data Consistency**

La consistenza dei dati è garantita attraverso una combinazione di strategie.

Le operazioni che coinvolgono più documenti vengono eseguite tramite batch, assicurando che tutte le modifiche vengano applicate in modo atomico. In caso di errore, nessuna modifica viene salvata, evitando stati inconsistenti.

Inoltre, il sistema utilizza aggiornamenti ottimistici a livello di interfaccia, migliorando la percezione di reattività senza compromettere l’integrità dei dati.

## **10\. Data Access Patterns**

Il modello dati è progettato per ottimizzare i pattern di accesso più comuni.

Le query sono generalmente limitate a singole collezioni o sotto-collezioni, evitando operazioni complesse. I dati necessari per la visualizzazione sono spesso già disponibili nei documenti principali, riducendo la necessità di elaborazioni lato client.

Questo approccio consente di mantenere tempi di risposta rapidi e di sfruttare al meglio le caratteristiche di Firestore.

## **11\. Security Model**

La sicurezza dei dati è implementata tramite le regole di accesso di Firestore.

Le regole definiscono in modo preciso quali operazioni possono essere eseguite su ciascun documento, in base al ruolo dell’utente e all’organizzazione di appartenenza.

Particolare attenzione è dedicata alla protezione dei dati multi-tenant, assicurando che gli utenti possano accedere esclusivamente ai dati della propria organizzazione.

## **12\. Scalability Considerations**

Il modello dati è progettato per scalare orizzontalmente senza richiedere modifiche strutturali.

L’utilizzo di documenti indipendenti e la distribuzione dei dati su più collezioni consentono di gestire un numero elevato di utenti e operazioni contemporanee.

La struttura adottata è compatibile con le best practice di Firestore, garantendo performance elevate anche in scenari di crescita significativa.