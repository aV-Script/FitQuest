import { useState, useEffect, useCallback } from 'react'
import { useTrainerDispatch, ACTIONS }       from '../context/TrainerContext'
import { getClients, updateClient, deleteClient } from '../firebase/services/clients'
import { addNotification }          from '../firebase/services/notifications'
import { buildCampionamentoUpdate, buildXPUpdate } from '../utils/gamification'
import { createClientUseCase }      from '../usecases/createClientUseCase'
import { saveCampionamentoUseCase } from '../usecases/saveCampionamentoUseCase'
import { useToast }              from './useToast'
import { getFirebaseErrorMessage } from '../utils/firebaseErrors'

export function useClients(trainerId) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const dispatch              = useTrainerDispatch()
  const toast                 = useToast()

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchClients = useCallback(() => {
    if (!trainerId) return
    setLoading(true)
    setError(null)
    getClients(trainerId)
      .then(data => setClients(data))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false))
  }, [trainerId])

  useEffect(() => { fetchClients() }, [fetchClients])

  // ── Helpers ────────────────────────────────────────────────────────────────
  const updateLocal = useCallback((id, updater) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updater } : c))
  }, [])

  const removeLocal = useCallback((id) => {
    setClients(prev => prev.filter(c => c.id !== id))
  }, [])

  // ── Add client — non ottimistico per natura (richiede uid Firebase) ────────
  const handleAddClient = useCallback(async (formData) => {
    try {
      const newClient = await createClientUseCase(trainerId, formData)
      setClients(prev => [...prev, newClient])
      toast.success('Cliente creato')
      return newClient
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err, 'Impossibile creare il cliente'))
      throw err
    }
  }, [trainerId, toast])

  // ── Campionamento — ottimistico con rollback ───────────────────────────────
  const handleCampionamento = useCallback(async (client, newStats, testValues) => {
    const { update } = buildCampionamentoUpdate(client, newStats, testValues)
    const snapshot   = client

    updateLocal(client.id, update)
    dispatch({ type: ACTIONS.SELECT_CLIENT, payload: { ...client, ...update } })

    try {
      await saveCampionamentoUseCase(client, update)
      toast.success('Campionamento salvato')
    } catch {
      updateLocal(client.id, snapshot)
      dispatch({ type: ACTIONS.SELECT_CLIENT, payload: snapshot })
      toast.error('Impossibile salvare il campionamento')
    }
  }, [dispatch, updateLocal, toast])

  // ── Add XP — ottimistico con rollback ─────────────────────────────────────
  const handleAddXP = useCallback(async (client, xpToAdd, note) => {
    const { update } = buildXPUpdate(client, xpToAdd, note)
    const snapshot   = client

    updateLocal(client.id, update)
    dispatch({ type: ACTIONS.SELECT_CLIENT, payload: { ...client, ...update } })

    try {
      await updateClient(client.id, update)
      if (client.clientAuthUid) {
        await addNotification({
          clientId: client.id,
          message:  `Hai guadagnato ${xpToAdd} XP — ${note || 'aggiunto dal trainer'}!`,
          date:     new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
          type:     'xp',
        })
      }
    } catch {
      updateLocal(client.id, snapshot)
      dispatch({ type: ACTIONS.SELECT_CLIENT, payload: snapshot })
    }
  }, [dispatch, updateLocal])

  // ── Delete client — ottimistico con rollback ──────────────────────────────
  const handleDeleteClient = useCallback(async (clientId) => {
    const snapshot = clients.find(c => c.id === clientId)

    removeLocal(clientId)
    dispatch({ type: ACTIONS.DESELECT_CLIENT })

    try {
      await deleteClient(clientId)
      toast.success('Cliente eliminato')
    } catch {
      if (snapshot) setClients(prev => [...prev, snapshot])
      toast.error('Impossibile eliminare il cliente')
    }
  }, [clients, dispatch, removeLocal, toast])

  return {
    clients,
    isLoading: loading,
    fetchError: error,
    fetchClients,
    handleAddClient,
    handleCampionamento,
    handleAddXP,
    handleDeleteClient,
  }
}