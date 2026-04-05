/**
 * Configurazione moduli RankEX.
 *
 * personal_training — PT e GYM (stesso modulo, terminology diversa)
 * soccer_academy    — accademie calcistiche
 *
 * Il modulo è configurato a livello di organizzazione.
 * Ogni org ha un moduleType e un terminologyVariant.
 */

// ── Terminologie disponibili ──────────────────────────────────
export const TERMINOLOGIES = {

  personal_training: {
    id:         'personal_training',
    appName:    'RankEX PT',
    manager:    'Trainer',
    managers:   'Trainer',
    member:     'Cliente',
    members:    'Clienti',
    group:      'Gruppo',
    groups:     'Gruppi',
    session:    'Sessione',
    sessions:   'Sessioni',
    assessment: 'Campionamento',
    newMember:  'Nuovo cliente',
    newGroup:   'Nuovo gruppo',
    newSession: 'Nuova sessione',
  },

  gym: {
    id:         'gym',
    appName:    'RankEX GYM',
    manager:    'Personal Trainer',
    managers:   'Personal Trainer',
    member:     'Membro',
    members:    'Membri',
    group:      'Classe',
    groups:     'Classi',
    session:    'Allenamento',
    sessions:   'Allenamenti',
    assessment: 'Valutazione',
    newMember:  'Nuovo membro',
    newGroup:   'Nuova classe',
    newSession: 'Nuovo allenamento',
  },

  soccer_academy: {
    id:         'soccer_academy',
    appName:    'RankEX FC',
    manager:    'Coach',
    managers:   'Coach',
    member:     'Allievo',
    members:    'Allievi',
    group:      'Squadra',
    groups:     'Squadre',
    session:    'Allenamento',
    sessions:   'Allenamenti',
    assessment: 'Valutazione atletica',
    newMember:  'Nuovo allievo',
    newGroup:   'Nuova squadra',
    newSession: 'Nuovo allenamento',
  },
}

// ── Configurazione moduli ─────────────────────────────────────
export const MODULES = {

  personal_training: {
    id:                  'personal_training',
    label:               'Personal Training',
    icon:                '🏋️',
    hasCategories:       true,
    testMode:            'by_category',
    fixedTests:          null,
    defaultTerminology:  'personal_training',
    terminologyVariants: ['personal_training', 'gym'],
    hasPlayerRoles:      false,
    profileTypes:        ['tests_only', 'bia_only', 'complete'],
  },

  soccer_academy: {
    id:                  'soccer_academy',
    label:               'Soccer Academy',
    icon:                '⚽',
    hasCategories:       false,
    testMode:            'fixed',
    fixedTests: [
      'y_balance',
      'standing_long_jump',
      '505_cod_agility',
      'sprint_20m',
      'beep_test',
    ],
    defaultTerminology:  'soccer_academy',
    terminologyVariants: ['soccer_academy'],
    hasPlayerRoles:      true,
    profileTypes:        ['tests_only'],
  },
}

// ── Player roles (soccer) ─────────────────────────────────────
export const PLAYER_ROLES = Object.freeze([
  { id: 'goalkeeper',  label: 'Portiere',      abbr: 'POR', icon: '🧤' },
  { id: 'defender',    label: 'Difensore',      abbr: 'DIF', icon: '🛡️' },
  { id: 'midfielder',  label: 'Centrocampista', abbr: 'CEN', icon: '⚙️' },
  { id: 'forward',     label: 'Attaccante',     abbr: 'ATT', icon: '⚡' },
])

// ── Helpers ───────────────────────────────────────────────────
export function getModule(moduleType) {
  return MODULES[moduleType] ?? MODULES.personal_training
}

export function getTerminology(terminologyVariant) {
  return TERMINOLOGIES[terminologyVariant] ?? TERMINOLOGIES.personal_training
}

export function getPlayerRole(id) {
  return PLAYER_ROLES.find(r => r.id === id) ?? null
}

export function getModuleTests(moduleType, categoria) {
  const mod = getModule(moduleType)
  if (mod.testMode === 'fixed') return mod.fixedTests
  // by_category — delega a getTestsForCategoria
  return null
}
