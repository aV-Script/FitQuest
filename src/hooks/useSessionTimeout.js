import { useEffect, useRef } from 'react'
import { logout }            from '../firebase/services/auth'

const TIMEOUT_MS = {
  super_admin:    30 * 60 * 1000,          //  30 minuti
  org_admin:       2 * 60 * 60 * 1000,    //   2 ore
  trainer:         8 * 60 * 60 * 1000,    //   8 ore
  staff_readonly:  8 * 60 * 60 * 1000,    //   8 ore
  client:          7 * 24 * 60 * 60 * 1000, // 7 giorni
}

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll']

/**
 * Esegue il logout automatico dopo un periodo di inattività.
 * Il timer si azzera ad ogni interazione utente.
 *
 * @param {string|null|undefined} role — ruolo dell'utente loggato
 */
export function useSessionTimeout(role) {
  const timerRef = useRef(null)

  useEffect(() => {
    if (!role) return

    const timeout = TIMEOUT_MS[role] ?? TIMEOUT_MS.trainer

    const reset = () => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => logout(), timeout)
    }

    reset()
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }))

    return () => {
      clearTimeout(timerRef.current)
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, reset))
    }
  }, [role])
}
