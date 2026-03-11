import {
  getFirestore, collection, getDocs, addDoc, updateDoc,
  doc, query, where, arrayUnion
} from 'firebase/firestore'
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged
} from 'firebase/auth'
import app from './config'

const db   = getFirestore(app)
const auth = getAuth(app)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login       = (email, pw) => signInWithEmailAndPassword(auth, email, pw)
export const register    = (email, pw) => createUserWithEmailAndPassword(auth, email, pw)
export const logout      = ()          => signOut(auth)
export const onAuthChange = (cb)       => onAuthStateChanged(auth, cb)

// ── Clients ───────────────────────────────────────────────────────────────────
export async function getClients(trainerId) {
  const q    = query(collection(db, 'clients'), where('trainerId', '==', trainerId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const addClient    = (trainerId, data) => addDoc(collection(db, 'clients'), data)
export const updateClient = (id, data)        => updateDoc(doc(db, 'clients', id), data)
export const addSession   = (clientId, data)  =>
  updateDoc(doc(db, 'clients', clientId), { sessions: arrayUnion({ ...data, createdAt: new Date().toISOString() }) })

// ── Missions ──────────────────────────────────────────────────────────────────
export async function getMissions(clientId) {
  const q    = query(collection(db, 'missions'), where('clientId', '==', clientId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const addMission    = (data)       => addDoc(collection(db, 'missions'), data)
export const updateMission = (id, data)   => updateDoc(doc(db, 'missions', id), data)

// ── Mission Templates ─────────────────────────────────────────────────────────
export async function getCustomTemplates(trainerId) {
  const q    = query(collection(db, 'missionTemplates'), where('trainerId', '==', trainerId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const saveTemplate = (trainerId, data) =>
  addDoc(collection(db, 'missionTemplates'), { ...data, trainerId })
