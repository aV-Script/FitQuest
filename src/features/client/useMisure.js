import { useCallback }                                    from 'react'
import { arrayUnion }                                     from 'firebase/firestore'
import { useTrainerState, useTrainerDispatch, ACTIONS }   from '../../context/TrainerContext'
import { updateClient }                                   from '../../firebase/services/clients'
import { useToast }                                       from '../../hooks/useToast'

export function useMisure() {
  const { orgId } = useTrainerState()
  const dispatch  = useTrainerDispatch()
  const toast     = useToast()

  const handleUpdateMisure = useCallback(async (client, { peso, altezza } = {}) => {
    const record = { date: new Date().toISOString() }
    const patch  = {}

    if (peso    !== undefined) { record.peso    = peso;    patch.peso    = peso }
    if (altezza !== undefined) { record.altezza = altezza; patch.altezza = altezza }
    if (Object.keys(patch).length === 0) return

    patch.misureHistory = arrayUnion(record)

    const optimistic = {
      ...client,
      ...patch,
      misureHistory: [...(client.misureHistory ?? []), record],
    }

    dispatch({ type: ACTIONS.SELECT_CLIENT, payload: optimistic })

    try {
      await updateClient(orgId, client.id, patch)
      toast.success('Misure aggiornate')
    } catch {
      dispatch({ type: ACTIONS.SELECT_CLIENT, payload: client })
      toast.error('Impossibile aggiornare le misure')
    }
  }, [orgId, dispatch, toast])

  return { handleUpdateMisure }
}
