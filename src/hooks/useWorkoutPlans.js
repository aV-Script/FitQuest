import { useState, useEffect, useCallback } from 'react'
import {
  getWorkoutPlans, addWorkoutPlan,
  updateWorkoutPlan, deleteWorkoutPlan,
} from '../firebase/services/workoutPlans'

/**
 * Hook per la gestione delle schede allenamento dell'organizzazione.
 * @param {string} orgId
 */
export function useWorkoutPlans(orgId) {
  const [plans,   setPlans]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId) return
    setLoading(true)
    getWorkoutPlans(orgId).then(data => {
      setPlans(data)
      setLoading(false)
    })
  }, [orgId])

  const handleAdd = useCallback(async (data) => {
    const ref  = await addWorkoutPlan(orgId, data)
    const item = {
      id:        ref.id,
      ...data,
      status:    'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setPlans(prev => [item, ...prev])
    return item
  }, [orgId])

  const handleUpdate = useCallback(async (planId, data) => {
    const snapshot = plans
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, ...data, updatedAt: new Date().toISOString() } : p))
    try {
      await updateWorkoutPlan(orgId, planId, data)
    } catch {
      setPlans(snapshot)
    }
  }, [orgId, plans])

  const handleDelete = useCallback(async (planId) => {
    const snapshot = plans
    setPlans(prev => prev.filter(p => p.id !== planId))
    try {
      await deleteWorkoutPlan(orgId, planId)
    } catch {
      setPlans(snapshot)
    }
  }, [orgId, plans])

  const handleArchive = useCallback((planId) =>
    handleUpdate(planId, { status: 'archived' })
  , [handleUpdate])

  return { plans, loading, handleAdd, handleUpdate, handleDelete, handleArchive }
}
