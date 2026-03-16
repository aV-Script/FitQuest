import { useState, useEffect, useCallback } from 'react'
import {
  getTrainerSessions, addSessionsForClients,
  updateSession, deleteSession,
} from '../firebase/calendar'
import { updateClient, addNotification } from '../firebase/services'
import { buildXPUpdate } from '../utils/gamification'

export const MONTHLY_XP_TARGET   = 500   // XP totali per 100% completamento mese
export const BONUS_XP_FULL_MONTH = 200   // Bonus aggiuntivo per mese completato al 100%
export const WEEKS_PER_MONTH     = 4.33  // Settimane medie per mese

/**
 * Calcola sessioni mensili e XP per sessione data la frequenza settimanale.
 * Il totale mensile è sempre ~500 XP indipendentemente dalla frequenza.
 */
export function calcSessionConfig(sessionsPerWeek) {
  const freq        = Math.max(1, Math.min(7, Math.round(sessionsPerWeek)))
  const monthlySess = Math.round(freq * WEEKS_PER_MONTH)
  const xpPerSess   = Math.round(MONTHLY_XP_TARGET / monthlySess)
  return { sessionsPerWeek: freq, monthlySessions: monthlySess, xpPerSession: xpPerSess }
}

export function getMonthRange(year, month) {
  const from    = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const to      = `${year}-${String(month).padStart(2, '0')}-${lastDay}`
  return { from, to }
}

export function calcMonthlyCompletion(clientSessions) {
  const planned   = clientSessions.length
  const completed = clientSessions.filter(s => s.completed).length
  if (planned === 0) return { planned: 0, completed: 0, pct: 0 }
  return { planned, completed, pct: Math.round((completed / planned) * 100) }
}

export function useCalendar(trainerId) {
  const [sessions,     setSessions]     = useState([])
  const [loading,      setLoading]      = useState(false)
  const [currentYear,  setCurrentYear]  = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)

  const { from, to } = getMonthRange(currentYear, currentMonth)

  useEffect(() => {
    if (!trainerId) return
    setLoading(true)
    getTrainerSessions(trainerId, from, to)
      .then(setSessions)
      .finally(() => setLoading(false))
  }, [trainerId, from, to])

  const handleAddSessions = useCallback(async (date, clientIds) => {
    const { addSessionsForClients: addFn } = await import('../firebase/calendar')
    const newSessions = await addFn(trainerId, date, clientIds)
    setSessions(prev => [...prev, ...newSessions])
    return newSessions
  }, [trainerId])

  /**
   * Completa una singola sessione.
   * Usa xpPerSession dal profilo cliente se disponibile, altrimenti calcola dalla frequenza.
   */
  const handleCompleteSession = useCallback(async (sessionId, client) => {
    const config     = calcSessionConfig(client.sessionsPerWeek ?? 3)
    const xpToAssign = config.xpPerSession

    await updateSession(sessionId, { completed: true })
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, completed: true } : s
    ))

    const { update } = buildXPUpdate(client, xpToAssign, 'Sessione di allenamento completata')
    await updateClient(client.id, update)

    if (client.clientAuthUid) {
      const session = sessions.find(s => s.id === sessionId)
      await addNotification({
        clientId: client.id,
        message:  `Sessione del ${session?.date ?? ''} completata! +${xpToAssign} XP`,
        date:     new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
        type:     'session',
      })
    }
  }, [sessions])

  const handleCompleteByDate = useCallback(async (date, clientsData) => {
    const daySessions = sessions.filter(s => s.date === date && !s.completed)
    await Promise.all(
      daySessions.map(s => {
        const client = clientsData.find(c => c.id === s.clientId)
        if (client) return handleCompleteSession(s.id, client)
        return Promise.resolve()
      })
    )
  }, [sessions, handleCompleteSession])

  const handleDeleteSession = useCallback(async (sessionId) => {
    await deleteSession(sessionId)
    setSessions(prev => prev.filter(s => s.id !== sessionId))
  }, [])

  const goToPrevMonth = useCallback(() =>
    setCurrentMonth(m => { if (m === 1) { setCurrentYear(y => y - 1); return 12 } return m - 1 }), [])
  const goToNextMonth = useCallback(() =>
    setCurrentMonth(m => { if (m === 12) { setCurrentYear(y => y + 1); return 1 } return m + 1 }), [])

  return {
    sessions, loading,
    currentYear, currentMonth,
    goToPrevMonth, goToNextMonth,
    handleAddSessions,
    handleCompleteSession,
    handleCompleteByDate,
    handleDeleteSession,
  }
}
