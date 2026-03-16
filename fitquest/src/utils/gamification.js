import {
  LOG_MAX_ENTRIES, XP_PER_LEVEL_MULTIPLIER,
  getRankFromMedia, getUnlockedClasses, getUnlockedSpecs,
} from '../constants'
import { BADGE_CATALOG } from '../constants/badges'
import { calcStatMedia } from './percentile'

export function calcLevelProgression(xp, xpNext, level) {
  let cur = xp, next = xpNext, lvl = level
  while (cur >= next) {
    cur  -= next
    next  = Math.round(next * XP_PER_LEVEL_MULTIPLIER)
    lvl  += 1
  }
  return { xp: cur, xpNext: next, level: lvl }
}

export function buildXPUpdate(client, xpToAdd, note) {
  const { xp, xpNext, level } = calcLevelProgression(client.xp + xpToAdd, client.xpNext, client.level)
  const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
  const entry = { date: today, action: note || `+${xpToAdd} XP aggiunto dal trainer`, xp: xpToAdd }
  const log   = [entry, ...(client.log ?? [])].slice(0, LOG_MAX_ENTRIES)
  return { update: { xp, xpNext, level, log } }
}

/**
 * Controlla se un badge deve essere sbloccato e restituisce
 * il badge + eventuale XP da assegnare.
 * Evita duplicati confrontando con i badge già posseduti.
 */
function checkBadge(id, existingBadgeIds) {
  if (existingBadgeIds.includes(id)) return null
  const def = BADGE_CATALOG.find(b => b.id === id)
  if (!def) return null
  return {
    id,
    type:       def.type,
    name:       def.name,
    unlockedAt: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
    ...(def.type === 'progression' ? { xpAwarded: def.xp } : {}),
    ...(def.type === 'cosmetic'    ? { title: def.title }   : {}),
  }
}

export function buildCampionamentoUpdate(client, newStats, testValues) {
  const media   = calcStatMedia(newStats)
  const rankObj = getRankFromMedia(media)
  const today   = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })

  const campionamento = { date: today, stats: newStats, tests: testValues, media }
  const campionamenti = [campionamento, ...(client.campionamenti ?? [])].slice(0, 50)

  // Log con valori grezzi
  const UNITS  = { forza: 'kg', mobilita: 'cm', equilibrio: 'cad.', esplosivita: 's', resistenza: 'bpm' }
  const valStr = Object.entries(testValues)
    .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)} ${v}${UNITS[k] ?? ''}`)
    .join(' · ')
  const logEntry = { date: today, action: `Campionamento — ${valStr}`, xp: 0 }

  // Badge esistenti (normalizzati come array di oggetti)
  const existingBadges    = normalizeBadges(client.badges ?? [])
  const existingBadgeIds  = existingBadges.map(b => b.id)
  const newBadges         = [...existingBadges]
  let   bonusXP           = 0

  // Primo campionamento
  if ((client.campionamenti ?? []).length === 0) {
    const b = checkBadge('first_camp', existingBadgeIds)
    if (b) { newBadges.push(b); existingBadgeIds.push(b.id) }
  }

  // Rank raggiunto
  const rankBadgeMap = { 'B': 'rank_b', 'B+': 'rank_b', 'A': 'rank_a', 'A+': 'rank_a',
    'S': 'rank_s', 'S+': 'rank_s', 'SS': 'rank_ss', 'SS+': 'rank_ss', 'EX': 'rank_ex' }
  const rankBadgeId = rankBadgeMap[rankObj.label]
  if (rankBadgeId) {
    const b = checkBadge(rankBadgeId, existingBadgeIds)
    if (b) { newBadges.push(b); existingBadgeIds.push(b.id); if (b.xpAwarded) bonusXP += b.xpAwarded }
  }

  // Statistiche a 100
  const stat100Map = { forza: 'stat_100_forza', mobilita: 'stat_100_mobilita',
    equilibrio: 'stat_100_equilibrio', esplosivita: 'stat_100_esplosivita', resistenza: 'stat_100_resistenza' }
  Object.entries(newStats).forEach(([key, val]) => {
    if (val >= 100) {
      const b = checkBadge(stat100Map[key], existingBadgeIds)
      if (b) { newBadges.push(b); existingBadgeIds.push(b.id); if (b.xpAwarded) bonusXP += b.xpAwarded }
    }
  })

  // Classi sbloccate
  const existingClassIds   = (client.classes ?? []).map(c => c.id)
  const newlyUnlockedClasses = getUnlockedClasses(newStats)
    .filter(cls => !existingClassIds.includes(cls.id))
    .map(cls => ({ id: cls.id, unlockedAt: today }))
  const classes = [...(client.classes ?? []), ...newlyUnlockedClasses]

  newlyUnlockedClasses.forEach(({ id }) => {
    const b = checkBadge(`class_${id}`, existingBadgeIds)
    if (b) { newBadges.push(b); existingBadgeIds.push(b.id) }
  })

  // Tutte le classi sbloccate?
  if (classes.length >= 5) {
    const b = checkBadge('all_classes', existingBadgeIds)
    if (b) { newBadges.push(b); existingBadgeIds.push(b.id) }
  }

  // SPEC sbloccate
  const existingSpecIds   = (client.specs ?? []).map(s => s.id)
  const newlyUnlockedSpecs = getUnlockedSpecs(newStats)
    .filter(spec => !existingSpecIds.includes(spec.id))
    .map(spec => ({ id: spec.id, unlockedAt: today, tests: {} }))
  const specs = [...(client.specs ?? []), ...newlyUnlockedSpecs]

  newlyUnlockedSpecs.forEach(({ id }) => {
    const b = checkBadge(`spec_${id}`, existingBadgeIds)
    if (b) { newBadges.push(b); existingBadgeIds.push(b.id) }
  })

  // Log entry con XP bonus badge
  const logEntries = [logEntry]
  if (bonusXP > 0) {
    logEntries.push({ date: today, action: `Badge sbloccati — +${bonusXP} XP bonus`, xp: bonusXP })
  }

  // XP totale con eventuali bonus badge
  let xpUpdate = {}
  if (bonusXP > 0) {
    const prog = calcLevelProgression(client.xp + bonusXP, client.xpNext, client.level)
    xpUpdate = { xp: prog.xp, xpNext: prog.xpNext, level: prog.level }
  }

  const log = [...logEntries, ...(client.log ?? [])].slice(0, LOG_MAX_ENTRIES)

  return {
    update: {
      stats:      newStats,
      rank:       rankObj.label,
      rankColor:  rankObj.color,
      media,
      campionamenti,
      log,
      badges:     newBadges,
      classes,
      specs,
      ...xpUpdate,
    },
    campionamento,
    newlyUnlockedClasses,
    newlyUnlockedSpecs,
    newBadgesEarned: newBadges.slice(existingBadges.length), // solo i nuovi
  }
}

export function buildNewClient(trainerId, formData, defaults) {
  const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
  const { testValues, stats, ...anagrafica } = formData
  const media   = calcStatMedia(stats)
  const rankObj = getRankFromMedia(media)
  const classes = getUnlockedClasses(stats).map(cls => ({ id: cls.id, unlockedAt: today }))
  const specs   = getUnlockedSpecs(stats).map(spec => ({ id: spec.id, unlockedAt: today, tests: {} }))

  // Badge iniziali come oggetti
  const badges = [
    { id: 'first_camp', type: 'cosmetic', name: 'Primo Campionamento',
      title: "L'Inizio", unlockedAt: today },
    ...classes.map(c => ({ id: `class_${c.id}`, type: 'cosmetic',
      name: c.id, title: `Il ${c.id}`, unlockedAt: today })),
    ...specs.map(s => ({ id: `spec_${s.id}`, type: 'cosmetic',
      name: s.id, title: `Il ${s.id}`, unlockedAt: today })),
  ]

  return {
    ...defaults,
    ...anagrafica,
    trainerId,
    stats,
    rank:      rankObj.label,
    rankColor: rankObj.color,
    media,
    classes,
    specs,
    badges,
    campionamenti: [{ date: today, stats, tests: testValues, media }],
    log: [{ date: today, action: 'Benvenuto nel programma!', xp: 0 }],
  }
}

/** Normalizza badge da stringa legacy o oggetto moderno */
function normalizeBadges(badges) {
  return badges.map(b => {
    if (typeof b === 'string') {
      return { id: b, type: 'cosmetic', name: b, unlockedAt: '—' }
    }
    return b
  })
}
