import { useState, useCallback } from 'react'
import { useClients } from '../../hooks/useClients'
import { LevelUpModal } from '../modals/LevelUpModal'
import { Pentagon } from '../ui/Pentagon'
import { Card, XPBar, Badge, SectionLabel } from '../ui'
import { RANK_COLORS, STATS } from '../../constants'

export function ClientDashboard({ client }) {
  const { handleProgressUpdate, deselectClient } = useClients()
  const [showLevelUp, setShowLevelUp] = useState(false)
  const color = RANK_COLORS[client.rank] ?? '#60a5fa'

  const handleLevelUp = useCallback(async (deltas, note) => {
    await handleProgressUpdate(client, deltas, note)
  }, [client, handleProgressUpdate])

  return (
    <div className="px-5 py-7 max-w-2xl mx-auto">

      {/* Back */}
      <button
        onClick={deselectClient}
        className="bg-transparent border-none text-white/40 font-body text-[14px] cursor-pointer mb-5 flex items-center gap-1.5 hover:text-white/70 transition-colors"
      >
        ‹ Torna alla lista
      </button>

      {/* TOP ROW */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <ClientInfoCard client={client} color={color} />
        <Card className="flex items-center justify-center">
          <Pentagon stats={client.stats} color={color} />
        </Card>
      </div>

      {/* CENTER */}
      <Card className="flex items-center gap-8 px-5 py-8 mb-4">
        <AvatarBlock client={client} color={color} />
        <StatsBlock client={client} color={color} />
      </Card>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <ActivityLog log={client.log} />
        <BadgeList badges={client.badges} />
      </div>

      {/* CTA */}
      <button
        onClick={() => setShowLevelUp(true)}
        className="w-full rounded-2xl py-[18px] text-white font-display text-[14px] font-bold tracking-widest cursor-pointer transition-opacity hover:opacity-90"
        style={{
          background: `linear-gradient(135deg, ${color}cc, ${color}44)`,
          border:     `1px solid ${color}66`,
          boxShadow:  `0 0 30px ${color}33`,
        }}
      >
        ⬆️ AGGIORNA PROGRESSO
      </button>

      {showLevelUp && (
        <LevelUpModal client={client} onClose={() => setShowLevelUp(false)} onLevelUp={handleLevelUp} />
      )}
    </div>
  )
}

function ClientInfoCard({ client, color }) {
  return (
    <Card>
      <div className="flex items-center gap-3.5">
        <span className="text-[40px]">{client.avatar}</span>
        <div className="flex-1">
          <div className="font-body font-bold text-[20px] text-white">{client.name}</div>
          <div className="flex gap-2 mt-1 flex-wrap">
            <Badge color={color}>LVL {client.level}</Badge>
            <span className="bg-white/[.06] text-white/60 rounded-full px-2.5 py-0.5 text-[11px] font-body">
              {client.rank}
            </span>
          </div>
          <XPBar xp={client.xp} xpNext={client.xpNext} color={color} />
        </div>
      </div>
    </Card>
  )
}

function AvatarBlock({ client, color }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[90px]">
      <div
        className="w-[90px] h-[90px] rounded-full bg-white/[.04] flex items-center justify-center text-[44px]"
        style={{ border: `3px solid ${color}`, boxShadow: `0 0 30px ${color}55` }}
      >
        {client.avatar}
      </div>
      <div className="text-center">
        <div className="text-[11px] text-white/40 font-body tracking-[2px]">RANK</div>
        <div className="font-display text-[15px] font-bold" style={{ color }}>{client.rank}</div>
      </div>
    </div>
  )
}

function StatsBlock({ client, color }) {
  return (
    <div className="flex-1">
      <SectionLabel>STATISTICHE</SectionLabel>
      {STATS.map(({ key, icon, label }) => (
        <div key={key} className="flex items-center gap-2.5 mb-2.5">
          <span className="w-4 text-[14px]">{icon}</span>
          <span className="w-[90px] text-white/50 font-body text-[13px]">{label}</span>
          <div className="flex-1 bg-white/[.06] rounded-full h-[5px]">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${client.stats[key]}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
            />
          </div>
          <span className="w-[30px] text-right font-display text-[11px]" style={{ color }}>
            {client.stats[key]}
          </span>
        </div>
      ))}
    </div>
  )
}

function ActivityLog({ log = [] }) {
  return (
    <Card>
      <SectionLabel>📋 Attività Recenti</SectionLabel>
      {log.slice(0, 4).map((entry, i) => (
        <div key={i} className="flex gap-2.5 items-start mb-2.5">
          <span className="text-white/20 font-body text-[11px] whitespace-nowrap mt-0.5">{entry.date}</span>
          <div>
            <div className="text-white/70 font-body text-[13px]">{entry.action}</div>
            <div className="text-emerald-300 font-display text-[10px]">+{entry.xp} XP</div>
          </div>
        </div>
      ))}
      {log.length === 0 && <p className="m-0 text-white/20 font-body text-[13px]">Nessuna attività ancora.</p>}
    </Card>
  )
}

function BadgeList({ badges = [] }) {
  return (
    <Card>
      <SectionLabel>🏅 Badge Conquistati</SectionLabel>
      {badges.map((b, i) => (
        <div key={i} className="bg-white/[.04] rounded-xl px-3 py-2 font-body text-[14px] text-white/80 mb-2">{b}</div>
      ))}
      {badges.length === 0 && <p className="m-0 text-white/20 font-body text-[13px]">Nessun badge ancora.</p>}
    </Card>
  )
}
