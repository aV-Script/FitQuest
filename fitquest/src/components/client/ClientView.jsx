import { useState, useEffect } from 'react'
import { getClientById, getNotifications, markAllNotificationsRead, getMissions, logout } from '../../firebase/services'
import { Pentagon } from '../ui/Pentagon'
import { Card, XPBar, SectionLabel } from '../ui'
import { StatsChart } from '../dashboard/StatsChart'
import { STATS } from '../../constants'
import { calcStatMedia } from '../../utils/percentile'
import { getRankFromMedia } from '../../constants'
import { MISSION_STATUS } from '../../constants/missions'
import ChangePasswordScreen from './ChangePasswordScreen'

export default function ClientView({ clientId, userId, mustChangePassword }) {
  const [client,        setClient]        = useState(null)
  const [notifications, setNotifications] = useState([])
  const [missions,      setMissions]      = useState([])
  const [showNotifs,    setShowNotifs]    = useState(false)
  const [loading,       setLoading]       = useState(true)
  const [pwChanged,     setPwChanged]     = useState(false)

  useEffect(() => {
    Promise.all([getClientById(clientId), getNotifications(clientId), getMissions(clientId)])
      .then(([c, n, m]) => { setClient(c); setNotifications(n); setMissions(m) })
      .finally(() => setLoading(false))
  }, [clientId])

  const handleOpenNotifs = async () => {
    setShowNotifs(true)
    const unread = notifications.filter(n => !n.read)
    if (unread.length > 0) {
      await markAllNotificationsRead(clientId)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

  // Mostra schermata cambio password forzato
  if (mustChangePassword && !pwChanged) {
    return <ChangePasswordScreen userId={userId} onDone={() => setPwChanged(true)} />
  }

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
      <div className="font-display text-white/30 tracking-[3px] text-[13px]">CARICAMENTO...</div>
    </div>
  )
  if (!client) return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
      <div className="font-display text-white/30 text-[13px]">Profilo non trovato.</div>
    </div>
  )

  const media          = calcStatMedia(client.stats ?? {})
  const rankObj        = getRankFromMedia(media)
  const color          = client.rankColor ?? rankObj.color
  const unreadCount    = notifications.filter(n => !n.read).length
  const activeMissions = missions.filter(m => m.status === MISSION_STATUS.ACTIVE)

  return (
    <div className="min-h-screen text-white" style={{ background: 'radial-gradient(ellipse at 20% 0%, #0f1f3d 0%, #070b14 60%)' }}>
      <nav className="px-6 py-4 border-b border-white/[.05] flex items-center justify-between">
        <span className="font-display font-black text-[18px] bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          FIT<span className="font-normal">QUEST</span>
        </span>
        <div className="flex items-center gap-3">
          <button onClick={handleOpenNotifs}
            className="relative bg-transparent border border-white/10 rounded-xl px-3 py-2 text-white/40 font-body text-[13px] cursor-pointer hover:text-white/70 transition-all">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full font-display text-[10px] flex items-center justify-center text-white"
                style={{ background: color }}>
                {unreadCount}
              </span>
            )}
          </button>
          <button onClick={logout}
            className="bg-transparent border border-white/10 rounded-xl px-4 py-2 text-white/40 font-body text-[13px] cursor-pointer hover:text-white/60 transition-all">
            Logout
          </button>
        </div>
      </nav>

      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4">
            <ClientInfoCard client={client} color={color} rankObj={rankObj} />
            <Card className="flex items-center gap-6 px-5 py-6">
              <RankBlock rankObj={rankObj} color={color} />
              <StatsBlock client={client} color={color} />
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <Card className="flex items-center justify-center py-6">
              <Pentagon stats={client.stats} color={color} size={200} />
            </Card>
            <StatsChart campionamenti={client.campionamenti} color={color} />
          </div>
          <div className="flex flex-col gap-4">
            <MissionsReadOnly missions={activeMissions} color={color} />
            <BadgeList badges={client.badges} />
          </div>
        </div>
      </div>

      {showNotifs && (
        <NotificationsPanel notifications={notifications} color={color} onClose={() => setShowNotifs(false)} />
      )}
    </div>
  )
}

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
              <span className="text-white/30 text-[11px] font-body border border-white/10 rounded-full px-2 py-0.5">{client.categoria}</span>
            )}
          </div>
          <div className="flex gap-3 mt-1 text-[11px] text-white/30 font-body flex-wrap">
            {client.eta  && <span>🎂 {client.eta} anni</span>}
            {client.peso && <span>⚖️ {client.peso} kg</span>}
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
      <div className="text-[10px] text-white/40 font-body tracking-[2px]">RANK</div>
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
              <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${val}%`, background: color }} />
            </div>
            <span className="w-7 text-right font-display text-[11px]" style={{ color }}>{val}</span>
          </div>
        )
      })}
    </div>
  )
}

function MissionsReadOnly({ missions, color }) {
  return (
    <Card>
      <SectionLabel>🎯 Missioni Attive</SectionLabel>
      {missions.length === 0 && <p className="text-white/20 font-body text-[13px] text-center py-4">Nessuna missione attiva.</p>}
      {missions.map(m => (
        <div key={m.id} className="bg-white/[.03] border border-white/[.07] rounded-xl p-3.5 mb-2">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="font-body font-bold text-[14px] text-white">{m.name}</div>
              {m.description && <div className="text-white/40 font-body text-[12px] mt-0.5">{m.description}</div>}
            </div>
            <span className="font-display text-[12px] text-yellow-400 whitespace-nowrap shrink-0">⭐ {m.xp} XP</span>
          </div>
          <div className="mt-2 text-[11px] font-body text-white/20">Il tuo trainer completerà questa missione per te</div>
        </div>
      ))}
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

function NotificationsPanel({ notifications, color, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-sm bg-gray-900 border-l border-white/10 h-full overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-white text-[15px] m-0">🔔 Notifiche</h3>
          <button onClick={onClose} className="bg-transparent border-none text-white/40 text-xl cursor-pointer hover:text-white/70">✕</button>
        </div>
        {notifications.length === 0 && <p className="text-white/20 font-body text-[13px] text-center py-8">Nessuna notifica.</p>}
        {notifications.map(n => (
          <div key={n.id}
            className={`rounded-xl p-3.5 mb-2 border transition-all ${n.read ? 'border-white/[.05] bg-white/[.02]' : 'border-white/10 bg-white/[.05]'}`}>
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className={`font-body text-[13px] ${n.read ? 'text-white/50' : 'text-white'}`}>{n.message}</div>
                <div className="text-white/20 font-body text-[11px] mt-1">{n.date}</div>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: color }} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
