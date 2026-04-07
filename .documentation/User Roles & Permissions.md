## **1\. Document Information**

**Project Name:** RankEX  
**Document Title:** User Roles & Permissions  
**Version:** 1.0

## **2\. Introduction**

Il presente documento descrive il modello di gestione dei ruoli e delle autorizzazioni all’interno della piattaforma RankEX.

L’obiettivo è definire in modo chiaro e strutturato i livelli di accesso previsti dal sistema, specificando per ciascun ruolo le operazioni consentite e le limitazioni applicate. Questo modello rappresenta un elemento chiave per garantire sicurezza, coerenza operativa e corretta separazione delle responsabilità.

Le regole qui descritte devono essere considerate vincolanti sia a livello di interfaccia utente che a livello di sistema.

## **3\. Access Control Model**

RankEX adotta un modello di controllo degli accessi basato sui ruoli (Role-Based Access Control).

Ogni utente è associato a un ruolo che determina le azioni che può eseguire e i dati a cui può accedere. Il sistema combina questo approccio con il modello multi-tenant, assicurando che le autorizzazioni siano sempre limitate all’interno dell’organizzazione di appartenenza.

Il controllo degli accessi viene applicato su due livelli distinti ma complementari. A livello di interfaccia, le funzionalità non disponibili per un determinato ruolo vengono nascoste o disabilitate. A livello di database, le regole di sicurezza impediscono l’esecuzione di operazioni non autorizzate, garantendo protezione anche in caso di accessi diretti.

## **4\. Role Definitions**

La piattaforma prevede cinque ruoli principali, ciascuno progettato per rispondere a specifiche esigenze operative.

Il ruolo di Super Admin rappresenta il livello più alto di accesso e consente la gestione globale della piattaforma. Gli utenti con questo ruolo possono visualizzare e amministrare tutte le organizzazioni, senza limitazioni.

L’Organization Admin è responsabile della gestione completa della propria organizzazione. Questo ruolo include la possibilità di gestire membri del team, clienti e configurazioni operative.

Il Trainer rappresenta il ruolo operativo principale. Gli utenti con questo ruolo possono gestire clienti, sessioni e dati di performance, ma non hanno accesso alle configurazioni organizzative avanzate.

Lo Staff Readonly è un ruolo con accesso limitato alla sola visualizzazione dei dati. Questo profilo è pensato per utenti che necessitano di consultare informazioni senza poter effettuare modifiche.

Infine, il ruolo Client è associato agli utenti finali della piattaforma. Questi utenti possono accedere esclusivamente ai propri dati personali, senza visibilità su altri clienti o funzionalità gestionali.

## **5\. Permissions Model**

Le autorizzazioni sono definite in funzione delle azioni che ciascun ruolo può eseguire.

Il sistema distingue tra operazioni di lettura, creazione, modifica ed eliminazione. Per ogni entità del sistema, come clienti, sessioni o gruppi, viene stabilito quali di queste operazioni sono consentite per ciascun ruolo.

I ruoli operativi, come Organization Admin e Trainer, hanno accesso alle funzionalità necessarie per la gestione quotidiana delle attività. Il livello di accesso è progettato per bilanciare flessibilità operativa e controllo.

I ruoli con accesso limitato, come Staff Readonly e Client, sono progettati per garantire visibilità senza compromettere l’integrità dei dati.

## **6\. Organizational Boundaries**

Un principio fondamentale del sistema è l’isolamento dei dati tra organizzazioni.

Ogni utente può accedere esclusivamente ai dati associati alla propria organizzazione. Questo vale per tutte le entità del sistema, inclusi clienti, gruppi, sessioni e notifiche.

Il sistema verifica costantemente che le operazioni richieste siano coerenti con l’organizzazione dell’utente, impedendo qualsiasi accesso non autorizzato.

## **7\. Client Access Model**

Gli utenti con ruolo Client hanno un accesso estremamente limitato e focalizzato esclusivamente sui propri dati.

Essi possono visualizzare informazioni relative alle proprie performance, sessioni e progressi, ma non possono accedere a dati relativi ad altri utenti o modificare informazioni critiche.

Questo modello garantisce privacy e sicurezza, mantenendo al contempo un’esperienza utente semplice e intuitiva.

## **8\. Readonly Mode Behavior**

Il ruolo Staff Readonly introduce una modalità di sola lettura all’interno della piattaforma.

In questo stato, tutte le funzionalità di modifica vengono disabilitate. L’interfaccia utente riflette chiaramente questa condizione, evitando ambiguità e prevenendo errori operativi.

Nonostante le limitazioni, l’utente mantiene accesso completo alle informazioni necessarie per attività di monitoraggio e analisi.

## **9\. Role Assignment and Management**

L’assegnazione e la gestione dei ruoli avviene a livello di organizzazione.

Gli Organization Admin possono creare nuovi membri del team e assegnare loro un ruolo specifico. Possono inoltre modificare i ruoli esistenti, nel rispetto delle regole di sicurezza definite dal sistema.

Le modifiche ai ruoli hanno effetto immediato e influenzano direttamente le autorizzazioni dell’utente.

## **10\. Security Enforcement**

Le regole di sicurezza sono implementate a livello di database tramite meccanismi che verificano il ruolo e l’organizzazione dell’utente prima di consentire qualsiasi operazione.

Questo approccio garantisce che anche in caso di accessi diretti al database o manipolazioni lato client, le operazioni non autorizzate vengano bloccate.

Il sistema è progettato per essere “secure by default”, minimizzando il rischio di accessi non controllati.

## **11\. Exception Handling**

In alcuni casi specifici, possono essere previste eccezioni controllate alle regole standard.

Ad esempio, il ruolo di Super Admin può bypassare alcune limitazioni per esigenze di supporto o manutenzione. Tali eccezioni sono limitate e gestite in modo esplicito.

Non sono previste eccezioni per quanto riguarda l’isolamento dei dati tra organizzazioni.