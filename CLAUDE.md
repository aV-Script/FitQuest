---

**`CLAUDE.md`**

```markdown
# RankEX — Contesto Progetto

## Stack
- React 18 + Vite
- Firebase (Auth + Firestore)
- Tailwind CSS v4
- React Router v6
- Recharts (grafici)

---

## Prodotto

RankEX è una piattaforma SaaS multi-tenant per il tracking
delle performance atletiche. Supporta due moduli di dominio
con terminologie e test diversi.

### Moduli

**personal_training** — PT e GYM
- Categorie: health / active / athlete
- Test: per categoria (13 test)
- Terminologia PT:  Trainer / Cliente / Gruppo / Sessione
- Terminologia GYM: Personal Trainer / Membro / Classe / Allenamento
- Profili: tests_only / bia_only / complete

**soccer_academy** — accademie calcistiche
- Nessuna categoria (ruoli solo etichetta visiva)
- Test fissi per tutti: y_balance, standing_long_jump,
  505_cod_agility, sprint_20m, beep_test
- Terminologia: Coach / Allievo / Squadra / Allenamento
- Profili: tests_only

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

---

## Struttura Firestore

```
users/{uid}
  role, orgId, clientId, moduleType,
  terminologyVariant, mustChangePassword

organizations/{orgId}
  name, moduleType, terminologyVariant,
  plan, ownerId, status, createdAt

  members/{uid}
    role, name, email, joinedAt

  clients/{clientId}
  slots/{slotId}
  groups/{groupId}
  recurrences/{recId}
  notifications/{notId}
```

### Path helpers
Tutti i path Firestore passano da `src/firebase/paths.js`:
```js
clientsPath(orgId)       → organizations/{orgId}/clients
slotsPath(orgId)         → organizations/{orgId}/slots
groupsPath(orgId)        → organizations/{orgId}/groups
recurrencesPath(orgId)   → organizations/{orgId}/recurrences
notificationsPath(orgId) → organizations/{orgId}/notifications
```

---

## Modelli dati

### Cliente (`clients/{clientId}`)
```js
{
  name, eta, sesso, peso, altezza,
  email, clientAuthUid,
  categoria,       // 'health'|'active'|'athlete'|null (soccer)
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
⚠️ `completedClientIds` NON esiste — usa `attendees`.

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
│   ├── router.jsx           ← routing per ruolo
│   ├── routes.config.js
│   └── useAuth.js           ← carica user + profile + org + terminology
│
├── components/
│   ├── common/
│   │   ├── ConfirmDialog.jsx
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
│   │       └── constants.jsx
│   └── ui/
│       ├── index.jsx        ← Card, Button, Badge, Modal, Field,
│       │                       StatNumber, EmptyState, Skeleton,
│       │                       ActivityLog, StatsSection, Divider
│       ├── XPBar.jsx
│       ├── Pentagon.jsx
│       └── RankRing.jsx
│
├── config/
│   ├── modules.config.js    ← MODULES, TERMINOLOGIES, PLAYER_ROLES
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
│   │                           terminology, userRole
│   ├── ReadonlyContext.jsx  ← readonly boolean
│   └── ToastContext.jsx
│
├── design/
│   └── tokens.js            ← SPACE, TYPE, COLOR, GRADIENT,
│                               SHADOW, RADIUS, MOTION, Z
│
├── features/
│   ├── admin/               ← area super_admin
│   │   ├── SuperAdminView.jsx
│   │   └── admin-pages/
│   │       ├── AdminDashboard.jsx
│   │       ├── OrgsPage.jsx
│   │       └── OrgDetailView.jsx
│   │
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── useLoginForm.js
│   │   └── components/
│   │       ├── BrandingPanel.jsx
│   │       ├── LoginForm.jsx
│   │       └── ResetForm.jsx
│   │
│   ├── bia/
│   │   ├── useBia.js
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
│   │   ├── CampionamentoView.jsx
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
│   │       └── ClientSessionsSummary.jsx
│   │
│   ├── notification/
│   │   └── NotificationsPanel.jsx
│   │
│   ├── org/                 ← area org_admin
│   │   ├── OrgAdminView.jsx
│   │   └── org-pages/
│   │       ├── OrgDashboard.jsx
│   │       ├── MembersPage.jsx
│   │       ├── OrgSettingsPage.jsx
│   │       └── CreateMemberForm.jsx
│   │
│   └── trainer/             ← area trainer / staff_readonly
│       ├── TrainerView.jsx
│       ├── trainer.config.js
│       ├── ClientsPage.jsx
│       ├── GroupsPage.jsx
│       ├── TrainerCalendar.jsx
│       ├── RecurrencesPage.jsx
│       ├── NewClientView.jsx
│       ├── TestGuidePage.jsx
│       ├── ProfilePage.jsx
│       ├── clients-page/
│       │   ├── ClientCard.jsx
│       │   ├── FiltersSidebar.jsx
│       │   └── MobileControls.jsx
│       ├── groups-page/
│       │   ├── GroupCard.jsx
│       │   ├── GroupDetailView.jsx
│       │   ├── GroupsSidebar.jsx
│       │   └── GroupToggleDialog.jsx
│       ├── trainer-calendar/
│       │   ├── CalendarHeader.jsx
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
│           └── RecurrenceDetailView.jsx
│
├── firebase/
│   ├── config.js
│   ├── paths.js             ← path helpers subcollection
│   └── services/
│       ├── auth.js
│       ├── calendar.js
│       ├── clients.js
│       ├── db.js
│       ├── groups.js
│       ├── notifications.js
│       ├── org.js           ← CRUD organizzazioni e membri
│       └── users.js
│
├── hooks/
│   ├── useAsync.js
│   ├── useClientRank.js
│   ├── useClients.js        ← accetta orgId
│   ├── useGroups.js         ← accetta orgId
│   ├── useMotion.js         ← useEnterAnimation, useStagger
│   ├── useNotifications.js
│   └── usePagination.js
│
└── utils/
    ├── bia.js               ← getBiaParamStatus, calcBmi,
    │                           calcBiaXP, calcBiaScore
    ├── firebaseErrors.js
    ├── gamification.js      ← calcSessionConfig, buildXPUpdate,
    │                           buildCampionamentoUpdate, buildNewClient,
    │                           buildBiaUpdate, buildProfileUpgrade
    ├── percentile.js        ← calcPercentile, calcStatMedia
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
utils/gamification.js    → calcSessionConfig, XP, rank
design/tokens.js         → spacing, colori, motion, shadow
```

### Data-driven UI
```
trainer.config.js        → PAGES map (id → componente)
routes.config.js         → PROTECTED_ROUTES per ruolo
trainer-shell/constants  → NAV_ITEMS sidebar
modules.config.js        → comportamento per moduleType
```

### Readonly mode (staff_readonly)
```
ReadonlyContext  → boolean globale
ReadonlyGuard    → nasconde elementi di modifica
ReadonlyBanner   → banner informativo in cima
```

---

## Design system

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
.bg-hex              → pattern esagonale decorativo
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

### soccer_academy — fissi per tutti
```
y_balance, standing_long_jump, 505_cod_agility,
sprint_20m, beep_test
```
La categoria del cliente in soccer è sempre `'soccer'`
(hidden — non mostrata nella UI di selezione).

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

### Profili cliente
```
tests_only → solo test, ha rank
bia_only   → solo BIA, no rank
complete   → test + BIA, rank solo da test
```

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
super_admin    → SuperAdminView
org_admin      → OrgAdminView (TrainerView + pagine org)
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

## Aggiungere un nuovo test
1. Aggiungi in `constants/tests.js` con tutti i campi
2. Aggiungi tabella percentili in `utils/tables.js`
3. Se soccer → aggiungi a `fixedTests` in `modules.config.js`
4. Nessun altro file da modificare

## Aggiungere una pagina trainer
1. Crea componente in `features/trainer/`
2. Aggiungi in `features/trainer/trainer.config.js`
3. Aggiungi in `trainer-shell/constants.jsx` (NAV_ITEMS)
4. Nessun altro file da modificare

## Aggiungere un membro del team
Flusso: OrgAdminView → MembersPage → CreateMemberForm
→ createMemberAccount (Firebase Auth)
→ createUserProfile (users/{uid})
→ addMember (organizations/{orgId}/members/{uid})

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
utils/gamification.js  → importato da molti hook
constants/tests.js     → fonte di verità test
features/calendar/useCalendar.js → logica calendario
hooks/useClients.js    → ottimistic updates
```
```