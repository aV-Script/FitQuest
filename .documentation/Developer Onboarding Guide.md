## **1\. Document Information**

**Project Name:** RankEX  
**Document Title:** Developer Onboarding Guide  
**Version:** 1.0

## **2\. Introduction**

Questo documento fornisce ai nuovi sviluppatori tutte le informazioni necessarie per iniziare a lavorare su RankEX rapidamente e in modo coerente con le best practice del progetto.

Include struttura delle cartelle, convenzioni di codice, flussi principali e regole per aggiungere nuove funzionalità.

## **3\. Project Structure**

Il progetto è organizzato in cartelle chiare:

- src/components → componenti UI riutilizzabili
- src/features → funzionalità specifiche (client, trainer, calendar, etc.)
- src/firebase → servizi e accesso a Firestore
- src/hooks → gestione dello stato e logica condivisa
- src/utils → funzioni pure e helper

Ogni cartella segue un pattern coerente per facilitare la navigazione e la manutenzione.

## **4\. Coding Conventions**

- Nominalizzazione chiara (camelCase per funzioni, SCREAMING_SNAKE_CASE per costanti)
- Booleani con prefisso is / has / can
- Componenti modulari e riutilizzabili
- Logica separata dalla renderizzazione (hooks vs componenti)
- Aggiornamenti ottimistici per migliorare UX

## **5\. Adding Features**

Per aggiungere nuove funzionalità:

- nuovi test → aggiornare constants/tests.js + percentili in utils/tables.js
- nuova pagina trainer → creare componente in features/trainer/ + registrare in trainer.config.js + aggiungere nav item
- nuova pagina Org Admin → aggiungere in org-pages/ + PAGES map + sidebar

## **6\. Environment Setup**

- utilizzare .env per chiavi Firebase e configurazioni ambiente
- distinguere tra sviluppo e produzione
- seguire istruzioni di build e deploy tramite Vite + Firebase Hosting

## **7\. Best Practices for New Developers**

- testare sempre nuove funzionalità in ambiente dev
- rispettare le regole di sicurezza e limitazioni piano
- documentare ogni modifica significativa
- utilizzare gli hook e i servizi già presenti prima di creare logica duplicata