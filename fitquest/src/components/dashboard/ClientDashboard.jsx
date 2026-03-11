import { useState, useCallback } from 'react'
import { useClients } from '../../hooks/useClients'
import { useMissions } from '../../hooks/useMissions'
import { CampionamentoModal } from '../modals/CampionamentoModal'
import { AddXPModal } from '../modals/AddXPModal'
import { MissionsPanel } from './MissionsPanel'
import { StatsChart } from './StatsChart'
import { Pentagon } from '../ui/Pentagon'
import { Card, XPBar, SectionLabel } from '../ui'
import { STATS } from '../../constants'
import { calcStatMedia } from '../../utils/percentile'
import { getRankFromMedia } from '../../constants'

export function ClientDashboard({ client, trainerId }) {
  const { handleCampionamento, handleAddXP, deselectClient, updateLocalClient } = useClients()
  const [showCampionamento, setShowCampionamento] = useState(false)
  const [showAddXP,         setShowAddXP]         = useState(false)

  const media   = calcStatMedia(client.stats ?? {})
  const rankObj = getRankFromMedia(media)
  const color   = client.rankColor ?? rankObj.color

  const { missions, customTemplates, handleAddMission, handleCompleteMission } =
    useMissions(client, trainerId, updateLocalClient)

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <button onClick={deselectClient}
        className="bg-transparent border-none text-white/40 font-body text-[14px] cursor-pointer mb-5 flex items-center gap-1.5 hover:text-white/70 transition-colors">
        ‹ Torna alla lista
      </button>

      {/* DESKTOP: 3 colonne | MOBILE: 1 colonna */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── COLONNA 1: Profilo + Avatar/Rank ── */}
        <div className="flex flex-col gap-4">
          <ClientInfoCard client={client} color={color} rankObj={rankObj} />
          <Card className="flex items-center gap-6 px-5 py-6">
            <RankBlock rankObj={rankObj} color={color} />
            <StatsBlock client={client} color={color} />
          </Card>
        </div>

        {/* ── COLONNA 2: Pentagon + Andamento ── */}
        <div className="flex flex-col gap-4">
          <Card className="flex items-center justify-center py-6">
            <Pentagon stats={client.stats} color={color} size={200} />
          </Card>
          <StatsChart campionamenti={client.campionamenti} color={color} />
        </div>

        {/* ── COLONNA 3: Missioni + Log + Badge ── */}
        <div className="flex flex-col gap-4">
          <MissionsPanel
            client={{ ...client, missions }}
            color={color}
            onAddMission={handleAddMission}
            onCompleteMission={handleCompleteMission}
            
            customTemplates={customTemplates}
          />
          <ActivityLog log={client.log} />
          <BadgeList badges={client.badges} />
        </div>
      </div>

      {/* CTA — full width sotto le colonne */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={() => setShowCampionamento(true)}
          className="rounded-2xl py-4 text-white font-display text-[13px] font-bold cursor-pointer tracking-widest transition-opacity hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${color}cc, ${color}44)`, border: `1px solid ${color}66`, boxShadow: `0 0 30px ${color}22` }}>
          📊 NUOVO CAMPIONAMENTO
        </button>
        <button onClick={() => setShowAddXP(true)}
          className="rounded-2xl py-4 text-white font-display text-[13px] font-bold cursor-pointer tracking-widest transition-opacity hover:opacity-90 bg-white/[.04] border border-white/10">
          ⭐ AGGIUNGI XP
        </button>
      </div>

      {showCampionamento && (
        <CampionamentoModal client={client} onClose={() => setShowCampionamento(false)}
          onSave={async (s, t, n) => { await handleCampionamento(client, s, t, n) }} />
      )}
      {showAddXP && (
        <AddXPModal client={client} onClose={() => setShowAddXP(false)}
          onSave={async (xp, n) => { await handleAddXP(client, xp, n) }} />
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ClientInfoCard({ client, color, rankObj }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center justify-center rounded-2xl w-14 h-14 shrink-0"
          style={{ background: color + '22', border: `2px solid ${color}55` }}>
          <span className="font-display font-black text-[18px] leading-none" style={{ color }}>{rankObj.label}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-body font-bold text-[20px] text-white truncate">{client.name}</div>
          <div className="flex gap-2 mt-1 flex-wrap items-center">
            <span className="rounded-full px-2.5 py-0.5 text-[11px] font-display" style={{ background: color + '22', color }}>
              LVL {client.level}
            </span>
            {client.categoria && (
              <span className="text-white/30 text-[11px] font-body border border-white/10 rounded-full px-2 py-0.5">
                {client.categoria}
              </span>
            )}
          </div>
          <div className="flex gap-3 mt-1 text-[11px] text-white/30 font-body flex-wrap">
            {client.eta   && <span>🎂 {client.eta} anni</span>}
            {client.peso  && <span>⚖️ {client.peso} kg</span>}
            {client.sesso && <span>{client.sesso === 'M' ? '♂' : '♀'}</span>}
          </div>
          <XPBar xp={client.xp} xpNext={client.xpNext} color={color} />
        </div>
      </div>
    </Card>
  )
}

function RankBlock({ rankObj, color }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
      <div className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ border: `3px solid ${color}`, background: color + '11', boxShadow: `0 0 24px ${color}44` }}>
        <span className="font-display font-black text-[28px]" style={{ color }}>{rankObj.label}</span>
      </div>
      <div className="text-center">
        <div className="text-[10px] text-white/40 font-body tracking-[2px]">RANK</div>
      </div>
    </div>
  )
}

function StatsBlock({ client, color }) {
  return (
    <div className="flex-1">
      <SectionLabel>STATISTICHE</SectionLabel>
      {STATS.map(({ key, icon, label }) => {
        const val = client.stats?.[key] ?? 0
        return (
          <div key={key} className="flex items-center gap-2 mb-2">
            <span className="w-4 text-[13px]">{icon}</span>
            <span className="w-20 text-white/50 font-body text-[12px]">{label}</span>
            <div className="flex-1 bg-white/[.06] rounded-full h-[5px]">
              <div className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${val}%`, background: color }} />
            </div>
            <span className="w-7 text-right font-display text-[11px]" style={{ color }}>{val}</span>
          </div>
        )
      })}
    </div>
  )
}

function ActivityLog({ log = [] }) {
  return (
    <Card>
      <SectionLabel>📋 Attività Recenti</SectionLabel>
      {log.slice(0, 5).map((entry, i) => (
        <div key={i} className="flex gap-2.5 items-start mb-2">
          <span className="text-white/20 font-body text-[11px] whitespace-nowrap mt-0.5">{entry.date}</span>
          <div>
            <div className="text-white/70 font-body text-[13px]">{entry.action}</div>
            {entry.xp > 0 && <div className="text-emerald-300 font-display text-[10px]">+{entry.xp} XP</div>}
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
      <div className="flex flex-wrap gap-2">
        {badges.map((b, i) => (
          <span key={i} className="bg-white/[.04] rounded-lg px-3 py-1.5 font-body text-[13px] text-white/70">{b}</span>
        ))}
        {badges.length === 0 && <p className="m-0 text-white/20 font-body text-[13px]">Nessun badge ancora.</p>}
      </div>
    </Card>
  )
}
