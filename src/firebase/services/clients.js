import {
  collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy,
} from 'firebase/firestore'
import { db }           from './db'
import { clientsPath }  from '../paths'

export const getClients = async (orgId) => {
  const q    = query(collection(db, clientsPath(orgId)), orderBy('name'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getClientById = async (orgId, clientId) => {
  const snap = await getDoc(doc(db, clientsPath(orgId), clientId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const addClient    = (orgId, data)           => addDoc(collection(db, clientsPath(orgId)), data)
export const updateClient = (orgId, clientId, data) => updateDoc(doc(db, clientsPath(orgId), clientId), data)
export const deleteClient = (orgId, clientId)       => deleteDoc(doc(db, clientsPath(orgId), clientId))
