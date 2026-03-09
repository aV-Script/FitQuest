import { useEffect, useCallback } from 'react'
import { useClientState, useClientDispatch, ACTIONS } from '../context/ClientContext'
import { getClients, addClient, updateClient, addSession } from '../firebase/services'
import { buildNewClient, buildProgressUpdate } from '../utils/gamification'
import { NEW_CLIENT_DEFAULTS } from '../constants'

/**
 * Hook principale per la gestione dei clienti.
 * Gestisce fetch, aggiunta, selezione e aggiornamento del progresso.
 */
export function useClients(trainerId) {
  const state    = useClientState()
  const dispatch = useClientDispatch()

  // ── Fetch iniziale ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!trainerId) return

    dispatch({ type: ACTIONS.SET_LOADING, payload: true })

    getClients(trainerId)
      .then(clients => dispatch({ type: ACTIONS.SET_CLIENTS, payload: clients }))
      .catch(err   => dispatch({ type: ACTIONS.SET_ERROR,   payload: err.message }))
  }, [trainerId])

  // ── Aggiunge un nuovo cliente ─────────────────────────────────────────────
  const handleAddClient = useCallback(async (formData) => {
    const newClientData = buildNewClient(trainerId, formData, NEW_CLIENT_DEFAULTS)

    try {
      const ref = await addClient(trainerId, newClientData)
      dispatch({ type: ACTIONS.ADD_CLIENT, payload: { id: ref.id, ...newClientData } })
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message })
      throw err
    }
  }, [trainerId])

  // ── Aggiorna il progresso di un cliente (level up) ────────────────────────
  const handleProgressUpdate = useCallback(async (client, deltas, note) => {
    const { update, logEntry, xpGain } = buildProgressUpdate(client, deltas, note)

    try {
      // Ottimistic update: aggiorna UI subito, poi sincronizza Firebase
      dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: { id: client.id, ...update } })

      await Promise.all([
        updateClient(client.id, update),
        addSession(client.id, { action: logEntry.action, xp: xpGain, statDeltas: deltas }),
      ])
    } catch (err) {
      // Rollback in caso di errore
      dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: client })
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Errore durante il salvataggio. Riprova.' })
      throw err
    }
  }, [])

  // ── Navigazione ───────────────────────────────────────────────────────────
  const selectClient   = useCallback(client => dispatch({ type: ACTIONS.SELECT_CLIENT,   payload: client }), [])
  const deselectClient = useCallback(()       => dispatch({ type: ACTIONS.DESELECT_CLIENT }), [])

  return {
    ...state,
    handleAddClient,
    handleProgressUpdate,
    selectClient,
    deselectClient,
  }
}
