import { useEffect, useCallback } from 'react'
import { useClientState, useClientDispatch, ACTIONS } from '../context/ClientContext'
import { getClients, addClient, updateClient } from '../firebase/services'
import { buildNewClient, buildCampionamentoUpdate, buildXPUpdate } from '../utils/gamification'
import { NEW_CLIENT_DEFAULTS } from '../constants'

export function useClients(trainerId) {
  const state    = useClientState()
  const dispatch = useClientDispatch()

  useEffect(() => {
    if (!trainerId) return
    dispatch({ type: ACTIONS.SET_LOADING, payload: true })
    getClients(trainerId)
      .then(clients => dispatch({ type: ACTIONS.SET_CLIENTS, payload: clients }))
      .catch(err   => dispatch({ type: ACTIONS.SET_ERROR,   payload: err.message }))
  }, [trainerId])

  const handleAddClient = useCallback(async (formData) => {
    const data = buildNewClient(trainerId, formData, NEW_CLIENT_DEFAULTS)
    const ref  = await addClient(trainerId, data)
    dispatch({ type: ACTIONS.ADD_CLIENT, payload: { id: ref.id, ...data } })
  }, [trainerId])

  const handleCampionamento = useCallback(async (client, newStats, testValues, note) => {
    const { update } = buildCampionamentoUpdate(client, newStats, testValues, note)
    dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: { id: client.id, ...update } })
    try { await updateClient(client.id, update) }
    catch { dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: client }) }
  }, [])

  const handleAddXP = useCallback(async (client, xpToAdd, note) => {
    const { update } = buildXPUpdate(client, xpToAdd, note)
    dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: { id: client.id, ...update } })
    try { await updateClient(client.id, update) }
    catch { dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: client }) }
  }, [])

  const updateLocalClient = useCallback((update) => {
    if (state.selectedClient?.id) {
      dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: { id: state.selectedClient.id, ...update } })
    }
  }, [state.selectedClient?.id])

  const selectClient   = useCallback(client => dispatch({ type: ACTIONS.SELECT_CLIENT,   payload: client }), [])
  const deselectClient = useCallback(()       => dispatch({ type: ACTIONS.DESELECT_CLIENT }), [])

  return { ...state, handleAddClient, handleCampionamento, handleAddXP, updateLocalClient, selectClient, deselectClient }
}
