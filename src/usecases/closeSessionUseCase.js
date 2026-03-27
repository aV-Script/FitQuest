import { buildXPUpdate, calcSessionConfig } from '../utils/gamification'
import { closeSlot }      from '../firebase/services/calendar'
import { updateClient }   from '../firebase/services/clients'
import { addNotification } from '../firebase/services/notifications'

/**
 * Chiude una sessione: aggiorna lo slot, assegna XP agli attendees,
 * invia notifiche a presenti e assenti.
 *
 * @param {object}   slot        — slot da chiudere (deve avere id, date, clientIds)
 * @param {string[]} attendeeIds — clientIds presenti
 * @param {object[]} clients     — array completo dei clienti (per lookup)
 */
export async function closeSessionUseCase(slot, attendeeIds, clients) {
  const absenteeIds = slot.clientIds.filter(id => !attendeeIds.includes(id))

  await closeSlot(slot.id, { attendees: attendeeIds, absentees: absenteeIds })

  await Promise.all(
    attendeeIds.map(async clientId => {
      const client = clients.find(c => c.id === clientId)
      if (!client) return
      const config     = calcSessionConfig(client.sessionsPerWeek ?? 3)
      const { update } = buildXPUpdate(client, config.xpPerSession, 'Sessione di allenamento completata')
      await updateClient(client.id, update)
      if (client.clientAuthUid) {
        await addNotification({
          clientId: client.id,
          message:  `Sessione del ${slot.date} completata! +${config.xpPerSession} XP`,
          date:     new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
          type:     'session',
        })
      }
    })
  )

  await Promise.all(
    absenteeIds.map(async clientId => {
      const client = clients.find(c => c.id === clientId)
      if (!client?.clientAuthUid) return
      await addNotification({
        clientId: client.id,
        message:  `Sessione del ${slot.date} — assenza registrata.`,
        date:     new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
        type:     'absence',
      })
    })
  )
}
