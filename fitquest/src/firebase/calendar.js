import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, where,
} from 'firebase/firestore'
import { db } from './db'

/**
 * Modello sessione — 1 sessione per 1 cliente (mai condivisa):
 * {
 *   id, trainerId, clientId,
 *   date: 'YYYY-MM-DD',
 *   completed: bool,
 *   createdAt: ISO string
 * }
 *
 * Il gruppo è solo uno shortcut di selezione lato UI:
 * creare una sessione per un gruppo = creare N sessioni separate.
 */

export const getTrainerSessions = async (trainerId, dateFrom, dateTo) => {
  const q    = query(
    collection(db, 'sessions'),
    where('trainerId', '==', trainerId),
    where('date', '>=', dateFrom),
    where('date', '<=', dateTo)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getClientSessions = async (clientId, dateFrom, dateTo) => {
  const q    = query(
    collection(db, 'sessions'),
    where('clientId', '==', clientId),
    where('date', '>=', dateFrom),
    where('date', '<=', dateTo)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const addSession    = (data) =>
  addDoc(collection(db, 'sessions'), {
    ...data,
    completed: false,
    createdAt: new Date().toISOString(),
  })

export const updateSession = (id, data) => updateDoc(doc(db, 'sessions', id), data)
export const deleteSession = (id)       => deleteDoc(doc(db, 'sessions', id))

/**
 * Crea una sessione per ogni clientId nell'array.
 * Usato per assegnare una data di allenamento a un gruppo intero.
 * Restituisce le sessioni create con i loro ID.
 */
export const addSessionsForClients = async (trainerId, date, clientIds) => {
  const results = await Promise.all(
    clientIds.map(clientId =>
      addSession({ trainerId, clientId, date })
        .then(ref => ({ id: ref.id, trainerId, clientId, date, completed: false }))
    )
  )
  return results
}
