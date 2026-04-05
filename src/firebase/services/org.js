import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc, getDoc, setDoc,
} from 'firebase/firestore'
import { db }                   from './db'
import { orgPath, membersPath } from '../paths'

// ── Organizzazioni ────────────────────────────────────────────

export const createOrg = (data) =>
  addDoc(collection(db, 'organizations'), {
    ...data,
    createdAt: new Date().toISOString(),
  })

export const getOrg = async (orgId) => {
  const snap = await getDoc(doc(db, 'organizations', orgId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const updateOrg = (orgId, data) =>
  updateDoc(doc(db, 'organizations', orgId), data)

export const getAllOrgs = async () => {
  const snap = await getDocs(collection(db, 'organizations'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Membri ────────────────────────────────────────────────────

export const getMembers = async (orgId) => {
  const snap = await getDocs(collection(db, membersPath(orgId)))
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }))
}

export const addMember = (orgId, uid, data) =>
  setDoc(doc(db, membersPath(orgId), uid), {
    ...data,
    joinedAt: new Date().toISOString(),
  })

export const updateMember = (orgId, uid, data) =>
  updateDoc(doc(db, membersPath(orgId), uid), data)

export const removeMember = (orgId, uid) =>
  deleteDoc(doc(db, membersPath(orgId), uid))

export const getMember = async (orgId, uid) => {
  const snap = await getDoc(doc(db, membersPath(orgId), uid))
  return snap.exists() ? { uid: snap.id, ...snap.data() } : null
}
