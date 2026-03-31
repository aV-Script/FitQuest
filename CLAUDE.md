Perfetto. Ho tutto quello che serve. Prima dello script, definiamo i range clinici BIA e la logica XP.

---

## Range clinici BIA per età/sesso

```js
// Massa grassa % — OMS/ACSM
FAT_MASS_RANGES = {
  M: {
    '18-39': { excellent: [0,8],   good: [8,15],  normal: [15,20], high: [20,25],  obese: [25,100] },
    '40-59': { excellent: [0,11],  good: [11,18], normal: [18,22], high: [22,28],  obese: [28,100] },
    '60+':   { excellent: [0,13],  good: [13,20], normal: [20,25], high: [25,30],  obese: [30,100] },
  },
  F: {
    '18-39': { excellent: [0,20],  good: [20,25], normal: [25,30], high: [30,35],  obese: [35,100] },
    '40-59': { excellent: [0,23],  good: [23,28], normal: [28,33], high: [33,38],  obese: [38,100] },
    '60+':   { excellent: [0,25],  good: [25,30], normal: [30,35], high: [35,40],  obese: [40,100] },
  },
}

// Acqua corporea % — Bioelectrical Impedance standard
WATER_RANGES = {
  M: { low: [0,55], normal: [55,65], optimal: [65,70], high: [70,100] },
  F: { low: [0,50], normal: [50,60], optimal: [60,65], high: [65,100] },
}

// Grasso viscerale — scala 1-12 Tanita/InBody
VISCERAL_RANGES = {
  optimal: [1,4],   // verde
  normal:  [5,7],   // giallo
  high:    [8,10],  // arancio
  obese:   [11,12], // rosso
}

// BMI — OMS
BMI_RANGES = {
  underweight: [0,18.5],
  normal:      [18.5,25],
  overweight:  [25,30],
  obese:       [30,100],
}

// Età metabolica — relativa all'età anagrafica
// se età metabolica < età anagrafica → verde
// se uguale → giallo
// se maggiore → rosso

// Massa muscolare e ossea → percentile per sesso/età
// (tabelle simili a quelle dei test atletici)
```

---

## Logica XP BIA

```js
XP_BIA = {
  first_measurement: 100,  // prima BIA in assoluto
  improvement:       75,   // almeno 1 parametro migliorato
  maintenance:       25,   // nessun miglioramento ma nessun peggioramento
  regression:        0,    // peggioramento generale
}

// "Miglioramento" = almeno 2 parametri chiave migliorati:
// fat_mass_percent (↓), muscle_mass_kg (↑), water_percent (↑), visceral_fat (↓)
```

---

## Wizard — Step categoria aggiornato

```
Step 1 — Anagrafica
Step 2 — Categoria profilo ← NUOVO (tests_only/bia_only/complete)
Step 3-7 — Test atletici (solo se tests_only o complete)
Step 3-7 — BIA (solo se bia_only) ← NUOVO
Step 8 — Impostazioni allenamento
Step 9 — Account
```

Per `bia_only` i 5 step test diventano 1 step BIA.
Per `complete` si fanno entrambi — wizard più lungo.

---

Ora lo script completo.

---

**`BIA_FEATURE.md`**

```markdown
# FitQuest/RankEX — Feature BIA (Bioimpedenziometria)

## Leggi CLAUDE.md prima di iniziare.
## Esegui le fasi in ordine. Build dopo ogni fase.

---

## FASE 1 — Costanti e tipi

### 1A — Crea src/constants/bia.js

```js
/**
 * Costanti BIA — Bioimpedenziometria.
 * Range clinici basati su standard OMS/ACSM/Tanita.
 */

// ── Parametri BIA ─────────────────────────────────────────────
export const BIA_PARAMS = [
  {
    key:       'fatMassPercent',
    label:     'Massa grassa',
    unit:      '%',
    direction: 'inverse',   // meno è meglio
    icon:      '🔥',
  },
  {
    key:       'muscleMassKg',
    label:     'Massa muscolare',
    unit:      'kg',
    direction: 'direct',    // più è meglio
    icon:      '💪',
  },
  {
    key:       'waterPercent',
    label:     'Acqua corporea',
    unit:      '%',
    direction: 'direct',
    icon:      '💧',
  },
  {
    key:       'boneMassKg',
    label:     'Massa ossea',
    unit:      'kg',
    direction: 'direct',
    icon:      '🦴',
  },
  {
    key:       'bmi',
    label:     'BMI',
    unit:      'kg/m²',
    direction: 'neutral',   // range ottimale centrale
    icon:      '⚖️',
    computed:  true,        // calcolato da peso/altezza
  },
  {
    key:       'bmrKcal',
    label:     'Metabolismo basale',
    unit:      'kcal',
    direction: 'neutral',
    icon:      '🔋',
  },
  {
    key:       'metabolicAge',
    label:     'Età metabolica',
    unit:      'anni',
    direction: 'inverse',   // meglio se < età anagrafica
    icon:      '⏱️',
  },
  {
    key:       'visceralFat',
    label:     'Grasso viscerale',
    unit:      '/12',
    direction: 'inverse',
    icon:      '🎯',
  },
]

// ── Categorie profilo ─────────────────────────────────────────
export const PROFILE_CATEGORIES = Object.freeze([
  {
    id:    'tests_only',
    label: 'Solo Test',
    desc:  'Valutazione atletica con test fisici. Rank basato sulle performance.',
    color: '#60a5fa',
    icon:  '🏃',
    hasTests: true,
    hasBia:   false,
  },
  {
    id:    'bia_only',
    label: 'Solo BIA',
    desc:  'Analisi della composizione corporea con bioimpedenziometria.',
    color: '#34d399',
    icon:  '⚡',
    hasTests: false,
    hasBia:   true,
  },
  {
    id:    'complete',
    label: 'Completo',
    desc:  'Test atletici + BIA. Profilo completo con rank e composizione corporea.',
    color: '#f59e0b',
    icon:  '⭐',
    hasTests: true,
    hasBia:   true,
  },
])

export function getProfileCategory(id) {
  return PROFILE_CATEGORIES.find(c => c.id === id) ?? PROFILE_CATEGORIES[0]
}

// ── Range clinici massa grassa % ──────────────────────────────
export const FAT_MASS_RANGES = {
  M: {
    '18-39': { excellent: [0,8],  good: [8,15],  normal: [15,20], high: [20,25],  obese: [25,100] },
    '40-59': { excellent: [0,11], good: [11,18], normal: [18,22], high: [22,28],  obese: [28,100] },
    '60+':   { excellent: [0,13], good: [13,20], normal: [20,25], high: [25,30],  obese: [30,100] },
  },
  F: {
    '18-39': { excellent: [0,20], good: [20,25], normal: [25,30], high: [30,35],  obese: [35,100] },
    '40-59': { excellent: [0,23], good: [23,28], normal: [28,33], high: [33,38],  obese: [38,100] },
    '60+':   { excellent: [0,25], good: [25,30], normal: [30,35], high: [35,40],  obese: [40,100] },
  },
}

// ── Range acqua corporea % ────────────────────────────────────
export const WATER_RANGES = {
  M: { low: [0,55],  normal: [55,60], optimal: [60,65], high: [65,100] },
  F: { low: [0,50],  normal: [50,55], optimal: [55,60], high: [60,100] },
}

// ── Range grasso viscerale (scala 1-12) ───────────────────────
export const VISCERAL_RANGES = [
  { label: 'Ottimale', range: [1,4],   color: '#34d399' },
  { label: 'Normale',  range: [5,7],   color: '#f59e0b' },
  { label: 'Alto',     range: [8,10],  color: '#f97316' },
  { label: 'Obeso',    range: [11,12], color: '#f87171' },
]

// ── Range BMI — OMS ───────────────────────────────────────────
export const BMI_RANGES = [
  { label: 'Sottopeso',    range: [0,18.5],  color: '#60a5fa' },
  { label: 'Normale',      range: [18.5,25], color: '#34d399' },
  { label: 'Sovrappeso',   range: [25,30],   color: '#f59e0b' },
  { label: 'Obeso',        range: [30,100],  color: '#f87171' },
]

// ── XP per BIA ────────────────────────────────────────────────
export const XP_BIA = Object.freeze({
  FIRST_MEASUREMENT: 100,
  IMPROVEMENT:       75,
  MAINTENANCE:       25,
  REGRESSION:        0,
})

// ── Parametri chiave per calcolo miglioramento ────────────────
// Un miglioramento conta se almeno 2 di questi migliorano
export const BIA_KEY_PARAMS = [
  'fatMassPercent',   // deve scendere
  'muscleMassKg',     // deve salire
  'waterPercent',     // deve salire
  'visceralFat',      // deve scendere
]

// ── Defaults nuova misurazione BIA ────────────────────────────
export const BIA_EMPTY = {
  fatMassPercent: '',
  muscleMassKg:   '',
  waterPercent:   '',
  boneMassKg:     '',
  bmi:            '',
  bmrKcal:        '',
  metabolicAge:   '',
  visceralFat:    '',
}
```

### 1B — Aggiorna src/constants/index.js

```js
// Aggiungi export
export { PROFILE_CATEGORIES, getProfileCategory, BIA_PARAMS } from './bia'

// Aggiorna NEW_CLIENT_DEFAULTS
export const NEW_CLIENT_DEFAULTS = {
  level:           1,
  rank:            'F',
  rankColor:       '#6b7280',
  xp:              0,
  xpNext:          700,
  stats:           {},
  log:             [],
  campionamenti:   [],
  sessionsPerWeek: 3,
  categoria:       'tests_only',  // categoria test atletici
  profileType:     'tests_only',  // 'tests_only' | 'bia_only' | 'complete'
  biaHistory:      [],
  lastBia:         null,
}
```

---

## FASE 2 — Utils BIA

### 2A — Crea src/utils/bia.js

```js
import {
  FAT_MASS_RANGES,
  WATER_RANGES,
  VISCERAL_RANGES,
  BMI_RANGES,
  BIA_KEY_PARAMS,
  XP_BIA,
} from '../constants/bia'

/**
 * Restituisce il colore di stato per un parametro BIA
 * in base ai range clinici e ai dati anagrafici del cliente.
 *
 * @returns {{ color: string, label: string, score: number }}
 *          score: 0-100 per normalizzazione visiva
 */
export function getBiaParamStatus(key, value, sex = 'M', age = 30) {
  if (value === null || value === undefined || value === '') {
    return { color: 'rgba(255,255,255,0.2)', label: '—', score: 0 }
  }

  switch (key) {

    case 'fatMassPercent': {
      const ageGroup = age < 40 ? '18-39' : age < 60 ? '40-59' : '60+'
      const ranges   = FAT_MASS_RANGES[sex]?.[ageGroup]
      if (!ranges) return { color: '#60a5fa', label: 'N/D', score: 50 }
      if (value <= ranges.excellent[1]) return { color: '#34d399', label: 'Eccellente', score: 100 }
      if (value <= ranges.good[1])      return { color: '#6ee7b7', label: 'Buono',      score: 80  }
      if (value <= ranges.normal[1])    return { color: '#f59e0b', label: 'Normale',    score: 60  }
      if (value <= ranges.high[1])      return { color: '#f97316', label: 'Alto',       score: 35  }
      return                                   { color: '#f87171', label: 'Obeso',      score: 10  }
    }

    case 'waterPercent': {
      const ranges = WATER_RANGES[sex]
      if (value < ranges.low[1])      return { color: '#f87171', label: 'Bassa',    score: 20  }
      if (value < ranges.normal[1])   return { color: '#f59e0b', label: 'Normale',  score: 55  }
      if (value <= ranges.optimal[1]) return { color: '#34d399', label: 'Ottimale', score: 100 }
      return                                 { color: '#60a5fa', label: 'Alta',     score: 75  }
    }

    case 'visceralFat': {
      const range = VISCERAL_RANGES.find(r => value >= r.range[0] && value <= r.range[1])
      const score = Math.round(100 - ((value - 1) / 11) * 100)
      return range
        ? { color: range.color, label: range.label, score }
        : { color: '#f87171', label: 'Alto', score: 10 }
    }

    case 'bmi': {
      const range = BMI_RANGES.find(r => value >= r.range[0] && value < r.range[1])
      const score = value >= 18.5 && value < 25 ? 100 :
                    value >= 25   && value < 30 ? 50  :
                    value < 18.5               ? 40  : 20
      return range
        ? { color: range.color, label: range.label, score }
        : { color: '#f87171', label: 'Obeso', score: 10 }
    }

    case 'metabolicAge': {
      // Confronta con età anagrafica passata come terzo parametro
      const diff  = value - age
      const color = diff < -5 ? '#34d399' :
                    diff < 0  ? '#6ee7b7' :
                    diff === 0 ? '#f59e0b' :
                    diff < 5  ? '#f97316' : '#f87171'
      const label = diff < -5 ? 'Ottima'   :
                    diff < 0  ? 'Buona'    :
                    diff === 0 ? 'Normale' :
                    diff < 5  ? 'Alta'     : 'Molto alta'
      const score = Math.max(0, Math.min(100, 75 - diff * 8))
      return { color, label, score }
    }

    // muscleMassKg, boneMassKg, bmrKcal → visualizzazione neutra
    default:
      return { color: '#60a5fa', label: String(value), score: 60 }
  }
}

/**
 * Calcola il BMI automaticamente da peso e altezza.
 */
export function calcBmi(pesoKg, altezzaCm) {
  if (!pesoKg || !altezzaCm) return null
  const h = altezzaCm / 100
  return Math.round((pesoKg / (h * h)) * 10) / 10
}

/**
 * Calcola quanti XP assegnare per una misurazione BIA.
 */
export function calcBiaXP(newBia, prevBia) {
  // Prima misurazione in assoluto
  if (!prevBia) return XP_BIA.FIRST_MEASUREMENT

  // Conta miglioramenti sui parametri chiave
  let improvements = 0
  BIA_KEY_PARAMS.forEach(key => {
    const prev = prevBia[key]
    const curr = newBia[key]
    if (prev === null || curr === null) return
    // fatMassPercent e visceralFat: migliorano se scendono
    if (key === 'fatMassPercent' || key === 'visceralFat') {
      if (curr < prev) improvements++
    } else {
      if (curr > prev) improvements++
    }
  })

  if (improvements >= 2) return XP_BIA.IMPROVEMENT
  if (improvements === 0) return XP_BIA.REGRESSION
  return XP_BIA.MAINTENANCE
}

/**
 * Calcola lo score complessivo BIA (0-100) per visualizzazione.
 * Media pesata dei parametri chiave con status.
 */
export function calcBiaScore(bia, sex, age) {
  if (!bia) return 0
  const keyParams = ['fatMassPercent', 'waterPercent', 'visceralFat', 'bmi']
  const scores    = keyParams
    .map(key => getBiaParamStatus(key, bia[key], sex, age).score)
    .filter(s => s > 0)
  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}
```

### 2B — Aggiorna src/utils/gamification.js

Aggiungi la gestione BIA in `buildNewClient` e crea `buildBiaUpdate`:

```js
import { calcBiaXP } from './bia'
import { XP_BIA }    from '../constants/bia'

/**
 * Costruisce l'update per una nuova misurazione BIA.
 */
export function buildBiaUpdate(client, newBia) {
  const today   = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
  const prevBia = client.lastBia ?? null
  const xpToAdd = calcBiaXP(newBia, prevBia)

  const biaRecord   = { ...newBia, date: today }
  const biaHistory  = [biaRecord, ...(client.biaHistory ?? [])].slice(0, 50)

  const logEntry = {
    date:   today,
    action: `BIA — ${prevBia ? 'Aggiornamento composizione corporea' : 'Prima misurazione'}`,
    xp:     xpToAdd,
  }
  const log = [logEntry, ...(client.log ?? [])].slice(0, LOG_MAX_ENTRIES)

  // XP solo se c'è miglioramento
  const { xp, xpNext, level } = calcLevelProgression(
    (client.xp ?? 0) + xpToAdd,
    client.xpNext,
    client.level,
  )

  return {
    update: {
      lastBia:    biaRecord,
      biaHistory,
      log,
      xp,
      xpNext,
      level,
    },
    xpEarned: xpToAdd,
  }
}

/**
 * Upgrade categoria profilo cliente.
 * Mantiene lo storico della tipologia precedente.
 */
export function buildProfileUpgrade(client, newProfileType) {
  const update = { profileType: newProfileType }
  const today  = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })

  if (newProfileType === 'complete') {
    if (client.profileType === 'tests_only') {
      // Aggiunge BIA — azzera solo i dati BIA
      update.biaHistory = []
      update.lastBia    = null
    } else if (client.profileType === 'bia_only') {
      // Aggiunge test — azzera solo i dati test
      update.stats         = {}
      update.campionamenti = []
      update.rank          = 'F'
      update.rankColor     = '#6b7280'
      update.media         = 0
      // Mantiene categoria test di default
      update.categoria     = 'health'
    }
  }

  const logEntry = {
    date:   today,
    action: `Profilo aggiornato → ${newProfileType === 'complete' ? 'Test + BIA' : newProfileType}`,
    xp:     0,
  }
  update.log = [logEntry, ...(client.log ?? [])].slice(0, LOG_MAX_ENTRIES)

  return update
}
```

---

## FASE 3 — Hook BIA

### 3A — Crea src/features/bia/useBia.js

```js
import { useCallback }         from 'react'
import { useTrainerDispatch, ACTIONS } from '../../context/TrainerContext'
import { updateClient }        from '../../firebase/services/clients'
import { addNotification }     from '../../firebase/services/notifications'
import { buildBiaUpdate, buildProfileUpgrade } from '../../utils/gamification'

/**
 * Hook per la gestione delle misurazioni BIA.
 * Usato nel dashboard trainer per i clienti con BIA.
 */
export function useBia(trainerId) {
  const dispatch = useTrainerDispatch()

  /**
   * Salva una nuova misurazione BIA per un cliente.
   */
  const handleSaveBia = useCallback(async (client, biaData) => {
    const { update, xpEarned } = buildBiaUpdate(client, biaData)

    // Ottimistico
    dispatch({
      type:    ACTIONS.UPDATE_CLIENT,
      payload: { id: client.id, ...update },
    })
    dispatch({
      type:    ACTIONS.SELECT_CLIENT,
      payload: { ...client, ...update },
    })

    try {
      await updateClient(client.id, update)
      if (client.clientAuthUid && xpEarned > 0) {
        await addNotification({
          clientId: client.id,
          message:  xpEarned === 100
            ? `Prima misurazione BIA completata! +${xpEarned} XP`
            : `BIA aggiornata — ${xpEarned > 0 ? `+${xpEarned} XP guadagnati!` : 'continua così!'}`,
          date:     new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
          type:     'bia',
        })
      }
    } catch {
      // Rollback
      dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: client })
      dispatch({ type: ACTIONS.SELECT_CLIENT, payload: client })
    }
  }, [dispatch])

  /**
   * Upgrade categoria profilo cliente.
   */
  const handleUpgradeProfile = useCallback(async (client, newProfileType) => {
    const update   = buildProfileUpgrade(client, newProfileType)
    const snapshot = client

    dispatch({
      type:    ACTIONS.UPDATE_CLIENT,
      payload: { id: client.id, ...update },
    })
    dispatch({
      type:    ACTIONS.SELECT_CLIENT,
      payload: { ...client, ...update },
    })

    try {
      await updateClient(client.id, update)
      if (client.clientAuthUid) {
        await addNotification({
          clientId: client.id,
          message:  'Il tuo profilo è stato aggiornato dal trainer.',
          date:     new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
          type:     'upgrade',
        })
      }
    } catch {
      dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: snapshot })
      dispatch({ type: ACTIONS.SELECT_CLIENT, payload: snapshot })
    }
  }, [dispatch])

  return { handleSaveBia, handleUpgradeProfile }
}
```

---

## FASE 4 — Componenti BIA

### 4A — Crea src/features/bia/bia-view/BiaGaugeBar.jsx

```jsx
import { getBiaParamStatus } from '../../../utils/bia'

/**
 * Barra gauge per un singolo parametro BIA.
 * Mostra valore attuale, range di riferimento e delta dal precedente.
 */
export function BiaGaugeBar({ param, value, prevValue, sex, age }) {
  const status    = getBiaParamStatus(param.key, value, sex, age)
  const prevStatus = prevValue !== undefined && prevValue !== null
    ? getBiaParamStatus(param.key, prevValue, sex, age)
    : null

  const delta = (prevValue !== null && prevValue !== undefined && value !== null && value !== '')
    ? (Number(value) - Number(prevValue)).toFixed(1)
    : null

  const isGoodDelta = delta !== null && (
    param.direction === 'direct'  ?  Number(delta) > 0 :
    param.direction === 'inverse' ?  Number(delta) < 0 :
    false
  )
  const isBadDelta = delta !== null && (
    param.direction === 'direct'  ?  Number(delta) < 0 :
    param.direction === 'inverse' ?  Number(delta) > 0 :
    false
  )

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label + valore */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px]">{param.icon}</span>
          <span className="font-body text-[13px] text-white/70">{param.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {delta !== null && (
            <span
              className="font-display text-[10px]"
              style={{
                color: isGoodDelta ? '#34d399' :
                       isBadDelta  ? '#f87171' :
                       'rgba(255,255,255,0.3)',
              }}
            >
              {Number(delta) > 0 ? `▲ +${delta}` : Number(delta) < 0 ? `▼ ${delta}` : '— '}
              {param.unit}
            </span>
          )}
          <span
            className="font-display font-black text-[15px]"
            style={{ color: value !== '' ? status.color : 'rgba(255,255,255,0.2)' }}
          >
            {value !== '' ? `${value}${param.unit}` : '—'}
          </span>
        </div>
      </div>

      {/* Barra gauge */}
      <div
        className="h-[6px] rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{
            width:      `${value !== '' ? status.score : 0}%`,
            background: value !== '' ? status.color : 'transparent',
            boxShadow:  value !== '' ? `0 0 8px ${status.color}88` : 'none',
          }}
        />
      </div>

      {/* Label status */}
      {value !== '' && (
        <div
          className="font-display text-[9px] tracking-[1px] text-right"
          style={{ color: status.color + 'aa' }}
        >
          {status.label.toUpperCase()}
        </div>
      )}
    </div>
  )
}
```

### 4B — Crea src/features/bia/bia-view/BiaHistoryChart.jsx

```jsx
import { useState }                                    from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip,
         ResponsiveContainer, CartesianGrid }          from 'recharts'
import { SectionLabel }                                from '../../../components/ui'
import { BIA_PARAMS }                                  from '../../../constants/bia'

/**
 * Grafico andamento storico BIA.
 * Stesso pattern di StatsChart ma per i parametri BIA.
 */
export function BiaHistoryChart({ biaHistory, color }) {
  const displayParams = BIA_PARAMS.filter(p => !p.computed)
  const [selectedParam, setSelectedParam] = useState(displayParams[0].key)

  if (!biaHistory || biaHistory.length < 2) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <SectionLabel>📈 Andamento BIA</SectionLabel>
        <p className="text-white/20 font-body text-[13px] text-center py-4">
          Servono almeno 2 misurazioni per visualizzare l'andamento.
        </p>
      </div>
    )
  }

  const param     = displayParams.find(p => p.key === selectedParam)
  const chartData = [...biaHistory].reverse().map(b => ({
    name:  b.date,
    value: b[selectedParam] ?? 0,
  }))

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <SectionLabel>📈 Andamento BIA</SectionLabel>

      {/* Selector parametro */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {displayParams.map(p => (
          <button
            key={p.key}
            onClick={() => setSelectedParam(p.key)}
            className="px-3 py-1 rounded-lg font-display text-[11px] border cursor-pointer transition-all"
            style={selectedParam === p.key
              ? { background: color + '33', borderColor: color + '55', color }
              : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
            }
          >
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      {/* Grafico */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Montserrat' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Montserrat' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => [`${v} ${param?.unit ?? ''}`, param?.label]}
              contentStyle={{
                background:   'rgba(10,15,30,0.97)',
                border:       '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                fontFamily:   'Inter',
                fontSize:     12,
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
              itemStyle={{ color }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 3 }}
              activeDot={{ fill: color, r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

### 4C — Crea src/features/bia/BiaLockedPanel.jsx

```jsx
/**
 * Pannello BIA bloccato — mostrato al cliente che non ha la BIA.
 * Stile "contenuto sbloccabile" come in un videogioco.
 */
export function BiaLockedPanel({ profileType, color }) {
  const isTestsOnly = profileType === 'tests_only'
  const lockedLabel = isTestsOnly
    ? 'Bioimpedenziometria'
    : 'Test atletici'
  const lockedDesc = isTestsOnly
    ? 'Analisi completa della composizione corporea: massa grassa, muscolare, acqua e molto altro.'
    : 'Valutazione atletica completa con test fisici standardizzati e sistema di ranking.'

  return (
    <section className="px-6 py-6 relative">
      <div className="rounded-2xl overflow-hidden relative">

        {/* Contenuto sfocato in background — silhouette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ filter: 'blur(6px)', opacity: 0.25 }}
        >
          <div className="p-5">
            <div className="h-4 w-32 rounded mb-3" style={{ background: color }} />
            <div className="flex gap-3 mb-4">
              {[1,2,3,4].map(i => (
                <div
                  key={i}
                  className="flex-1 h-16 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </div>
            <div className="h-32 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </div>

        {/* Overlay con messaggio */}
        <div
          className="relative z-10 p-8 flex flex-col items-center justify-center text-center gap-4"
          style={{
            background:   'rgba(7,9,14,0.85)',
            border:       '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            minHeight:    220,
          }}
        >
          {/* Icona lucchetto */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border:     '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <svg
              width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          {/* Titolo */}
          <div>
            <div className="font-display font-black text-[16px] text-white mb-1">
              {lockedLabel}
            </div>
            <div className="font-body text-[13px] text-white/40 max-w-xs">
              {lockedDesc}
            </div>
          </div>

          {/* Badge sbloccabile */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border:     '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span className="text-[14px]">🔓</span>
            <span className="font-display text-[11px] text-white/40 tracking-[1px]">
              CONTATTA IL TUO TRAINER PER SBLOCCARE
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### 4D — Crea src/features/bia/BiaView.jsx

```jsx
import { useState, useCallback }          from 'react'
import { Button, SectionLabel }           from '../../components/ui'
import { ConfirmDialog }                  from '../../components/common/ConfirmDialog'
import { BiaGaugeBar }                    from './bia-view/BiaGaugeBar'
import { BIA_PARAMS, BIA_EMPTY }          from '../../constants/bia'
import { calcBmi }                        from '../../utils/bia'

/**
 * View inline per il campionamento BIA.
 * Stesso pattern di CampionamentoView.
 */
export function BiaView({ client, color, onSave, onBack }) {
  const [values,      setValues]      = useState(BIA_EMPTY)
  const [errors,      setErrors]      = useState({})
  const [loading,     setLoading]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Auto-calcola BMI da peso/altezza cliente
  const bmiComputed = calcBmi(client.peso, client.altezza)

  const updateValue = (key) => (e) => {
    setValues(p => ({ ...p, [key]: e.target.value }))
  }

  const validate = useCallback(() => {
    const e = {}
    const required = ['fatMassPercent', 'muscleMassKg', 'waterPercent', 'visceralFat']
    required.forEach(key => {
      const val = Number(values[key])
      if (values[key] === '' || isNaN(val) || val < 0) {
        e[key] = 'Valore richiesto'
      }
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }, [values])

  const handleRequestSave = useCallback(() => {
    if (!validate()) return
    setShowConfirm(true)
  }, [validate])

  const handleConfirmSave = useCallback(async () => {
    setLoading(true)
    try {
      const finalValues = {
        ...values,
        bmi: bmiComputed ?? values.bmi,
      }
      // Converti stringhe in numeri
      const parsed = {}
      Object.entries(finalValues).forEach(([k, v]) => {
        parsed[k] = v !== '' ? Number(v) : null
      })
      await onSave(parsed)
      onBack()
    } catch {
      setLoading(false)
      setShowConfirm(false)
    }
  }, [values, bmiComputed, onSave, onBack])

  const prevBia = client.lastBia ?? null

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[.05]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 bg-transparent border-none text-white/30 font-body text-[13px] cursor-pointer hover:text-white/60 transition-colors p-0"
        >
          ‹ Dashboard
        </button>
        <span className="font-display font-black text-[16px] text-white">
          Nuova misurazione BIA
        </span>
        <button
          onClick={handleRequestSave}
          className="font-display text-[11px] px-3 py-1.5 rounded-lg cursor-pointer border transition-all hover:opacity-80"
          style={{ color, borderColor: color + '55', background: color + '11' }}
        >
          SALVA BIA
        </button>
      </div>

      {/* Contenuto */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p className="font-body text-[13px] text-white/40 mb-6">
          {client.name} · {client.sesso} · {client.eta} anni
          {bmiComputed && (
            <span className="ml-3 font-display text-[11px]" style={{ color: color + 'aa' }}>
              BMI calcolato: {bmiComputed}
            </span>
          )}
        </p>

        <div className="flex gap-8 items-start">

          {/* Colonna sinistra — input parametri */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {BIA_PARAMS.filter(p => !p.computed).map(param => (
              <div
                key={param.key}
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border:     `1px solid ${
                    values[param.key] !== ''
                      ? color + '33'
                      : 'rgba(255,255,255,0.06)'
                  }`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[18px]">{param.icon}</span>
                  <span className="font-display text-[13px] text-white/80">{param.label}</span>
                  <span className="font-body text-[11px] text-white/30 ml-1">({param.unit})</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={values[param.key]}
                    onChange={updateValue(param.key)}
                    className="input-base flex-1"
                    style={{ maxWidth: 140 }}
                  />
                  {prevBia?.[param.key] != null && (
                    <span className="font-body text-[12px] text-white/25">
                      Prec: <strong style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {prevBia[param.key]}{param.unit}
                      </strong>
                    </span>
                  )}
                </div>

                {errors[param.key] && (
                  <p className="font-body text-[11px] text-red-400 mt-1.5 m-0">
                    {errors[param.key]}
                  </p>
                )}

                {/* Preview gauge live */}
                {values[param.key] !== '' && (
                  <div className="mt-3">
                    <BiaGaugeBar
                      param={param}
                      value={Number(values[param.key])}
                      prevValue={prevBia?.[param.key] ?? null}
                      sex={client.sesso}
                      age={client.eta}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* BMI calcolato automaticamente */}
            {bmiComputed && (
              <div
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-[16px]">⚖️</span>
                <div>
                  <span className="font-display text-[11px] text-white/40">BMI calcolato automaticamente</span>
                  <div className="font-display font-black text-[18px]" style={{ color }}>
                    {bmiComputed}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Colonna destra — preview live */}
          <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0 sticky top-6">

            {/* Riepilogo parametri compilati */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <SectionLabel>ANTEPRIMA</SectionLabel>
              <div className="flex flex-col gap-3">
                {BIA_PARAMS.filter(p => !p.computed && values[p.key] !== '').map(param => (
                  <BiaGaugeBar
                    key={param.key}
                    param={param}
                    value={Number(values[param.key])}
                    prevValue={prevBia?.[param.key] ?? null}
                    sex={client.sesso}
                    age={client.eta}
                  />
                ))}
                {BIA_PARAMS.filter(p => !p.computed && values[p.key] !== '').length === 0 && (
                  <p className="font-body text-[12px] text-white/20 text-center py-4">
                    Inserisci i valori per vedere l'anteprima
                  </p>
                )}
              </div>
            </div>

            {/* Contatore parametri */}
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span className="font-body text-[12px] text-white/40">Parametri inseriti</span>
              <span
                className="font-display text-[14px]"
                style={{
                  color: BIA_PARAMS.filter(p => !p.computed && values[p.key] !== '').length ===
                         BIA_PARAMS.filter(p => !p.computed).length
                    ? '#34d399' : '#f59e0b',
                }}
              >
                {BIA_PARAMS.filter(p => !p.computed && values[p.key] !== '').length}/
                {BIA_PARAMS.filter(p => !p.computed).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Salvare la misurazione BIA?"
          description={`Stai per aggiornare la composizione corporea di ${client.name}.`}
          confirmLabel="SALVA"
          loading={loading}
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}
```

### 4E — Crea src/features/bia/bia-view/BiaSummary.jsx

```jsx
import { SectionLabel }        from '../../../components/ui'
import { BiaGaugeBar }         from './BiaGaugeBar'
import { BIA_PARAMS }          from '../../../constants/bia'
import { calcBiaScore }        from '../../../utils/bia'

/**
 * Riepilogo BIA attuale — mostrato nel dashboard cliente e trainer.
 * Sostituisce il pentagon per i profili BIA.
 */
export function BiaSummary({ bia, prevBia, sex, age, color }) {
  if (!bia) return null

  const score = calcBiaScore(bia, sex, age)
  const displayParams = BIA_PARAMS.filter(p => !p.computed)

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <SectionLabel className="mb-0">◈ Composizione corporea</SectionLabel>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-lg"
          style={{ background: color + '11', border: `1px solid ${color}33` }}
        >
          <span className="font-display text-[10px] text-white/40">SCORE</span>
          <span className="font-display font-black text-[16px]" style={{ color }}>
            {score}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayParams.map(param => (
          <BiaGaugeBar
            key={param.key}
            param={param}
            value={bia[param.key]}
            prevValue={prevBia?.[param.key] ?? null}
            sex={sex}
            age={age}
          />
        ))}
      </div>

      {bia.date && (
        <div className="mt-4 font-body text-[11px] text-white/20 text-right">
          Ultima misurazione: {bia.date}
        </div>
      )}
    </div>
  )
}
```

### 4F — Crea src/features/bia/UpgradeCategoryBanner.jsx

```jsx
import { useState }            from 'react'
import { ConfirmDialog }       from '../../components/common/ConfirmDialog'
import { getProfileCategory }  from '../../constants/bia'

/**
 * Banner upgrade categoria — mostrato nel dashboard trainer
 * quando il cliente non ha uno dei due moduli.
 */
export function UpgradeCategoryBanner({ client, color, onUpgrade }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)

  const profileType = client.profileType ?? 'tests_only'
  const current     = getProfileCategory(profileType)

  // Non mostrare se già completo
  if (profileType === 'complete') return null

  const missingLabel = profileType === 'tests_only'
    ? 'Bioimpedenziometria (BIA)'
    : 'Test atletici'
  const missingDesc = profileType === 'tests_only'
    ? 'Questo cliente non ha la BIA nel suo profilo. Puoi aggiungere la bioimpedenziometria per un profilo completo.'
    : 'Questo cliente non ha i test atletici nel suo profilo. Puoi aggiungere i test per un profilo completo con ranking.'

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onUpgrade(client, 'complete')
      setShowConfirm(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className="mx-6 mb-4 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
        style={{
          background: 'rgba(245,158,11,0.06)',
          border:     '1px solid rgba(245,158,11,0.2)',
        }}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-[18px] shrink-0 mt-0.5">⚠️</span>
          <div>
            <div className="font-display text-[12px] text-amber-400 tracking-wider mb-0.5">
              {missingLabel} non attiva
            </div>
            <div className="font-body text-[12px] text-white/40">
              {missingDesc}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="shrink-0 font-display text-[11px] px-4 py-2 rounded-lg cursor-pointer border-0 transition-opacity hover:opacity-85"
          style={{
            background:    'linear-gradient(135deg, #f59e0b, #d97706)',
            color:         '#07090e',
            borderRadius:  '6px',
            fontWeight:    700,
            letterSpacing: '0.05em',
          }}
        >
          AGGIUNGI AL PROFILO
        </button>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Aggiornare il profilo?"
          description={`${client.name} passerà al profilo Completo (Test + BIA). Lo storico esistente verrà mantenuto.`}
          confirmLabel="AGGIORNA"
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}
```

---

## FASE 5 — Integrazione nel dashboard trainer

### 5A — Aggiorna src/features/client/ClientDashboard.jsx

```jsx
import { useBia }                  from '../bia/useBia'
import { BiaView }                 from '../bia/BiaView'
import { BiaSummary }              from '../bia/bia-view/BiaSummary'
import { BiaHistoryChart }         from '../bia/bia-view/BiaHistoryChart'
import { UpgradeCategoryBanner }   from '../bia/UpgradeCategoryBanner'
import { getProfileCategory }      from '../../constants/bia'

// Aggiorna lo stato view
const [view, setView] = useState('dashboard') // 'dashboard' | 'campionamento' | 'bia'

// Aggiunge hook BIA
const { handleSaveBia, handleUpgradeProfile } = useBia(trainerId)

// Profilo cliente
const profileType = client.profileType ?? 'tests_only'
const profile     = getProfileCategory(profileType)

// View BIA
if (view === 'bia') {
  return (
    <BiaView
      client={client}
      color={color}
      onSave={(biaData) => handleSaveBia(client, biaData)}
      onBack={() => setView('dashboard')}
    />
  )
}

// Nel render del dashboard — dopo la sezione Status:

{/* Banner upgrade se profilo incompleto */}
<UpgradeCategoryBanner
  client={client}
  color={color}
  onUpgrade={handleUpgradeProfile}
/>

{/* Sezione BIA — solo se il profilo include BIA */}
{profile.hasBia && (
  <>
    <Divider color={color} />
    <section className="px-6 pt-6 pb-4">
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <SectionLabel className="mb-0">◈ BIA</SectionLabel>
          <button
            onClick={() => setView('bia')}
            className="text-[11px] font-display px-3 py-1.5 rounded-lg cursor-pointer border transition-all hover:opacity-80"
            style={{ color, borderColor: color + '55', background: color + '11' }}
          >
            NUOVA MISURAZIONE
          </button>
        </div>
        <BiaSummary
          bia={client.lastBia}
          prevBia={client.biaHistory?.[1] ?? null}
          sex={client.sesso}
          age={client.eta}
          color={color}
        />
      </div>
    </section>

    <Divider color={color} />

    <section className="px-6 py-6">
      <BiaHistoryChart biaHistory={client.biaHistory} color={color} />
    </section>
  </>
)}
```

---

## FASE 6 — Integrazione nel dashboard cliente

### 6A — Aggiorna src/features/client/client-view/ClientDashboardPage.jsx

```jsx
import { BiaSummary }      from '../../bia/bia-view/BiaSummary'
import { BiaHistoryChart } from '../../bia/bia-view/BiaHistoryChart'
import { BiaLockedPanel }  from '../../bia/BiaLockedPanel'
import { getProfileCategory } from '../../../constants/bia'

// Nel componente ClientDashboardPage
const profileType = client.profileType ?? 'tests_only'
const profile     = getProfileCategory(profileType)

// Nel render — dopo la sezione Status:

{/* Sezione test — solo se il profilo include test */}
{!profile.hasTests && (
  <BiaLockedPanel profileType={profileType} color={color} />
)}

{/* Sezione BIA */}
{profile.hasBia ? (
  <>
    <Divider color={color} />
    <section className="px-6 py-6">
      <BiaSummary
        bia={client.lastBia}
        prevBia={client.biaHistory?.[1] ?? null}
        sex={client.sesso}
        age={client.eta}
        color={color}
      />
    </section>
    <Divider color={color} />
    <section className="px-6 py-6">
      <BiaHistoryChart biaHistory={client.biaHistory} color={color} />
    </section>
  </>
) : (
  <BiaLockedPanel profileType={profileType} color={color} />
)}
```

---

## FASE 7 — Wizard aggiornato

### 7A — Aggiorna wizard.config.js

```js
import { PROFILE_CATEGORIES } from '../../../constants/bia'

/**
 * Gli step del wizard variano in base alla categoria profilo.
 * getWizardSteps(profileType) → array di step
 */
export function getWizardSteps(profileType = 'tests_only') {
  const base = [
    { type: 'anagrafica',    title: 'Dati anagrafici' },
    { type: 'profileType',   title: 'Tipologia profilo' }, // ← NUOVO
  ]

  const testSteps = [
    { type: 'categoria',   title: 'Categoria test' },
    { type: 'test',        title: null, index: 0 },
    { type: 'test',        title: null, index: 1 },
    { type: 'test',        title: null, index: 2 },
    { type: 'test',        title: null, index: 3 },
    { type: 'test',        title: null, index: 4 },
  ]

  const biaStep = [
    { type: 'bia', title: 'Misurazione BIA iniziale' }, // ← NUOVO
  ]

  const tail = [
    { type: 'settings', title: 'Impostazioni allenamento' },
    { type: 'account',  title: 'Account cliente' },
  ]

  if (profileType === 'tests_only') return [...base, ...testSteps, ...tail]
  if (profileType === 'bia_only')   return [...base, ...biaStep,   ...tail]
  return [...base, ...testSteps, ...biaStep, ...tail] // complete
}

export const TOTAL_STEPS_MAP = {
  tests_only: 11,
  bia_only:   5,
  complete:   12,
}
```

### 7B — Crea step StepProfileType

**`src/components/modals/new-client-wizard/steps/StepProfileType.jsx`**

```jsx
import { PROFILE_CATEGORIES } from '../../../../constants/bia'

export function StepProfileType({ profileType, setProfileType }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-body text-[13px] text-white/40 m-0">
        Scegli il tipo di valutazione per questo cliente.
        Potrai sempre aggiornarlo in seguito.
      </p>

      {PROFILE_CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => setProfileType(cat.id)}
          className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer border transition-all text-left"
          style={profileType === cat.id
            ? { background: cat.color + '12', borderColor: cat.color + '44' }
            : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }
          }
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[20px]"
            style={{
              background: profileType === cat.id ? cat.color + '22' : 'rgba(255,255,255,0.05)',
              border:     `1px solid ${profileType === cat.id ? cat.color + '44' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            {cat.icon}
          </div>
          <div className="flex-1">
            <div
              className="font-display font-black text-[14px] mb-1"
              style={{ color: profileType === cat.id ? cat.color : 'rgba(255,255,255,0.7)' }}
            >
              {cat.label}
            </div>
            <div className="font-body text-[12px] text-white/40">
              {cat.desc}
            </div>
            <div className="flex gap-2 mt-2">
              {cat.hasTests && (
                <span
                  className="font-display text-[9px] px-2 py-0.5 rounded-md"
                  style={{ background: cat.color + '18', color: cat.color + 'cc' }}
                >
                  TEST ATLETICI
                </span>
              )}
              {cat.hasBia && (
                <span
                  className="font-display text-[9px] px-2 py-0.5 rounded-md"
                  style={{ background: cat.color + '18', color: cat.color + 'cc' }}
                >
                  BIOIMPEDENZIOMETRIA
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
```

### 7C — Crea step StepBia

**`src/components/modals/new-client-wizard/steps/StepBia.jsx`**

```jsx
import { BIA_PARAMS, BIA_EMPTY }   from '../../../../constants/bia'
import { getBiaParamStatus }        from '../../../../utils/bia'
import { calcBmi }                  from '../../../../utils/bia'
import { Field }                    from '../../../ui'

export function StepBia({ biaValues, setBiaValues, errors, anagrafica }) {
  const bmiComputed = calcBmi(
    parseFloat(anagrafica.peso),
    parseFloat(anagrafica.altezza)
  )

  const update = (key) => (e) =>
    setBiaValues(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="flex flex-col gap-3">
      <p className="font-body text-[13px] text-white/40 m-0">
        Inserisci i valori della prima misurazione BIA.
        Puoi saltare i parametri non disponibili.
      </p>

      {bmiComputed && (
        <div
          className="rounded-xl px-4 py-2.5 flex items-center gap-3"
          style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}
        >
          <span>⚖️</span>
          <span className="font-display text-[11px] text-blue-400">
            BMI calcolato automaticamente: <strong>{bmiComputed}</strong>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BIA_PARAMS.filter(p => !p.computed).map(param => {
          const val    = biaValues[param.key]
          const status = val !== '' ? getBiaParamStatus(param.key, Number(val), anagrafica.sesso, parseInt(anagrafica.eta)) : null
          return (
            <Field
              key={param.key}
              label={`${param.icon} ${param.label} (${param.unit})`}
              error={errors[param.key]}
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="—"
                  value={val}
                  onChange={update(param.key)}
                  className="input-base flex-1"
                />
                {status && (
                  <span
                    className="font-display text-[10px] shrink-0 px-2 py-1 rounded-md"
                    style={{ background: status.color + '22', color: status.color }}
                  >
                    {status.label}
                  </span>
                )}
              </div>
            </Field>
          )
        })}
      </div>
    </div>
  )
}
```

### 7D — Aggiorna useWizard.js

```js
// Aggiunge stato profileType e biaValues
const [profileType, setProfileType] = useState('tests_only')
const [biaValues,   setBiaValues]   = useState(BIA_EMPTY)

// Aggiorna getWizardSteps dinamicamente
import { getWizardSteps, TOTAL_STEPS_MAP } from './wizard.config'

const WIZARD_STEPS = getWizardSteps(profileType)
const TOTAL_STEPS  = TOTAL_STEPS_MAP[profileType]

// Aggiorna handleConfirmSubmit per includere BIA e profileType
const newClient = await onAdd({
  ...anagrafica,
  eta:             parseInt(anagrafica.eta),
  peso:            parseFloat(anagrafica.peso),
  altezza:         parseFloat(anagrafica.altezza),
  categoria:       profileType === 'bia_only' ? null : categoria,
  profileType,
  testValues:      profileType !== 'bia_only' ? { ...tests } : {},
  stats:           profileType !== 'bia_only' ? allStats : {},
  biaHistory:      profileType !== 'tests_only'
    ? [{ ...parsedBiaValues, date: today }]
    : [],
  lastBia:         profileType !== 'tests_only' ? parsedBiaValues : null,
  email:           account.email.trim(),
  password:        account.password,
  sessionsPerWeek: parseInt(settings.sessionsPerWeek) || 3,
})

// Aggiorna StepContent per gestire profileType e bia
if (currentStep?.type === 'profileType') return (
  <StepProfileType
    profileType={profileType}
    setProfileType={(type) => {
      setProfileType(type)
      // Resetta i dati dell'altra tipologia se cambia
      if (type === 'bia_only') setTests({})
      if (type === 'tests_only') setBiaValues(BIA_EMPTY)
    }}
  />
)

if (currentStep?.type === 'bia') return (
  <StepBia
    biaValues={biaValues}
    setBiaValues={setBiaValues}
    errors={errors}
    anagrafica={anagrafica}
  />
)

// Esponi nel return
// profileType, setProfileType, biaValues, setBiaValues
```

---

## FASE 8 — Verifica

### 8A — Build
```bash
npm run build
```

### 8B — Checklist funzionale

**Wizard:**
- [ ] Step profileType mostra 3 opzioni
- [ ] tests_only → wizard con step test, no step BIA
- [ ] bia_only   → wizard con step BIA, no step test e no step categoria
- [ ] complete   → wizard con step test + step BIA
- [ ] Dati salvati correttamente su Firestore

**Dashboard trainer:**
- [ ] tests_only → mostra banner upgrade BIA, nessuna sezione BIA
- [ ] bia_only   → mostra sezione BIA, banner upgrade test
- [ ] complete   → mostra tutto senza banner
- [ ] Bottone NUOVA MISURAZIONE apre BiaView
- [ ] Bottone AGGIUNGI AL PROFILO fa upgrade a complete
- [ ] Storico precedente mantenuto dopo upgrade

**Dashboard cliente:**
- [ ] tests_only → sezione BIA bloccata con silhouette
- [ ] bia_only   → sezione test bloccata con silhouette
- [ ] complete   → tutto visibile

**BiaView:**
- [ ] Input parametri con preview gauge live
- [ ] BMI calcolato automaticamente
- [ ] Delta dal precedente mostrato
- [ ] Conferma prima di salvare
- [ ] XP assegnata correttamente

### 8C — Verifica Firestore
```bash
# Controlla che i nuovi campi siano scritti correttamente
# Apri Firebase Console → clients → documento cliente
# Verifica: profileType, biaHistory, lastBia
```
```

---

## Come usarlo in Claude Code

```
Leggi CLAUDE.md del progetto.
Poi esegui BIA_FEATURE.md fase per fase.

Inizia dalla FASE 1 — crea i file delle costanti.
Esegui npm run build dopo ogni fase.
Non procedere se ci sono errori.

Punti critici da verificare:
1. useWizard.js — i wizard steps cambiano dinamicamente
   in base a profileType
2. ClientDashboard — le sezioni si mostrano/nascondono
   in base a profile.hasTests e profile.hasBia
3. buildBiaUpdate in gamification.js — la logica XP
   dipende dal confronto con la misurazione precedente
```