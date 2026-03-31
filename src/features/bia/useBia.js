import { useCallback }                                      from 'react'
import { useTrainerDispatch, ACTIONS }                      from '../../context/TrainerContext'
import { updateClient }                                     from '../../firebase/services/clients'
import { addNotification }                                  from '../../firebase/services/notifications'
import { buildBiaUpdate, buildProfileUpgrade }              from '../../utils/gamification'

/**
 * Hook per la gestione delle misurazioni BIA.
 * Usato nel dashboard trainer per i clienti con BIA.
 */
export function useBia(trainerId) {
  const dispatch = useTrainerDispatch()

  /**
   * Salva una nuova misurazione BIA per un cliente.
   */
  const handleSaveBia = useCallback(async (client, biaData) => {
    const { update, xpEarned } = buildBiaUpdate(client, biaData)

    // Ottimistico
    dispatch({
      type:    ACTIONS.UPDATE_CLIENT,
      payload: { id: client.id, ...update },
    })
    dispatch({
      type:    ACTIONS.SELECT_CLIENT,
      payload: { ...client, ...update },
    })

    try {
      await updateClient(client.id, update)
      if (client.clientAuthUid && xpEarned > 0) {
        await addNotification({
          clientId: client.id,
          message:  xpEarned === 100
            ? `Prima misurazione BIA completata! +${xpEarned} XP`
            : `BIA aggiornata — ${xpEarned > 0 ? `+${xpEarned} XP guadagnati!` : 'continua così!'}`,
          date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
          type: 'bia',
        })
      }
    } catch {
      // Rollback
      dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: client })
      dispatch({ type: ACTIONS.SELECT_CLIENT, payload: client })
    }
  }, [dispatch])

  /**
   * Upgrade categoria profilo cliente.
   */
  const handleUpgradeProfile = useCallback(async (client, newProfileType) => {
    const update   = buildProfileUpgrade(client, newProfileType)
    const snapshot = client

    dispatch({
      type:    ACTIONS.UPDATE_CLIENT,
      payload: { id: client.id, ...update },
    })
    dispatch({
      type:    ACTIONS.SELECT_CLIENT,
      payload: { ...client, ...update },
    })

    try {
      await updateClient(client.id, update)
      if (client.clientAuthUid) {
        await addNotification({
          clientId: client.id,
          message:  'Il tuo profilo è stato aggiornato dal trainer.',
          date:     new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
          type:     'upgrade',
        })
      }
    } catch {
      dispatch({ type: ACTIONS.UPDATE_CLIENT, payload: snapshot })
      dispatch({ type: ACTIONS.SELECT_CLIENT, payload: snapshot })
    }
  }, [dispatch])

  return { handleSaveBia, handleUpgradeProfile }
}
