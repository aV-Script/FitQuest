# RankEX — Documento Tecnico

## Stack
- React 18 + Vite
- Firebase (Auth + Firestore + Hosting multisito)
- Tailwind CSS v4
- React Router v6
- Recharts (grafici)

---

## Prodotto

RankEX è una piattaforma SaaS multi-tenant per il tracking
delle performance atletiche. Supporta due moduli di dominio
con terminologie, test e comportamenti UI diversi.

### Moduli

**personal_training** — PT e GYM
- Categorie cliente: `health` / `active` / `athlete`
- Test: 5 per categoria (13 totali, alcuni condivisi)
- Terminologia PT:  Trainer / Cliente / Gruppo / Sessione
- Terminologia GYM: Personal Trainer / Membro / Classe / Allenamento
- Profili: `tests_only` / `bia_only` / `complete`

**soccer_academy** — accademie calcistiche
- Fasce d'età: `soccer` (Senior ≥10 anni) / `soccer_youth` (Piccoli ≤9 anni)
- Ruolo è solo etichetta visiva: `goalkeeper` / `defender` / `midfielder` / `forward`
- Test fissi per entrambe le fasce: `y_balance`, `standing_long_jump`,
  `505_cod_agility`, `sprint_20m`, `beep_test`
- Terminologia: Coach / Allievo / Squadra / Allenamento
- Profili: `tests_only` (unico)
- `client.categoria` = `'soccer'` o `'soccer_youth'` — chiave interna
  per `getTestsForCategoria`. Non è mostrata in UI (il ruolo è il badge visivo)
- Configurazione fasce: `SOCCER_AGE_GROUPS` in `config/modules.config.js`

### Profili cliente (`profileType`)
```
tests_only → solo test, ha rank                     (tutti i moduli)
bia_only   → solo BIA, no rank                      (solo PT)
complete   → test + BIA, rank calcolato solo dai test (solo PT)
```

---

## Architettura account

### Tipo account
Tutti gli utenti appartengono a una organizzazione.
Un personal trainer solo = organizzazione con 1 membro.

### Ruoli utente
```
super_admin      → visibilità globale, customer service
org_admin        → gestione completa della propria org
trainer          → lettura + scrittura operativa
staff_readonly   → solo lettura
client           → solo i propri dati
```

### Documento utente in Firestore
**IMPORTANTE:** Solo gli utenti con ruolo
`super_admin`, `org_admin`, `trainer`, `staff_readonly`
hanno un documento in `/users/{uid}`.

I client **hanno** un documento `/users/{uid}` (creato da
`createClientUseCase`), ma i loro dati operativi (stats,
campionamenti, ecc.) stanno in
`/organizations/{orgId}/clients/{clientId}`.
Il documento `/users/{uid}` del client contiene:
`{ role: 'client', orgId, clientId, trainerId, mustChangePassword }`.

---

## Struttura Firestore

```
users/{uid}
  role, orgId, clientId, moduleType,
  terminologyVariant, mustChangePassword

organizations/{orgId}
  name, moduleType, terminologyVariant,
  plan, ownerId, status, createdAt,
  memberCount,   // counter atomico — aggiornato via batch in addMember/removeMember
  clientCount    // counter atomico — aggiornato via batch in addClient/deleteClient

  members/{uid}
    role, name, email, joinedAt

  clients/{clientId}
    notes/{noteId}       // thread + commenti — subcollection del cliente
  slots/{slotId}
  groups/{groupId}
  recurrences/{recId}
  notifications/{notId}
  workoutPlans/{planId}

audit_logs/{logId}
  action, uid, email, timestamp,
  userAgent, details, env
  // append-only — solo super_admin legge, mai modificabile
```

### Path helpers
Tutti i path Firestore passano da `src/firebase/paths.js`:
```js
clientsPath(orgId)            → organizations/{orgId}/clients
slotsPath(orgId)              → organizations/{orgId}/slots
groupsPath(orgId)             → organizations/{orgId}/groups
recurrencesPath(orgId)        → organizations/{orgId}/recurrences
notificationsPath(orgId)      → organizations/{orgId}/notifications
notesPath(orgId, clientId)    → organizations/{orgId}/clients/{clientId}/notes
workoutPlansPath(orgId)       → organizations/{orgId}/workoutPlans
```

### Firestore Rules — pattern corretto

`userProfile()` restituisce `{}` se il documento non esiste
(null-safe tramite `let p = get(...); return p == null ? {} : p.data`).

I client leggono `/organizations/{orgId}` tramite `isClientOfOrg(orgId)`:
```js
function isClientOfOrg(orgId) {
  return isAuth() && userProfile().role == 'client' && userProfile().orgId == orgId;
}
```

Org_admin può aggiornare `role` negli `/users/{uid}` dei propri membri
tramite `isOrgAdminForMember(targetUid)` (rule separata nel file).

### Firestore Rules — limiti piano

I limiti sono applicati **solo su `create`** (non su update/delete).
`super_admin` bypassa sempre entrambi i limiti.

```js
// Orgs senza memberCount/clientCount (esistenti prima del feature) → bypass automatico
function withinTrainerLimit(orgId) {
  let org   = get(/organizations/$(orgId)).data;
  let limit = org.plan == 'enterprise' ? 999999 : org.plan == 'pro' ? 5 : 1;
  return !('memberCount' in org) || org.memberCount < limit;
}
function withinClientLimit(orgId) {
  let org   = get(/organizations/$(orgId)).data;
  let limit = org.plan == 'enterprise' ? 999999 : org.plan == 'pro' ? 100 : 10;
  return !('clientCount' in org) || org.clientCount < limit;
}
```

Le regole Firestore **non supportano `if/return`** dentro le funzioni:
usare solo espressioni booleane (`&&`, `||`, ternario).

---

## Piani SaaS

Fonte di verità: `src/config/plans.config.js`

```
free:       1 trainer  ·  10 clienti
pro:        5 trainer  · 100 clienti
enterprise: illimitati
```

I counter `memberCount` e `clientCount` sono mantenuti
**atomicamente** via batch write su ogni add/remove:
- `addMember` / `removeMember` → `increment(±1)` su `org.memberCount`
- `addClient` / `deleteClient` → `increment(±1)` su `org.clientCount`

**UI — blocchi al limite:**
- `MembersPage`: banner giallo + bottone "AGGIUNGI" disabilitato
- `NewClientView`: schermata di blocco invece del wizard
- `OrgSettingsPage`: select piano con descrizione limiti dinamica
- `OrgDetailView` (super_admin): barre progresso utilizzo trainer/clienti

```js
// Import corretto
import { getPlanLimits, isAtTrainerLimit, isAtClientLimit } from 'config/plans.config'
```

---

## Modelli dati

### Cliente (`clients/{clientId}`)
```js
{
  name, eta, sesso, peso, altezza,
  email, clientAuthUid,
  categoria,       // 'health'|'active'|'athlete'|'soccer'|'soccer_youth'
  profileType,     // 'tests_only'|'bia_only'|'complete'
  ruolo,           // solo soccer: 'goalkeeper'|'defender'|'midfielder'|'forward'
  level, xp, xpNext,
  rank, rankColor, media,
  stats:           {},
  campionamenti:   [],
  log:             [],
  sessionsPerWeek,
  biaHistory:      [],
  lastBia:         null,
}
```

### Nota (`clients/{clientId}/notes/{noteId}`)
```js
{
  text,
  authorId,    // Firebase Auth UID
  authorName,  // nome visibile
  authorRole,  // 'trainer'|'org_admin'|'staff_readonly'|'client'
  parentId,    // null = thread root | noteId = commento del thread
  createdAt,
}
```
Pattern thread: `parentId === null` = nota principale; `parentId = noteId` = commento.
**Regola:** il client può creare solo commenti (`parentId != null`) su thread esistenti.
Il trainer gestisce la cancellazione a cascata (nota root + suoi commenti) lato app.

### Scheda Allenamento (`workoutPlans/{planId}`)
```js
{
  title, description,
  clientId,    // cliente assegnato
  exercises: [
    { name, sets, reps, restSeconds, notes }
  ],
  status:    'active'|'archived',
  createdAt, updatedAt,
}
```
`exercises` è un array nel documento (max ~30 esercizi, ampiamente sotto il limite 1MB).
Il client vede la scheda `active` assegnata a sé in read-only nella propria dashboard.

### Slot (`slots/{slotId}`)
```js
{
  date, startTime, endTime,
  clientIds:   [],
  groupIds:    [],
  status:      'planned'|'completed'|'skipped',
  attendees:   [],   // presenti — ricevono XP
  absentees:   [],   // assenti — nessun XP
  recurrenceId: null,
  createdAt,
}
```

### Ricorrenza (`recurrences/{recId}`)
```js
{
  clientIds, groupIds,
  days:       [],          // [1,3,5] = Lun/Mer/Ven
  startDate, endDate,
  startTime, endTime,
  status:     'active'|'ended'|'cancelled',
  createdAt,
}
```

### Gruppo (`groups/{groupId}`)
```js
{ name, clientIds: [] }
```

### Notifica (`notifications/{notId}`)
```js
{ clientId, message, date, type, read, readAt, createdAt }
```

### BIA — singola misurazione
```js
{
  date,
  fatMassPercent, muscleMassKg,
  waterPercent, boneMassKg,
  bmi,          // calcolato automaticamente
  bmrKcal, metabolicAge, visceralFat,
}
```

---

## Struttura cartelle

```
src/
├── app/
│   ├── App.jsx
│   ├── AppRouter.jsx        ← routing per ruolo
│   └── routes.config.jsx
│
├── components/
│   ├── common/
│   │   ├── ConfirmDialog.jsx
│   │   ├── DomainGuard.jsx      ← blocco bidirezionale per dominio+ruolo
│   │   ├── ErrorBoundary.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── Pagination.jsx
│   │   ├── ReadonlyBanner.jsx
│   │   └── ReadonlyGuard.jsx
│   ├── layout/
│   │   ├── TrainerShell.jsx
│   │   └── trainer-shell/
│   │       ├── Sidebar.jsx
│   │       ├── MobileNav.jsx
│   │       ├── SidebarIcon.jsx
│   │       ├── TabItem.jsx
│   │       └── navItems.config.jsx  ← NAV_ITEMS + ORG_ADMIN_NAV_ITEMS
│   └── ui/
│       ├── index.jsx        ← Card, Button, Badge, Modal, Field,
│       │                       StatNumber, EmptyState, Skeleton,
│       │                       ActivityLog, StatsSection, Divider
│       ├── XPBar.jsx
│       ├── Pentagon.jsx
│       └── RankRing.jsx
│
├── config/
│   ├── modules.config.js    ← MODULES, TERMINOLOGIES, PLAYER_ROLES,
│   │                           SOCCER_FIXED_TESTS, SOCCER_AGE_GROUPS
│   ├── plans.config.js      ← PLAN_LIMITS, getPlanLimits,
│   │                           isAtTrainerLimit, isAtClientLimit
│   └── theme.js             ← palette colori RankEX
│
├── constants/
│   ├── index.js             ← RANKS, CATEGORIE, NEW_CLIENT_DEFAULTS,
│   │                           getRankFromMedia, getCategoriaById,
│   │                           getStatsConfig, getTestsForCategoria
│   ├── tests.js             ← ALL_TESTS con key, stat, label, unit,
│   │                           direction, ageGroup, categories, guide
│   ├── formulas.js          ← applyFormula
│   └── bia.js               ← BIA_PARAMS, PROFILE_CATEGORIES,
│                               FAT_MASS_RANGES, WATER_RANGES,
│                               VISCERAL_RANGES, BMI_RANGES, XP_BIA
│
├── context/
│   ├── TrainerContext.jsx   ← selectedClient, orgId, moduleType,
│   │                           terminology, userRole, orgPlan
│   ├── ReadonlyContext.jsx  ← readonly boolean
│   └── ToastContext.jsx
│
├── design/
│   └── tokens.js            ← SPACE, TYPE, COLOR, GRADIENT,
│                               SHADOW, RADIUS, MOTION, Z
│
├── features/
│   ├── admin/               ← area super_admin
│   │   ├── AdminShell.jsx   ← sidebar con accent rosso
│   │   ├── SuperAdminView.jsx
│   │   └── admin-pages/
│   │       ├── AdminDashboard.jsx  ← stat + piano breakdown + orgs recenti
│   │       ├── AdminProfilePage.jsx ← modifica email e password
│   │       ├── OrgsPage.jsx
│   │       ├── OrgDetailView.jsx   ← utilizzo piano (barre progresso)
│   │       └── CreateOrgForm.jsx   ← ownerId popolato con uid super_admin
│   │
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── useAuth.js       ← carica user + profile + org + terminology
│   │   ├── useLoginForm.js
│   │   └── components/
│   │       ├── BrandingPanel.jsx   ← semi-trasparente, credit "by Dr. Lamberti Valerio"
│   │       ├── LoginForm.jsx
│   │       └── ResetForm.jsx
│   │
│   ├── bia/
│   │   ├── useBia.js        ← no args — gets orgId from useTrainerState()
│   │   ├── BiaView.jsx
│   │   ├── BiaLockedPanel.jsx
│   │   ├── UpgradeCategoryBanner.jsx
│   │   └── bia-view/
│   │       ├── BiaGaugeBar.jsx
│   │       ├── BiaSummary.jsx
│   │       └── BiaHistoryChart.jsx
│   │
│   ├── calendar/
│   │   ├── useCalendar.js
│   │   ├── useRecurrences.js
│   │   └── calendarGroupUtils.js
│   │
│   ├── client/              ← area cliente (role: client)
│   │   ├── ClientView.jsx
│   │   ├── useClient.js     ← useClient(orgId, clientId)
│   │   ├── CampionamentoView.jsx
│   │   ├── ClientCalendar.jsx
│   │   ├── PlayerCard.jsx
│   │   ├── StatsChart.jsx
│   │   ├── ChangePasswordScreen.jsx
│   │   ├── client-view/
│   │   │   ├── ClientShell.jsx
│   │   │   ├── ClientDashboardPage.jsx
│   │   │   ├── ClientProfilePage.jsx
│   │   │   └── client.config.jsx
│   │   └── client-dashboard/
│   │       ├── DashboardHeader.jsx
│   │       ├── DeleteDialog.jsx
│   │       ├── ClientSessionsSummary.jsx
│   │       ├── NotesSection.jsx         ← thread note + commenti (trainer+client)
│   │       ├── ClientWorkoutSection.jsx ← scheda allenamento read-only (client)
│   │       └── ClientReportPrint.jsx    ← export PDF via window.print() (trainer)
│   │
│   ├── notification/
│   │   └── NotificationsPanel.jsx
│   │
│   ├── org/                 ← area org_admin
│   │   ├── OrgAdminView.jsx
│   │   └── org-pages/
│   │       ├── OrgDashboard.jsx
│   │       ├── MembersPage.jsx     ← limite piano: banner + blocco aggiungi
│   │       ├── OrgSettingsPage.jsx ← select piano con limiti visibili
│   │       └── CreateMemberForm.jsx
│   │
│   └── trainer/             ← area trainer / staff_readonly
│       ├── TrainerView.jsx
│       ├── trainer.config.jsx
│       ├── ClientsPage.jsx
│       ├── GroupsPage.jsx
│       ├── TrainerCalendar.jsx
│       ├── RecurrencesPage.jsx    ← active default + archivio collassabile + paginazione
│       ├── NewClientView.jsx      ← blocco se al limite clienti del piano
│       ├── TestGuidePage.jsx
│       ├── ProfilePage.jsx        ← modifica email e password
│       ├── WorkoutPlansPage.jsx   ← lista schede con filtro cliente + archivio
│       ├── clients-page/
│       │   ├── ClientCard.jsx        ← badge categoria (PT) / ruolo+fascia (Soccer)
│       │   ├── FiltersSidebar.jsx    ← filtro categoria/ruolo/fascia per moduleType
│       │   └── MobileControls.jsx
│       ├── workout-plans/
│       │   ├── WorkoutPlanCard.jsx
│       │   ├── WorkoutPlanDetail.jsx ← dettaglio con archivio/elimina
│       │   └── WorkoutPlanForm.jsx   ← form creazione esercizi
│       ├── groups-page/
│       │   ├── GroupCard.jsx
│       │   ├── GroupDetailView.jsx
│       │   ├── GroupsSidebar.jsx
│       │   └── GroupToggleDialog.jsx
│       ├── trainer-calendar/
│       │   ├── CalendarHeader.jsx    ← bottoni uniformati (entrambi filled)
│       │   ├── WeekView.jsx
│       │   ├── MonthView.jsx
│       │   ├── DayView.jsx
│       │   ├── EventBlock.jsx
│       │   ├── SlotPopup.jsx
│       │   ├── CloseSessionModal.jsx
│       │   ├── AddSlotModal.jsx
│       │   └── RecurrenceModal.jsx
│       └── recurrences-page/
│           ├── RecurrenceCard.jsx
│           └── RecurrenceDetailView.jsx ← header giorni+orario, layout 2 col,
│                                           ricerca clienti, settimane calcolate
│
│   (wizard)
│   components/modals/new-client-wizard/
│       ├── steps/StepRuolo.jsx  ← step ruolo per soccer_academy
│       └── steps/StepFascia.jsx ← step fascia d'età per soccer_academy
│
├── firebase/
│   ├── config.js
│   ├── paths.js             ← path helpers subcollection
│   └── services/
│       ├── auth.js          ← changeTrainerPassword, changeUserEmail
│       │                       (verifyBeforeUpdateEmail — link verifica)
│       ├── calendar.js      ← tutte le fn accettano orgId come primo arg
│       ├── clients.js       ← addClient/deleteClient usano batch + increment
│       ├── db.js
│       ├── groups.js        ← tutte le fn accettano orgId come primo arg
│       ├── notifications.js ← tutte le fn accettano orgId come primo arg
│       ├── notes.js         ← getNotes, addNote, deleteNoteItem (orgId, clientId)
│       ├── org.js           ← addMember/removeMember usano batch + increment
│       ├── workoutPlans.js  ← getWorkoutPlans, getWorkoutPlanForClient, addWorkoutPlan, update, delete (orgId)
│       └── users.js
│
├── hooks/
│   ├── useAsync.js
│   ├── useClientRank.js
│   ├── useClients.js           ← useClients(orgId, userId?)
│   ├── useGroups.js            ← useGroups(orgId)
│   ├── useNotifications.js     ← useNotifications(orgId, clientId)
│   ├── useNotes.js             ← useNotes(orgId, clientId, author) → threads
│   ├── usePagination.js
│   ├── useSessionTimeout.js    ← logout automatico per inattività
│   ├── useToast.js
│   └── useWorkoutPlans.js      ← useWorkoutPlans(orgId) → plans + CRUD
│
└── utils/
    ├── auditLog.js          ← auditLog(action, details?) + AUDIT_ACTIONS
    ├── bia.js               ← getBiaParamStatus, calcBmi,
    │                           calcBiaXP, calcBiaScore
    ├── calendarUtils.js     ← utility date/slot helpers
    ├── env.js               ← ENV, isDev, isProduction, isAdminDomain()
    ├── firebaseErrors.js
    ├── gamification.js      ← calcSessionConfig, buildXPUpdate,
    │                           buildCampionamentoUpdate, buildNewClient,
    │                           buildBiaUpdate, buildProfileUpgrade
    ├── percentile.js        ← calcPercentile(stat, val, sex, age, testKey?)
    │                           calcStatMedia
    ├── tables.js            ← TABLES (dati grezzi percentili)
    └── validation.js
```

---

## Principi architetturali

### Separation of concerns
```
Hook        → logica, stato, fetch Firestore
Componenti  → render, composizione UI
Services    → I/O Firebase, nessuna logica
Utils       → funzioni pure, nessun side effect
Config      → dati statici, nessuna logica
```

### Ottimistic updates — pattern uniforme
```js
const snapshot = state
setState(optimisticValue)   // 1. aggiorna UI subito
try {
  await firestoreCall()     // 2. chiama Firestore
} catch {
  setState(snapshot)        // 3. rollback se errore
}
```

### Single source of truth
```
constants/tests.js       → direction, ageGroup, guide, categories
constants/bia.js         → range clinici, XP_BIA
config/modules.config.js → terminologia, test fissi per modulo
config/plans.config.js   → limiti piano (trainer, clienti)
utils/gamification.js    → calcSessionConfig, XP, rank
design/tokens.js         → spacing, colori, motion, shadow
```

### Data-driven UI
```
trainer.config.js           → PAGES map (id → componente)
routes.config.jsx           → PROTECTED_ROUTES per ruolo
trainer-shell/navItems.config.jsx → NAV_ITEMS + ORG_ADMIN_NAV_ITEMS
modules.config.js           → comportamento per moduleType
plans.config.js             → PLAN_LIMITS, PLAN_OPTIONS
```

### Readonly mode (staff_readonly)
```
ReadonlyContext  → boolean globale
ReadonlyGuard    → nasconde elementi di modifica
ReadonlyBanner   → banner informativo in cima
```

### orgId come primo argomento
Tutte le funzioni service e tutti gli hook operativi accettano
`orgId` come primo parametro. Per i trainer,
`orgId = profile?.orgId ?? user.uid`
(backward compat: trainer solo usano il proprio uid come orgId).

---

## Comportamento UI per modulo

Il `moduleType` è disponibile in tutta l'area trainer tramite
`useTrainerState()` → `{ moduleType, orgPlan }`. Il flag booleano
`getModule(moduleType).isSoccer` è la fonte di verità per
qualsiasi ramificazione condizionale.

### ClientsPage — differenze soccer vs PT
| Aspetto               | personal_training        | soccer_academy                      |
|-----------------------|--------------------------|-------------------------------------|
| Colonna identificativa| Categoria (health/active…)| Ruolo (portiere/…)                 |
| Badge sul client card | categoria colorata        | ruolo colorato + badge "Piccoli" (giallo) se soccer_youth |
| Filtro laterale       | per categoria            | per ruolo + FASCIA (se presenti entrambe) |

Filtro FASCIA in `FiltersSidebar` appare **solo** quando ci sono allievi sia Senior
che Piccoli (cioè `fasce.length > 1`). Gestito in `useClientFilters.js`.

### NewClientView — differenze soccer vs PT
| Campo                | personal_training         | soccer_academy               |
|----------------------|---------------------------|------------------------------|
| Categoria            | select obbligatorio        | NON mostrare                 |
| Fascia d'età         | NON mostrare               | StepFascia (soccer/soccer_youth) |
| Ruolo                | NON mostrare               | StepRuolo da PLAYER_ROLES    |
| `categoria` salvato  | valore selezionato         | valore da StepFascia         |
| `profileType`        | select (tests/bia/complete)| sempre `'tests_only'`        |

Wizard soccer: **4 step fissi** (anagrafica → fascia → ruolo → account).
`TOTAL_STEPS_MAP.soccer = 4` in `wizard.config.js`.
`isSoccer` viene da `useTrainerState()` → `getModule(moduleType).isSoccer`.

**Blocco piano:** se `clients.length >= getPlanLimits(orgPlan).clients`,
NewClientView mostra una schermata di blocco invece del wizard.

### TestGuidePage — filtraggio per modulo
La guida deve mostrare solo i test pertinenti al modulo:
- PT: test filtrati per `client.categoria` o tutti e 13
- Soccer: solo i 5 test fissi (`SOCCER_FIXED_TESTS`)

```js
// Logica corretta per ottenere i test da mostrare
const tests = isSoccer
  ? ALL_TESTS.filter(t => t.categories.includes('soccer'))
  : ALL_TESTS   // o filtrati per la categoria selezionata
```

### RecurrencesPage — filtraggio status
Mostrare solo ricorrenze con `status === 'active'` (default).
Le ricorrenze `'ended'` e `'cancelled'` sono collassate in una
sezione "Archivio" in fondo alla pagina (toggle `showArchive`, default false).
La lista attive è paginata (10 per pagina).

---

## Calcolo percentili — nota tecnica

`calcPercentile(stat, value, sex, age, testKey?)` in
`utils/percentile.js` accetta un quinto parametro opzionale
`testKey`. Quando fornito, cerca il test per `key` invece
che per `stat`. Questo risolve l'ambiguità quando due test
diversi condividono lo stesso `stat`
(es. `ymca_step_test` e `yo_yo_ir1` entrambi `stat:'resistenza'`).

**Regola:** in `useCampionamento.js`, passare sempre `test.key`
come quinto argomento a `calcPercentile`.

---

## Design system

### Background brand (CSS-only)
Il background globale è definito su `html` in `src/index.css` — nessuna immagine esterna.
Layer in ordine (dal basso all'alto):
```
1. Base color           #06080d
2. Vignette perimetrale radial-gradient scuro ai bordi
3. Green glow           bordo sinistro — rgba(15,214,90,0.20) — luce ambientale logo
4. Cyan trace           angolo top-right — rgba(0,200,255,0.10) — fulmine elettrico
5. Pentagon pattern     SVG tile 120×116px — stroke ciano 0.07 opacity
6. Rectangular grid     linear-gradient orizzontale + verticale — 40×40px, 0.028 opacity
```
`body` e `#root` hanno `background: transparent` per lasciar vedere il layer html.
La sidebar usa `bg-black/50 backdrop-blur-md` per effetto frosted glass sulla texture.

### Font
```
font-display → Montserrat (titoli, label, bottoni, numeri grandi)
font-body    → Inter (testo corrente, descrizioni)
```

### Elevation — 5 livelli
```
L0 bg-base     #07090e  → background puro
L1 bg-surface  #0c1219  → surface principale + border
L2 bg-raised   #0f1820  → card elevata + shadow
L3 bg-overlay  #131e2a  → modal/overlay + shadow forte
L4 bg-float    #1a2638  → tooltip/dropdown
```

### Colori brand (dal logo)
```
Verde neon:   #1dff6b   → bordi luminosi della R
Verde corpo:  #0ec452   → colore primario UI
Verde scuro:  #085c28   → ombre
Ciano:        #2ecfff   → fulmine elettrico
Ciano bright: #5dd4ff   → alone
Blu:          #1a7fd4   → freccia X
Rosso admin:  #f87171   → accent area super_admin
```

### Select / dropdown — regola CSS
Gli elementi `<select>` devono usare `.input-base` **e** avere
esplicitamente `color` e `background` impostati per garantire
la leggibilità su tutti i browser (i browser applicano stili
nativi bianchi/grigi di default):
```css
/* Pattern corretto */
.input-base {
  color: var(--text-primary);
  background: var(--bg-surface);
}
/* Anche le option devono ereditare il colore */
select.input-base option {
  background: var(--bg-overlay);
  color: var(--text-primary);
}
```

### Classi CSS globali
```
.card                → card base con elevation
.card-interactive    → card cliccabile con hover
.card-green          → card con accent verde
.btn .btn-primary    → bottone gradiente
.btn .btn-ghost      → bottone outline
.badge .badge-green  → badge colorato
.type-display        → numero grande 48px/900
.type-label          → label 11px/700/uppercase
.type-caption        → caption 10px/600/uppercase
.animate-fade-up     → animazione entrata
.stagger             → stagger animation sui figli
.skeleton            → loading placeholder
.text-gradient       → testo con gradiente logo
.input-base          → input standard con focus verde
.rx-hex-bg           → pattern esagonale decorativo (usato in BrandingPanel)
.bg-hex              → alias pattern esagonale
```

### Token principali (CSS variables)
```
--bg-base, --bg-surface, --bg-raised, --bg-overlay
--border-subtle, --border-default, --border-strong, --border-focus
--text-primary, --text-secondary, --text-tertiary
--green-400, --cyan-400, --gradient-primary
--shadow-md, --shadow-lg, --shadow-green, --shadow-cyan
--duration-fast, --duration-normal, --ease-standard, --ease-spring
--radius-sm, --radius-lg, --radius-xl, --radius-2xl
```

---

## Test atletici

### personal_training — per categoria
```
health (5):   sit_and_reach, flamingo_test, ymca_step_test,
              dinamometro_hand_grip, sit_to_stand
active (5):   y_balance, dinamometro_hand_grip, ymca_step_test,
              standing_long_jump, sprint_10m
athlete (5):  drop_jump_rsi, t_test_agility, yo_yo_ir1,
              sprint_20m, cmj
```
`dinamometro_hand_grip` e `ymca_step_test` condivisi
tra health e active → `categories: ['health', 'active']`

### soccer_academy — fissi per tutte le fasce
```
y_balance, standing_long_jump, 505_cod_agility,
sprint_20m, beep_test
```
Entrambe le fasce (Senior e Piccoli) usano gli stessi test per ora.
Ogni test ha `categories: ['soccer', 'soccer_youth']`
(o `['active', 'soccer', 'soccer_youth']` per test condivisi con PT).
Quando verranno definiti test differenziati per Piccoli, basta aggiungere
nuovi test con `categories: ['soccer_youth']` in `constants/tests.js`.

### Y Balance Test — formula bilaterale
Il test raccoglie i valori di **entrambi gli arti** (DX e SX) separatamente:
```
variables: ANT_dx, PM_dx, PL_dx, ANT_sx, PM_sx, PL_sx, lunghezzaArto
formulaType: 'y_balance_composite'
```
La formula calcola il Composite Score per ciascun arto e ne restituisce la media:
```js
dx = (ANT_dx + PM_dx + PL_dx) / (3 × lunghezzaArto) × 100
sx = (ANT_sx + PM_sx + PL_sx) / (3 × lunghezzaArto) × 100
result = (dx + sx) / 2
```
`lunghezzaArto`: da ASIS al malleolo mediale (una sola misura, arto dominante).

---

## Gamification

```js
MONTHLY_XP_TARGET    = 500
BONUS_XP_FULL_MONTH  = 200
WEEKS_PER_MONTH      = 4.33
XP_PER_LEVEL_MULTIPLIER = 1.3
XP_PER_CAMPIONAMENTO    = 50

calcSessionConfig(sessionsPerWeek)
  → { monthlySessions, xpPerSession }

XP_BIA = {
  FIRST_MEASUREMENT: 100,
  IMPROVEMENT:       75,   // ≥2 parametri chiave migliorati
  MAINTENANCE:       25,
  REGRESSION:        0,
}
```

Il rank dipende SOLO dai test atletici — mai dalla BIA.

---

## BIA — Bioimpedenziometria

### Profili cliente (solo personal_training)
```
tests_only → solo test, ha rank
bia_only   → solo BIA, no rank
complete   → test + BIA, rank solo da test
```
Soccer academy: solo `tests_only`. BIA non supportata.

### Upgrade categoria
```
tests_only → complete:
  mantiene stats/campionamenti, azzera biaHistory

bia_only → complete:
  mantiene biaHistory, azzera stats/campionamenti
```

### Parametri BIA
```
fatMassPercent  direction: inverse  (meno è meglio)
muscleMassKg    direction: direct
waterPercent    direction: direct
boneMassKg      direction: direct
bmi             direction: neutral  computed: true
bmrKcal         direction: neutral
metabolicAge    direction: inverse
visceralFat     direction: inverse  (scala 1-12)
```

---

## Calendario

```
Vista default: settimana
Viste: month | week | day

handleCloseSlot(slotId, attendeeIds, clientsData)
  → XP solo agli attendees
  → notifica agli absentees

handleSkipSlot(slotId)
  → status: 'skipped', nessun XP

Ricorrenza come entità di primo livello:
  status: 'active' | 'ended' | 'cancelled'
  modifica orario → aggiorna slot futuri
  cancella → elimina slot futuri
  clientIds sync con slot futuri via addClientToRecurrence
```

### Sync gruppo/calendario
```
Toggle cliente in gruppo →
  GroupToggleDialog mostra preview (slot futuri + ricorrenze)
  Conferma →
    1. aggiorna group.clientIds
    2. aggiorna slot futuri non ricorrenti
    3. aggiorna ricorrenze attive + loro slot futuri
  Slot passati → invariati
```

---

## Routing per ruolo

```
super_admin    → SuperAdminView  (AdminShell, accent rosso)
org_admin      → OrgAdminView   (TrainerView + pagine org)
trainer        → TrainerView
staff_readonly → TrainerView con readonly=true
client         → ClientView
```

---

## Convenzioni codice

### Naming
```
Handler interni:  handleNomeAzione
Callback props:   onNomeEvento
Booleani:         isLoading, hasClients, canSave
Array:            clients.map(client => ...)  (mai c => ...)
Costanti:         SCREAMING_SNAKE_CASE
Magic numbers:    sempre come costante nominata
```

### Import — fonte corretta
```
calcSessionConfig      → utils/gamification
calcMonthlyCompletion  → features/calendar/useCalendar
getProfileCategory     → constants/bia
getModule              → config/modules.config
getTerminology         → config/modules.config
SOCCER_AGE_GROUPS      → config/modules.config
isSoccer               → getModule(moduleType).isSoccer
getPlanLimits          → config/plans.config
orgPlan                → useTrainerState().orgPlan
auditLog               → utils/auditLog
AUDIT_ACTIONS          → utils/auditLog
isDev / isProduction   → utils/env
isAdminDomain          → utils/env
useNotes               → hooks/useNotes
useWorkoutPlans        → hooks/useWorkoutPlans
getWorkoutPlanForClient → firebase/services/workoutPlans (lato client, query filtrata)
```

### Ordine sezioni in ogni file
```
1. Import esterni
2. Import interni (hooks → utils → components → constants)
3. Costanti locali
4. Componente/hook principale
5. Componenti locali
6. Funzioni helper pure
```

---

## Checklist: aggiungere funzionalità

### Nuovo test atletico
1. Aggiungi in `constants/tests.js` con tutti i campi
2. Aggiungi tabella percentili in `utils/tables.js`
3. Se soccer → `categories: ['soccer', 'soccer_youth']` (entrambe le fasce)
4. Nessun altro file da modificare

### Nuova pagina trainer
1. Crea componente in `features/trainer/`
2. Aggiungi in `features/trainer/trainer.config.jsx`
3. Aggiungi in `trainer-shell/navItems.config.jsx` (NAV_ITEMS)
4. Nessun altro file da modificare

### Note/commenti per un cliente
Struttura: `clients/{clientId}/notes/{noteId}` (subcollection del cliente).
- Service: `firebase/services/notes.js`
- Hook: `useNotes(orgId, clientId, { role, name })` in `hooks/useNotes.js`
- UI trainer: `NotesSection` già integrata in `ClientDashboard`
- UI client: `NotesSection` già integrata in `ClientDashboardPage`
- Rules: già presenti in `firestore.rules` (client crea solo commenti)

### Scheda allenamento
Struttura: `organizations/{orgId}/workoutPlans/{planId}`.
- Service: `firebase/services/workoutPlans.js`
  - `getWorkoutPlans(orgId)` — usato dal trainer (legge tutta la collection)
  - `getWorkoutPlanForClient(orgId, clientId)` — usato dal client (filtra per clientId, single-field index automatico)
- Hook: `useWorkoutPlans(orgId)` in `hooks/useWorkoutPlans.js`
- UI trainer: `WorkoutPlansPage` + subcomponenti in `workout-plans/`
- UI client: `ClientWorkoutSection` in `client-dashboard/` (read-only, scheda attiva)
- Rules: `allow read: if canRead(orgId) || isClientOfOrg(orgId)` — semplificato
  perché `resource.data.clientId == userProfile().clientId` non è valutabile
  da Firestore a query-plan time su collection query.

### Export PDF atleta
- Componente: `ClientReportPrint.jsx` in `client-dashboard/`
- Trigger: pulsante "ESPORTA PDF" in `DashboardHeader` (prop `onExport`)
- Tecnica: `window.print()` con `@media print` CSS iniettato in `document.head`
  che nasconde tutto tranne `#rankex-print-root` durante la stampa
- Zero dipendenze aggiuntive — il browser genera il PDF nativamente
- Contenuto: anagrafica, status test con delta, BIA (se presente), storico campionamenti (ultimi 5)
- Gestisce sia modulo PT che soccer (categoria/ruolo differenziati)

### Nuova pagina org_admin (solo)
1. Crea componente in `features/org/org-pages/`
2. Aggiungi in `features/org/OrgAdminView.jsx` (PAGES map)
3. Aggiungi tab nella sidebar dell'OrgAdminView

### Membro del team
Flusso creazione: OrgAdminView → MembersPage → CreateMemberForm
→ `createClientAccount` (Firebase Auth — app secondaria)
→ `createUserProfile(uid, { role, orgId, ... })` → `/users/{uid}`
→ `addMember(orgId, uid, data)` → batch: setDoc member + `increment(1)` su `org.memberCount`

Cambio ruolo: `updateMember(orgId, uid, { role })` + `updateUserProfile(uid, { role })`
Permesso Firestore: `isOrgAdminForMember(uid)` nella regola update di `/users/{uid}`.

MembersPage è accessibile da org_admin tramite nav item "Team" (`ORG_ADMIN_NAV_ITEMS`
in `navItems.config.jsx`). Mostra banner di blocco e disabilita il bottone se
`members.length >= getPlanLimits(org?.plan).trainers`.

### Nuova organizzazione (super_admin)
Flusso: SuperAdminView → OrgsPage → CreateOrgForm
→ `createOrganization(orgId, data)` → orgId = slug(name) + random suffix
→ `ownerId` viene da `user.uid` passato via `SuperAdminView → OrgsPage (currentUserUid) → CreateOrgForm (ownerUid)`

---

## File da NON modificare
```
utils/tables.js        → solo aggiungere nuove tabelle
firebase/config.js     → configurazione Firebase
firestore.indexes.json → aggiungere solo, mai rimuovere
firestore.rules        → modificare con estrema cautela
```

## File critici — modificare con cautela
```
utils/gamification.js        → importato da molti hook
constants/tests.js           → fonte di verità test
features/calendar/useCalendar.js → logica calendario
hooks/useClients.js          → ottimistic updates, firma: (orgId, userId?)
firebase/paths.js            → fonte di verità path Firestore
firebase/services/auth.js    → auth instance + setPersistence + logout con audit
firebase/services/clients.js → addClient/deleteClient usano batch + counter
firebase/services/org.js     → addMember/removeMember usano batch + counter
utils/percentile.js          → passare sempre testKey come 5° arg
utils/auditLog.js            → getAuth lazy — non spostare a livello modulo
utils/env.js                 → fonte di verità ambienti e domini
components/common/DomainGuard.jsx → logica separazione domini
config/plans.config.js       → fonte di verità limiti piano
```

---

## Ambienti e infrastruttura

### Progetti Firebase
```
rankex-dev      → sviluppo locale (npm run dev)
fitquest-60a09  → produzione     (npm run build / deploy)
```

### File .env
```
.env.development  → VITE_ENV=development, credenziali rankex-dev
.env.production   → VITE_ENV=production,  credenziali fitquest-60a09
```
Entrambi gitignored. Template: `.env.example`.

### Hosting Firebase — multisito
```
rankex-app.web.app    → trainer, org_admin, client, staff_readonly
rankex-admin.web.app  → solo super_admin
```
Configurato in `firebase.json` (targets) + `.firebaserc` (site IDs).

### DomainGuard — separazione domini
`src/components/common/DomainGuard.jsx` — attivo solo in production (`!isDev`):
```
app domain   + super_admin     → schermata bloccata + link admin
admin domain + non super_admin → schermata bloccata + link app
```
In development (localhost) il guard è completamente disattivato.

### Session timeout — `useSessionTimeout(role)`
```
super_admin:    30 min
org_admin:       2 ore
trainer:         8 ore
staff_readonly:  8 ore
client:          7 giorni
```
Timer si azzera su mousemove / keypress / touchstart / scroll.
Chiamato in `App.jsx` con `profile?.role`.

### Audit log — `auditLog(action, details?)`
Scrive in `/audit_logs/{logId}` — append-only, mai modificabile.
Solo super_admin può leggere (Firestore rules).
```js
import { auditLog, AUDIT_ACTIONS } from 'utils/auditLog'

// Azioni già integrate:
AUDIT_ACTIONS.LOGIN / LOGIN_FAILED  → useLoginForm.js
AUDIT_ACTIONS.LOGOUT                → firebase/services/auth.js
AUDIT_ACTIONS.CLIENT_CREATED        → usecases/createClientUseCase.js
AUDIT_ACTIONS.CLIENT_DELETED        → hooks/useClients.js
```
**IMPORTANTE:** `getAuth(app)` in `auditLog.js` è chiamato dentro la
funzione (lazy), non a livello di modulo. Non spostarlo — causerebbe
conflitto con `setPersistence` in `auth.js`.

### Branching e CI/CD
```
dev   → sviluppo quotidiano, push liberi → CI (lint + test + build)
main  → produzione, solo merge da dev   → CI + Deploy automatico Firebase
```
Workflow GitHub Actions:
- `ci.yml`     → runs on push dev/main + PR to main
- `deploy.yml` → runs after CI passes on main → hosting + rules

### npm scripts deploy
```
npm run deploy:rules         → rules su fitquest-60a09 (prod)
npm run deploy:rules:dev     → rules su rankex-dev (dev)
npm run deploy:app           → hosting rankex-app        (prod)
npm run deploy:admin         → hosting rankex-admin      (prod)
npm run deploy:all           → hosting entrambi          (prod)
npm run deploy:app:dev       → hosting rankex-app-dev    (dev, build --mode development)
npm run deploy:admin:dev     → hosting rankex-admin-dev  (dev, build --mode development)
npm run deploy:all:dev       → hosting entrambi          (dev, build --mode development)
```
Tutti usano `cross-env NODE_OPTIONS=--dns-result-order=ipv4first`
(fix DNS IPv6 su Windows — necessario su questa macchina).

---

## Deploy Firestore rules

Dopo ogni modifica a `firestore.rules`, deploya su entrambi i progetti:
```
npm run deploy:rules       # → prod (fitquest-60a09)
npm run deploy:rules:dev   # → dev  (rankex-dev)
```

---

## Monitoraggio costi Firebase

### Piano attuale: Spark (gratuito)
Sul piano Spark Firebase non può addebitare nulla. Monitorare i limiti per sapere quando avvicinarsi all'upgrade.

**Limiti Firestore gratuiti (per giorno):**
```
50.000 letture
20.000 scritture
20.000 eliminazioni
1 GB storage
```

### Dove controllare
- **Usage & billing** → `console.firebase.google.com/project/fitquest-60a09/usage`
- **Firestore → Utilization tab** → documenti più letti, query inefficienti

### Ottimizzazioni già presenti
- `memberCount` / `clientCount` come counter atomici → nessuna query count a ogni render
- Letture Firestore solo su mount, no polling
- `onSnapshot` solo dove serve il real-time (calendario, notifiche)

### Quando si passa a Blaze (pay-as-you-go)
Impostare subito un budget alert su Google Cloud Console:
- Billing → Budgets & Alerts → progetto `fitquest-60a09`
- Soglia: €5/mese, alert al 50% e 90%

Il piano Blaze mantiene lo stesso free tier — si paga solo oltre la soglia.
MFA via SMS e backup automatico Firestore richiedono Blaze.

---

## Roadmap futura

Evoluzioni pianificate, non ancora implementate.
Queste feature non esistono nel codebase attuale — allinearsi con il team prima di iniziare.

### Sistema Avatar + Negozio

#### Valuta: Monete
```
Valuta separata dagli XP — XP misura progressione atletica (rank),
le Monete sono valuta di spesa nel negozio avatar.
Guadagnate con: sessioni, rank-up, achievement, streak.
Nessun acquisto con denaro reale — solo attività in-app.
```

#### Struttura moduli avatar
```
Slot: testa · corpo · capelli · occhi · bocca · accessorio
Ogni slot ha: pezzo equipaggiato + inventario pezzi sbloccati
```

#### Tipi di sblocco moduli
```
Default    → set base gratuito per tutti i clienti
Livello    → si sblocca raggiungendo un livello XP specifico
Rank       → si sblocca raggiungendo un rank specifico
Acquisto   → spesa di Monete nel negozio
Org custom → moduli esclusivi per i clienti di una specifica org
             (gratuiti o a pagamento in Monete, prezzo definito da RankEX)
```

#### Moduli org custom — flusso B2B
```
1. Org admin fa richiesta in-app (form dedicato)
2. Fuori dall'app: flusso commerciale tra org e RankEX
   (contratto, design, produzione moduli)
3. Super admin carica i moduli e li attiva per l'org specifica
4. I clienti dell'org trovano i moduli nel proprio negozio
```

#### Impatto su Firestore (futuro)
```
avatar_modules/{moduleId}
  slot, name, rarity, unlockType, unlockValue,
  orgId (null = globale), price, imageUrl, createdAt

clients/{clientId}
  coins            → saldo monete
  avatarEquipped   → { testa, corpo, capelli, ... }
  avatarInventory  → [moduleId, ...]
```

#### Nuove aree UI (futuro)
```
Client area    → Negozio avatar, Builder avatar, saldo Monete
Org admin      → Form richiesta moduli custom
Super admin    → Gestione e upload moduli (globali + per org)
```

---

### Gamification avanzata
```
Badge / Achievement    → traguardi automatici: prima sessione, 10 presenze
                         consecutive, primo rank-up, nuovo personal best su test
Streak presenze        → moltiplicatore XP per settimane consecutive senza assenze
Leaderboard gruppo     → classifica dentro una squadra/gruppo (priorità: soccer)
Obiettivi trainer      → coach fissa target su test specifico per un cliente
                         (es. "70° percentile sprint entro fine mese")
                         sistema monitora e notifica al raggiungimento
```

### Gestione allenamento
```
Scheda Allenamento     → IMPLEMENTATO (base) — apr 2026
                         Trainer compone scheda strutturata (esercizi, serie,
                         recuperi, note) e la assegna a un cliente.
                         Il cliente la vede in read-only nella propria dashboard.
                         Struttura: organizations/{orgId}/workoutPlans/{planId}
                         Status: 'active' | 'archived'
                         Roadmap: integrazione calendario + bonus XP al completamento
```
