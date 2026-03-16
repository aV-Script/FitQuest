// ─── Rank ─────────────────────────────────────────────────────────────────────
export const RANKS = [
  { min: 95,  label: 'EX',  color: '#ffd700' },
  { min: 90,  label: 'SS+', color: '#ff6b6b' },
  { min: 85,  label: 'SS',  color: '#ff8e53' },
  { min: 80,  label: 'S+',  color: '#ff6fd8' },
  { min: 75,  label: 'S',   color: '#c77dff' },
  { min: 70,  label: 'A+',  color: '#a78bfa' },
  { min: 65,  label: 'A',   color: '#60a5fa' },
  { min: 60,  label: 'B+',  color: '#38bdf8' },
  { min: 55,  label: 'B',   color: '#34d399' },
  { min: 50,  label: 'C+',  color: '#6ee7b7' },
  { min: 45,  label: 'C',   color: '#a3e635' },
  { min: 40,  label: 'D+',  color: '#facc15' },
  { min: 35,  label: 'D',   color: '#fb923c' },
  { min: 30,  label: 'E+',  color: '#f87171' },
  { min: 25,  label: 'E',   color: '#f43f5e' },
  { min: 20,  label: 'F+',  color: '#9ca3af' },
  { min: 0,   label: 'F',   color: '#6b7280' },
]

export function getRankFromMedia(media) {
  return RANKS.find(r => media >= r.min) ?? RANKS[RANKS.length - 1]
}

// ─── Categorie cliente ────────────────────────────────────────────────────────
export const CATEGORIE = [
  {
    id:    'health',
    label: 'Health',
    color: '#34d399',
    desc:  'Soggetti sedentari o con bassa attività fisica. Focus su mobilità, equilibrio e resistenza di base.',
  },
  {
    id:    'active',
    label: 'Active',
    color: '#60a5fa',
    desc:  'Soggetti fisicamente attivi. Test orientati a performance funzionale e forza esplosiva.',
  },
  {
    id:    'athlete',
    label: 'Athlete',
    color: '#f59e0b',
    desc:  'Atleti agonisti o con alto livello prestativo. Test di performance avanzati.',
  },
]

export const getCategoriaById = (id) => CATEGORIE.find(c => c.id === id) ?? CATEGORIE[0]

// ─── Test per categoria ───────────────────────────────────────────────────────
// Ogni categoria ha esattamente 5 test. L'ordine definisce la sequenza nel wizard.
export const CATEGORY_TESTS = {
  health: [
    { key: 'mobilita',    label: 'Mobilità',    unit: 'cm',      direction: 'direct',  test: 'Sit and Reach',         desc: 'Flessibilità della catena posteriore.' },
    { key: 'equilibrio',  label: 'Equilibrio',  unit: 'cadute',  direction: 'inverse', test: 'Flamingo Test',         desc: 'Numero di cadute in 60 secondi su un piede.' },
    { key: 'resistenza',  label: 'Resistenza',  unit: 'bpm',     direction: 'inverse', test: 'YMCA Step Test',        desc: 'FC di recupero a 1 minuto dal termine del test.' },
    { key: 'forza',       label: 'Forza',       unit: 'kg',      direction: 'direct',  test: 'Dinamometro Hand Grip', desc: 'Forza massima di presa della mano dominante.' },
    { key: 'esplosivita', label: 'Esplosività', unit: 'secondi', direction: 'inverse', test: '5 Sit to Stand',        desc: 'Tempo per alzarsi e sedersi 5 volte dalla sedia.' },
  ],
  active: [
    { key: 'y_balance',          label: 'Y Balance',     unit: '%',      direction: 'direct',  test: 'Y Balance Test',      desc: 'Score composito normalizzato sulla lunghezza arto.' },
    { key: 'forza',              label: 'Forza',         unit: 'kg',     direction: 'direct',  test: 'Dinamometro Hand Grip',desc: 'Forza massima di presa della mano dominante.' },
    { key: 'resistenza',         label: 'Resistenza',    unit: 'bpm',    direction: 'inverse', test: 'YMCA Step Test',       desc: 'FC di recupero a 1 minuto dal termine del test.' },
    { key: 'standing_long_jump', label: 'Salto Lungo',   unit: 'cm',     direction: 'direct',  test: 'Standing Long Jump',  desc: 'Distanza salto in lungo da fermo.' },
    { key: 'sprint_10m',         label: 'Sprint 10m',    unit: 'secondi',direction: 'inverse', test: '10m Sprint',           desc: 'Tempo sui 10 metri lanciati.' },
  ],
  athlete: [
    { key: 'drop_jump_rsi',  label: 'Reattività',  unit: 'RSI',     direction: 'direct',  test: 'Drop Jump RSI',    desc: 'Indice di forza reattiva (altezza/tempo contatto).' },
    { key: 't_test_agility', label: 'Agilità',     unit: 'secondi', direction: 'inverse', test: 'T-Test Agility',   desc: 'Tempo sul percorso a T (10x5m con coni).' },
    { key: 'yo_yo_ir1',      label: 'Yo-Yo',       unit: 'metri',   direction: 'direct',  test: 'Yo-Yo IR1',        desc: 'Distanza totale nel test intermittente Yo-Yo.' },
    { key: 'sprint_20m',     label: 'Sprint 20m',  unit: 'secondi', direction: 'inverse', test: 'Sprint 20m',       desc: 'Tempo sui 20 metri lanciati.' },
    { key: 'cmj',            label: 'CMJ',         unit: 'cm',      direction: 'direct',  test: 'CMJ Avanzato',     desc: 'Altezza salto verticale senza arm swing.' },
  ],
}

// Helper: ritorna i test della categoria del cliente
export function getTestsForCategoria(categoriaId) {
  return CATEGORY_TESTS[categoriaId] ?? CATEGORY_TESTS.health
}

// STAT_KEYS dinamici in base alla categoria
export function getStatKeysForCategoria(categoriaId) {
  return getTestsForCategoria(categoriaId).map(t => t.key)
}

// Retrocompatibilità: STATS punta ai test Health di default
export const STATS = CATEGORY_TESTS.health

export const STAT_KEYS = STATS.map(s => s.key)

// ─── Defaults nuovo cliente ───────────────────────────────────────────────────
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
}

export const XP_PER_LEVEL_MULTIPLIER = 1.3
export const LOG_MAX_ENTRIES         = 20
export const LEVEL_PER_RANK          = 4
