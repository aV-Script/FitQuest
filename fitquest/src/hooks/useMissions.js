import { useEffect, useState, useCallback } from 'react'
import { getMissions, addMission, updateMission, deleteMission, saveTemplate, getCustomTemplates, updateClient } from '../firebase/services'
import { MISSION_STATUS } from '../constants/missions'
import { buildXPUpdate } from '../utils/gamification'

export function useMissions(client, trainerId, onClientUpdate) {
  const [missions,        setMissions]        = useState([])
  const [customTemplates, setCustomTemplates] = useState([])
  const [loading,         setLoading]         = useState(false)

  useEffect(() => {
    if (!client?.id) return
    setLoading(true)
    Promise.all([getMissions(client.id), getCustomTemplates(trainerId)])
      .then(([m, t]) => { setMissions(m); setCustomTemplates(t) })
      .finally(() => setLoading(false))
  }, [client?.id, trainerId])

  const handleAddMission = useCallback(async ({ name, description, xp, saveAsTemplate }) => {
    const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
    const data  = { clientId: client.id, name, description, xp, status: MISSION_STATUS.ACTIVE, createdAt: today }
    const ref   = await addMission(data)
    setMissions(prev => [...prev, { id: ref.id, ...data }])
    if (saveAsTemplate) {
      const tRef = await saveTemplate(trainerId, { name, description, xp })
      setCustomTemplates(prev => [...prev, { id: tRef.id, name, description, xp }])
    }
  }, [client?.id, trainerId])

  const handleCompleteMission = useCallback(async (missionId) => {
    const mission = missions.find(m => m.id === missionId)
    if (!mission) return
    const today  = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
    const update = { status: MISSION_STATUS.COMPLETED, updatedAt: today }
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, ...update } : m))
    await updateMission(missionId, update)
    const { update: clientUpdate } = buildXPUpdate(client, mission.xp, `Missione completata: ${mission.name}`)
    onClientUpdate(clientUpdate)
    await updateClient(client.id, clientUpdate)
  }, [missions, client, onClientUpdate])

  const handleDeleteMission = useCallback(async (missionId) => {
    // Rimuove ottimisticamente dalla lista locale, poi cancella su Firebase
    setMissions(prev => prev.filter(m => m.id !== missionId))
    try {
      await deleteMission(missionId)
    } catch {
      // In caso di errore, ricarica da Firebase
      getMissions(client.id).then(setMissions)
    }
  }, [client?.id])

  return { missions, customTemplates, loading, handleAddMission, handleCompleteMission, handleDeleteMission }
}
