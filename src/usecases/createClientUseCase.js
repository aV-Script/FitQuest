import { createClientAccount } from '../firebase/services/auth'
import { addClient }           from '../firebase/services/clients'
import { createUserProfile }   from '../firebase/services/users'
import { buildNewClient }      from '../utils/gamification'
import { NEW_CLIENT_DEFAULTS } from '../constants'

/**
 * Crea un nuovo cliente: account Auth, documento clients, profilo users.
 *
 * @param {string} trainerId
 * @param {object} formData  — { email, password, ...anagrafica }
 * @returns {{ id: string, ...clientData }} — cliente completo con id Firestore
 */
export async function createClientUseCase(trainerId, formData) {
  const { email, password, ...rest } = formData
  const clientUid = await createClientAccount(email, password)
  const data      = buildNewClient(trainerId, rest, NEW_CLIENT_DEFAULTS)
  const ref       = await addClient(trainerId, { ...data, email, clientAuthUid: clientUid })
  await createUserProfile(clientUid, {
    role:               'client',
    clientId:           ref.id,
    trainerId,
    mustChangePassword: true,
  })
  return { id: ref.id, ...data, email, clientAuthUid: clientUid }
}
