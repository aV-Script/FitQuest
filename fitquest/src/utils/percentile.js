import { TABLES, STAT_DIRECTION, getAgeGroup } from './tables'

/**
 * Calcola il percentile (0-100) dato un valore grezzo.
 * Funziona per tutte le statistiche di tutte le categorie.
 */
export function calcPercentile(statKey, rawValue, sesso, age) {
  const statTable = TABLES[statKey]
  if (!statTable) return 0

  const sexTable = statTable[sesso] ?? statTable['M']
  const ageGroup = getAgeGroup(statKey, age)
  let table = sexTable[ageGroup]
  if (!table) {
    const keys = Object.keys(sexTable)
    table = sexTable[keys[0]]
  }
  if (!table) return 0

  const direction = STAT_DIRECTION[statKey] ?? 'direct'
  const val = Number(rawValue)
  if (isNaN(val)) return 0

  const points = Object.entries(table)
    .map(([p, v]) => ({ pct: Number(p), val: Number(v) }))
    .sort((a, b) => a.pct - b.pct)

  if (direction === 'direct') {
    const minVal = points[0].val
    const maxVal = points[points.length - 1].val
    if (val <= minVal) return points[0].pct
    if (val >= maxVal) return points[points.length - 1].pct
    for (let i = 0; i < points.length - 1; i++) {
      const lo = points[i], hi = points[i + 1]
      if (val >= lo.val && val <= hi.val) {
        const ratio = (val - lo.val) / (hi.val - lo.val)
        return Math.round(lo.pct + ratio * (hi.pct - lo.pct))
      }
    }
  } else {
    const maxVal = points[0].val
    const minVal = points[points.length - 1].val
    if (val <= minVal) return points[points.length - 1].pct
    if (val >= maxVal) return points[0].pct
    for (let i = 0; i < points.length - 1; i++) {
      const lo = points[i], hi = points[i + 1]
      if (val <= lo.val && val >= hi.val) {
        const ratio = (lo.val - val) / (lo.val - hi.val)
        return Math.round(lo.pct + ratio * (hi.pct - lo.pct))
      }
    }
  }
  return 0
}

/**
 * Calcola la media delle statistiche.
 */
export function calcStatMedia(stats = {}) {
  const vals = Object.values(stats).filter(v => typeof v === 'number' && !isNaN(v))
  if (vals.length === 0) return 0
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}
