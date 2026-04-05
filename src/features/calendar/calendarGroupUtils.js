import {
  getSlotsByGroup,
  getGroupRecurrences,
  addClientToSlot,
  removeClientFromSlot,
  addClientToRecurrence,
  removeClientFromRecurrence,
} from '../../firebase/services/calendar'

export async function getGroupTogglePreview(orgId, groupId) {
  const today = new Date().toISOString().slice(0, 10)

  const [slots, recurrences] = await Promise.all([
    getSlotsByGroup(orgId, groupId, today),
    getGroupRecurrences(orgId, groupId),
  ])

  return {
    futureSlots: slots.length,
    recurrences,
  }
}

export async function addClientToGroupSlots(orgId, groupId, clientId) {
  const today = new Date().toISOString().slice(0, 10)

  const [slots, recurrences] = await Promise.all([
    getSlotsByGroup(orgId, groupId, today),
    getGroupRecurrences(orgId, groupId),
  ])

  const nonRecurringSlots = slots.filter(
    s => !s.recurrenceId && !s.clientIds.includes(clientId)
  )

  await Promise.all([
    ...nonRecurringSlots.map(s => addClientToSlot(orgId, s.id, clientId)),
    ...recurrences.map(r =>
      !r.clientIds.includes(clientId)
        ? addClientToRecurrence(orgId, r.id, clientId)
        : Promise.resolve()
    ),
  ])
}

export async function removeClientFromGroupSlots(orgId, groupId, clientId) {
  const today = new Date().toISOString().slice(0, 10)

  const [slots, recurrences] = await Promise.all([
    getSlotsByGroup(orgId, groupId, today),
    getGroupRecurrences(orgId, groupId),
  ])

  const nonRecurringSlots = slots.filter(
    s => !s.recurrenceId && s.clientIds.includes(clientId)
  )

  await Promise.all([
    ...nonRecurringSlots.map(s => removeClientFromSlot(orgId, s.id, clientId)),
    ...recurrences.map(r =>
      r.clientIds.includes(clientId)
        ? removeClientFromRecurrence(orgId, r.id, clientId)
        : Promise.resolve()
    ),
  ])
}
