// src/firebase/services.js
// ─────────────────────────────────────────────────────────────
// Placeholder per i servizi Firebase (da implementare nella fase 2)
// ─────────────────────────────────────────────────────────────

import { db } from './config'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore'

// ── Clienti ──────────────────────────────────────────────────

/** Recupera tutti i clienti di un trainer */
export async function getClients(trainerId) {
  const q = query(collection(db, 'clients'), where('trainerId', '==', trainerId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

/** Aggiunge un nuovo cliente */
export async function addClient(trainerId, clientData) {
  return addDoc(collection(db, 'clients'), { ...clientData, trainerId, createdAt: new Date() })
}

/** Aggiorna i dati di un cliente (stats, livello, xp…) */
export async function updateClient(clientId, data) {
  return updateDoc(doc(db, 'clients', clientId), data)
}

// ── Sessioni / Log ────────────────────────────────────────────

/** Aggiunge una sessione al log del cliente */
export async function addSession(clientId, sessionData) {
  return addDoc(collection(db, 'clients', clientId, 'sessions'), {
    ...sessionData,
    date: new Date(),
  })
}

/** Recupera lo storico sessioni di un cliente */
export async function getSessions(clientId) {
  const snapshot = await getDocs(collection(db, 'clients', clientId, 'sessions'))
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}
