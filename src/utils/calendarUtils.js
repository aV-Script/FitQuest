/** Altezza in px di un'ora nelle viste settimana e giorno. */
export const HOUR_HEIGHT_PX = 60

/**
 * Restituisce il range {from, to} del mese dato in formato 'YYYY-MM-DD'.
 * @param {number} year  — anno (es. 2026)
 * @param {number} month — mese 1-based (es. 3 = marzo)
 * @returns {{ from: string, to: string }}
 */
export function getMonthRange(year, month) {
  const from    = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const to      = `${year}-${String(month).padStart(2, '0')}-${lastDay}`
  return { from, to }
}

/**
 * Restituisce il range {from, to} della settimana (Lun–Dom) che contiene la data.
 * @param {string} date — 'YYYY-MM-DD'
 * @returns {{ from: string, to: string }}
 */
export function getWeekRange(date) {
  const d      = new Date(date + 'T12:00')
  const day    = d.getDay()
  const diff   = (day + 6) % 7
  const monday = new Date(d)
  monday.setDate(d.getDate() - diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    from: monday.toISOString().slice(0, 10),
    to:   sunday.toISOString().slice(0, 10),
  }
}

/**
 * Calcola la percentuale di completamento mensile per un cliente.
 * @param {object[]} clientSlots — slot del mese in cui il cliente è iscritto
 * @param {string}   clientId   — id del cliente
 * @returns {{ planned: number, completed: number, pct: number }}
 */
export function calcMonthlyCompletion(clientSlots, clientId) {
  const planned   = clientSlots.length
  const completed = clientSlots.filter(s => s.attendees?.includes(clientId)).length
  if (planned === 0) return { planned: 0, completed: 0, pct: 0 }
  return { planned, completed, pct: Math.round((completed / planned) * 100) }
}

/**
 * Genera tutte le date in un intervallo per i giorni della settimana dati.
 * @param {string}   startDate — 'YYYY-MM-DD'
 * @param {string}   endDate   — 'YYYY-MM-DD'
 * @param {number[]} days      — [0=Dom, 1=Lun, ..., 6=Sab]
 */
export function generateRecurrenceDates(startDate, endDate, days) {
  const dates  = []
  const cursor = new Date(startDate + 'T12:00')
  const end    = new Date(endDate   + 'T12:00')

  while (cursor <= end) {
    if (days.includes(cursor.getDay())) {
      dates.push(cursor.toISOString().slice(0, 10))
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}
