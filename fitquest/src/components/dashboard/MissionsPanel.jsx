import { useState } from 'react'
import { Card, SectionLabel } from '../ui'
import { MissionModal } from '../modals/MissionModal'
import { MISSION_STATUS } from '../../constants/missions'

export function MissionsPanel({ client, color, onAddMission, onCompleteMission, customTemplates }) {
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('active')

  const missions  = client.missions ?? []
  const active    = missions.filter(m => m.status === MISSION_STATUS.ACTIVE)
  const completed = missions.filter(m => m.status === MISSION_STATUS.COMPLETED)

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>🎯 Missioni</SectionLabel>
        <button onClick={() => setShowModal(true)}
          className="text-[11px] font-display px-3 py-1.5 rounded-lg cursor-pointer border transition-all"
          style={{ color, borderColor: color + '55', background: color + '11' }}
          onMouseEnter={e => e.currentTarget.style.background = color + '22'}
          onMouseLeave={e => e.currentTarget.style.background = color + '11'}>
          + NUOVA
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[['active', `Attive (${active.length})`], ['history', `Completate (${completed.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 py-1.5 rounded-lg font-display text-[11px] border cursor-pointer transition-all
              ${activeTab === key ? 'text-white border-white/20 bg-white/[.07]' : 'text-white/30 border-transparent bg-transparent hover:text-white/50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Active */}
      {activeTab === 'active' && (
        <div className="flex flex-col gap-2">
          {active.length === 0 && (
            <p className="text-white/20 font-body text-[13px] text-center py-4">Nessuna missione attiva.</p>
          )}
          {active.map(m => (
            <MissionCard key={m.id} mission={m} color={color} onComplete={() => onCompleteMission(m.id)} />
          ))}
        </div>
      )}

      {/* Completed history */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-2">
          {completed.length === 0 && (
            <p className="text-white/20 font-body text-[13px] text-center py-4">Nessuna missione completata ancora.</p>
          )}
          {completed.map(m => (
            <MissionCompletedCard key={m.id} mission={m} />
          ))}
        </div>
      )}

      {showModal && (
        <MissionModal
          onClose={() => setShowModal(false)}
          onAdd={onAddMission}
          customTemplates={customTemplates}
        />
      )}
    </Card>
  )
}

function MissionCard({ mission, color, onComplete }) {
  return (
    <div className="bg-white/[.03] border border-white/[.07] rounded-xl p-3.5">
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="flex-1">
          <div className="font-body font-bold text-[14px] text-white">{mission.name}</div>
          {mission.description && (
            <div className="text-white/40 font-body text-[12px] mt-0.5">{mission.description}</div>
          )}
        </div>
        <span className="font-display text-[12px] text-yellow-400 whitespace-nowrap shrink-0">⭐ {mission.xp} XP</span>
      </div>
      <button onClick={onComplete}
        className="w-full py-1.5 rounded-lg font-display text-[11px] cursor-pointer border transition-all"
        style={{ color, borderColor: color + '55', background: color + '11' }}
        onMouseEnter={e => e.currentTarget.style.background = color + '22'}
        onMouseLeave={e => e.currentTarget.style.background = color + '11'}>
        ✓ COMPLETA
      </button>
    </div>
  )
}

function MissionCompletedCard({ mission }) {
  return (
    <div className="rounded-xl p-3 border border-emerald-400/20 bg-emerald-400/5">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-body text-[13px] text-white/70">{mission.name}</div>
          <div className="text-white/20 font-body text-[11px] mt-0.5">✓ Completata · {mission.updatedAt}</div>
        </div>
        <span className="font-display text-[11px] text-emerald-400">+{mission.xp} XP</span>
      </div>
    </div>
  )
}
