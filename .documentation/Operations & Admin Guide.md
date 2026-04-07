## **1\. Document Information**

**Project Name:** RankEX  
**Document Title:** Operations & Admin Guide  
**Version:** 1.0

## **2\. Introduction**

Questo documento fornisce linee guida operative e procedure per gli amministratori della piattaforma RankEX.  
Include istruzioni su gestione organizzazioni, membri, clienti e monitoraggio dei piani SaaS. L’obiettivo è facilitare la gestione quotidiana e ridurre errori operativi, garantendo efficienza e coerenza con le policy della piattaforma.

## **3\. Organization Management**

Gli amministratori possono creare e configurare nuove organizzazioni, definendo:

- nome
- modulo attivo (Personal Training / Soccer Academy)
- piano SaaS
- owner dell’organizzazione

Le informazioni principali sono memorizzate nel database come documento centrale, con contatori atomici per membri e clienti.

## **4\. Member Management**

Gli Org Admin possono:

- creare nuovi membri del team e assegnare ruoli (Trainer, Staff Readonly)
- modificare ruoli esistenti
- rimuovere membri

Il sistema applica automaticamente i limiti del piano e aggiorna i contatori in modo atomico.

## **5\. Client Management**

Gli amministratori gestiscono i clienti attraverso flussi guidati:

- creazione guidata con step personalizzati in base al modulo
- aggiornamento dati anagrafici e tipo di profilo
- blocco automatico quando il numero massimo di clienti è raggiunto

Le modifiche rispettano sempre le regole di sicurezza e i limiti di piano.

## **6\. Plan & Limits Monitoring**

La piattaforma fornisce strumenti per monitorare:

- utilizzo corrente di membri e clienti
- stato del piano
- avanzamento rispetto ai limiti consentiti

Gli Org Admin ricevono notifiche e visualizzazioni grafiche quando si avvicinano ai limiti.

## **7\. Notifications & Audit**

Il sistema registra azioni critiche in un audit log:

- creazione, modifica, cancellazione di utenti
- operazioni su clienti e sessioni
- login, logout e modifiche di ruolo

I log sono accessibili solo ai Super Admin e garantiscono tracciabilità completa.

## **8\. Best Practices**

- sempre verificare limiti piano prima di aggiungere nuovi membri o clienti
- utilizzare la modalità batch per operazioni multiple
- confermare modifiche irreversibili tramite interfaccia di approvazione