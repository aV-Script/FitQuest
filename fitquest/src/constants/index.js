export const RANK_COLORS = {
  Rookie:   '#6ee7b7',
  Scout:    '#60a5fa',
  Warrior:  '#f59e0b',
  Champion: '#a78bfa',
  Legend:   '#f43f5e',
}

export const RANKS = ['Rookie', 'Scout', 'Warrior', 'Champion', 'Legend']

export const STATS = [
  { key: 'forza',        icon: '⚡', label: 'Forza' },
  { key: 'resistenza',   icon: '🫀', label: 'Resistenza' },
  { key: 'flessibilita', icon: '🤸', label: 'Flessibilità' },
  { key: 'velocita',     icon: '💨', label: 'Velocità' },
  { key: 'recupero',     icon: '🛡️', label: 'Recupero' },
]

export const STAT_KEYS = STATS.map(s => s.key)

export const AVATAR_OPTIONS = ['💪', '🧘', '🌱', '🏃', '⚡', '🦁', '🔥', '🏋️']

export const NEW_CLIENT_DEFAULTS = {
  avatar:  '💪',
  level:   1,
  rank:    'Rookie',
  xp:      0,
  xpNext:  700,
  stats:   { forza: 20, resistenza: 20, flessibilita: 20, velocita: 20, recupero: 20 },
  badges:  ['🌱 New Challenger'],
  log:     [],
}

export const XP_PER_LEVEL_MULTIPLIER = 1.3
export const BASE_SESSION_XP         = 300
export const XP_PER_STAT_POINT       = 15
export const LOG_MAX_ENTRIES         = 10
export const LEVEL_PER_RANK          = 4
