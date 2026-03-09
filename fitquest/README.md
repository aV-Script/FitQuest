# 🏋️ FitQuest — Fitness Gamification App

POC di una web app React per personal trainer che gamifica il percorso fitness dei clienti.

## ✨ Features (POC v0.1)

- **Dashboard Trainer** — lista clienti con ricerca e aggiunta rapida
- **Scheda Cliente** con 5 aree principali:
  - `Top SX` — Nome, Livello, Rank e barra XP
  - `Top DX` — Radar chart pentagonale con 5 parametri (Forza, Resistenza, Flessibilità, Velocità, Recupero)
  - `Centro` — Avatar + barre di progresso statistiche
  - `Bottom SX` — Log attività recenti con XP guadagnati
  - `Bottom DX` — Badge conquistati
- **Form Nuovo Cliente** — nome + scelta avatar
- **Form Level Up** — aggiornamento parametri con slider, note sessione, calcolo XP automatico
- Sistema di **Rank** progressivo: Rookie → Scout → Warrior → Champion → Legend

## 🗂 Struttura progetto

```
fitquest/
├── public/
├── src/
│   ├── components/
│   │   └── FitQuest.jsx      ← componente principale (tutto-in-uno per la POC)
│   ├── firebase/
│   │   ├── config.js         ← credenziali Firebase (da configurare)
│   │   └── services.js       ← CRUD Firestore (placeholder per fase 2)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Come avviare

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia in sviluppo
npm run dev

# 3. Build per produzione
npm run build
```

## 🔥 Roadmap — Fase 2 (Firebase)

- [ ] Firebase Auth per il login del trainer
- [ ] Firestore per persistere clienti e sessioni
- [ ] Profilo cliente accessibile anche dall'app mobile
- [ ] Notifiche push al cliente al level up
- [ ] Leaderboard tra clienti dello stesso trainer
- [ ] Foto profilo via Firebase Storage

## 🛠 Tech Stack

| Layer | Tecnologia |
|-------|-----------|
| UI | React 18 + Vite |
| Styling | CSS-in-JS inline + Google Fonts |
| Backend (fase 2) | Firebase Auth + Firestore |
| Deploy (fase 2) | Firebase Hosting |

---

> **Stato:** POC — dati mock, nessuna persistenza. Pronto per l'integrazione Firebase.
