import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, where,
} from 'firebase/firestore'
import { db }               from './db'
import { workoutPlansPath } from '../paths'

export const getWorkoutPlans = async (orgId) => {
  try {
    const q    = query(collection(db, workoutPlansPath(orgId)), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}

// Fetch schede di un singolo cliente (usato dal lato client — single-field index automatico)
export const getWorkoutPlanForClient = async (orgId, clientId) => {
  try {
    const q    = query(collection(db, workoutPlansPath(orgId)), where('clientId', '==', clientId))
    const snap = await getDocs(q)
    const plans = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    return plans.find(p => p.status === 'active') ?? null
  } catch {
    return null
  }
}

export const addWorkoutPlan = (orgId, data) =>
  addDoc(collection(db, workoutPlansPath(orgId)), {
    ...data,
    status:    'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

export const updateWorkoutPlan = (orgId, planId, data) =>
  updateDoc(doc(db, workoutPlansPath(orgId), planId), {
    ...data,
    updatedAt: new Date().toISOString(),
  })

export const deleteWorkoutPlan = (orgId, planId) =>
  deleteDoc(doc(db, workoutPlansPath(orgId), planId))
