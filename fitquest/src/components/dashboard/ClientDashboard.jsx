import { useState, useCallback } from 'react'
import { useClients } from '../../hooks/useClients'
import { LevelUpModal } from '../modals/LevelUpModal'
import { Pentagon } from '../ui/Pentagon'
import { Card, XPBar, Badge, SectionLabel, tokens } from '../ui'
import { RANK_COLORS, STATS } from '../../constants'

export function ClientDashboard({ client }) {
  const { handleProgressUpdate, deselectClient } = useClients()
  const [showLevelUp, setShowLevelUp] = useState(false)

  const color = RANK_COLORS[client.rank] ?? '#60a5fa'

  const handleLevelUp = useCallback(async (deltas, note) => {
    await handleProgressUpdate(client, deltas, note)
    // UI aggiornata automaticamente via context (optimistic update)
  }, [client, handleProgressUpdate])

  return (
    <div style={{ padding: '28px 20px', maxWidth: 700, margin: '0 auto' }}>
      {/* Back */}
      <button
        onClick={deselectClient}
        style={{ background: 'none', border: 'none', color: tokens.muted, fontFamily: tokens.fontBody, fontSize: 14, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}
      >
        ‹ Torna alla lista
      </button>

      {/* TOP ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <ClientInfoCard client={client} color={color} />
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Pentagon stats={client.stats} color={color} />
        </Card>
      </div>

      {/* CENTER */}
      <Card style={{ display: 'flex', alignItems: 'center', padding: '32px 20px', marginBottom: 16, gap: 32 }}>
        <AvatarBlock client={client} color={color} />
        <StatsBlock client={client} color={color} />
      </Card>

      {/* BOTTOM ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <ActivityLog log={client.log} />
        <BadgeList badges={client.badges} />
      </div>

      {/* CTA */}
      <button
        onClick={() => setShowLevelUp(true)}
        style={{ width: '100%', background: `linear-gradient(135deg, ${color}cc, ${color}44)`, border: `1px solid ${color}66`, borderRadius: 16, padding: 18, color: '#fff', fontFamily: tokens.fontDisplay, fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: 2, boxShadow: `0 0 30px ${color}33` }}
      >
        ⬆️ AGGIORNA PROGRESSO
      </button>

      {showLevelUp && (
        <LevelUpModal
          client={client}
          onClose={() => setShowLevelUp(false)}
          onLevelUp={handleLevelUp}
        />
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ClientInfoCard({ client, color }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 40 }}>{client.avatar}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: tokens.fontBody, fontWeight: 700, fontSize: 20, color: '#fff' }}>
            {client.name}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <Badge color={color}>LVL {client.level}</Badge>
            <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', borderRadius: 99, padding: '2px 10px', fontSize: 11, fontFamily: tokens.fontBody }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 90 }}>
      <div style={{ width: 90, height: 90, borderRadius: '50%', border: `3px solid ${color}`, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, boxShadow: `0 0 30px ${color}55` }}>
        {client.avatar}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: tokens.fontBody, letterSpacing: 2 }}>RANK</div>
        <div style={{ color, fontFamily: tokens.fontDisplay, fontSize: 15, fontWeight: 700 }}>{client.rank}</div>
      </div>
    </div>
  )
}

function StatsBlock({ client, color }) {
  return (
    <div style={{ flex: 1 }}>
      <SectionLabel>STATISTICHE</SectionLabel>
      {STATS.map(({ key, icon, label }) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ width: 16, fontSize: 14 }}>{icon}</span>
          <span style={{ width: 90, color: 'rgba(255,255,255,0.5)', fontFamily: tokens.fontBody, fontSize: 13 }}>
            {label}
          </span>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 5 }}>
            <div style={{ width: `${client.stats[key]}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ width: 30, textAlign: 'right', fontFamily: tokens.fontDisplay, fontSize: 11, color }}>
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
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontFamily: tokens.fontBody, fontSize: 11, whiteSpace: 'nowrap', marginTop: 1 }}>
            {entry.date}
          </span>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: tokens.fontBody, fontSize: 13 }}>
              {entry.action}
            </div>
            <div style={{ color: '#6ee7b7', fontFamily: tokens.fontDisplay, fontSize: 10 }}>
              +{entry.xp} XP
            </div>
          </div>
        </div>
      ))}
      {log.length === 0 && (
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.2)', fontFamily: tokens.fontBody, fontSize: 13 }}>
          Nessuna attività ancora.
        </p>
      )}
    </Card>
  )
}

function BadgeList({ badges = [] }) {
  return (
    <Card>
      <SectionLabel>🏅 Badge Conquistati</SectionLabel>
      {badges.map((b, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 12px', fontFamily: tokens.fontBody, fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
          {b}
        </div>
      ))}
      {badges.length === 0 && (
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.2)', fontFamily: tokens.fontBody, fontSize: 13 }}>
          Nessun badge ancora.
        </p>
      )}
    </Card>
  )
}
