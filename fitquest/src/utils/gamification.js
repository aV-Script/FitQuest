import {
  RANKS,
  STAT_KEYS,
  BASE_SESSION_XP,
  XP_PER_STAT_POINT,
  XP_PER_LEVEL_MULTIPLIER,
  LOG_MAX_ENTRIES,
  LEVEL_PER_RANK,
} from '../constants'

/**
 * Calcola l'XP guadagnato da una sessione in base ai delta delle stat.
 * Solo i delta positivi contribuiscono all'XP.
 */
export function calcSessionXP(deltas) {
  const statBonus = STAT_KEYS.reduce((sum, k) => sum + Math.max(0, deltas[k] ?? 0), 0)
  return BASE_SESSION_XP + statBonus * XP_PER_STAT_POINT
}

/**
 * Applica i delta alle stat correnti, clampando tra 0 e 100.
 */
export function applyStatDeltas(currentStats, deltas) {
  return Object.fromEntries(
    STAT_KEYS.map(k => [k, Math.min(100, Math.max(0, currentStats[k] + (deltas[k] ?? 0)))])
  )
}

/**
 * Calcola il rank in base al livello.
 */
export function calcRank(level) {
  return RANKS[Math.min(Math.floor(level / LEVEL_PER_RANK), RANKS.length - 1)]
}

/**
 * Data la progressione XP corrente, calcola il nuovo stato dopo una sessione.
 * Gestisce il level-up ricorsivamente se l'XP supera la soglia più volte.
 */
export function calcLevelProgression(xp, xpNext, level) {
  let currentXp   = xp
  let currentNext = xpNext
  let currentLvl  = level

  while (currentXp >= currentNext) {
    currentXp  -= currentNext
    currentNext = Math.round(currentNext * XP_PER_LEVEL_MULTIPLIER)
    currentLvl += 1
  }

  return { xp: currentXp, xpNext: currentNext, level: currentLvl }
}

/**
 * Costruisce il nuovo stato completo del cliente dopo una sessione di aggiornamento.
 * Restituisce l'oggetto aggiornato e il log entry da salvare.
 */
export function buildProgressUpdate(client, deltas, note) {
  const xpGain    = calcSessionXP(deltas)
  const newStats  = applyStatDeltas(client.stats, deltas)
  const { xp, xpNext, level } = calcLevelProgression(
    client.xp + xpGain, client.xpNext, client.level
  )
  const rank      = calcRank(level)
  const today     = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
  const logEntry  = { date: today, action: note || `Sessione aggiornamento (Lv.${level})`, xp: xpGain }
  const log       = [logEntry, ...(client.log ?? [])].slice(0, LOG_MAX_ENTRIES)

  return {
    update:   { stats: newStats, xp, xpNext, level, rank, log },
    logEntry,
    xpGain,
    leveledUp: level > client.level,
  }
}

/**
 * Costruisce il profilo iniziale di un nuovo cliente.
 */
export function buildNewClient(trainerId, { name, avatar }, defaults) {
  const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
  return {
    ...defaults,
    name,
    avatar,
    trainerId,
    log: [{ date: today, action: 'Benvenuto nel programma! 🎉', xp: 50 }],
  }
}
