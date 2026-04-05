import { useState, useEffect } from 'react'
import { getAllOrgs }           from '../../../firebase/services/org'

export function AdminDashboard() {
  const [orgs,    setOrgs]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllOrgs().then(setOrgs).finally(() => setLoading(false))
  }, [])

  const totalOrgs  = orgs.length
  const activeOrgs = orgs.filter(o => o.status !== 'suspended').length
  const soccerOrgs = orgs.filter(o => o.moduleType === 'soccer_academy').length
  const ptOrgs     = orgs.filter(o => o.moduleType === 'personal_training').length

  const stats = [
    { label: 'Organizzazioni totali', value: totalOrgs,  color: '#0ec452', icon: '🏢' },
    { label: 'Organizzazioni attive', value: activeOrgs, color: '#2ecfff', icon: '✅' },
    { label: 'Soccer Academy',        value: soccerOrgs, color: '#f59e0b', icon: '⚽' },
    { label: 'Personal Training',     value: ptOrgs,     color: '#a78bfa', icon: '🏋️' },
  ]

  return (
    <div className="px-8 py-8">
      <h1 className="font-display font-black text-[24px] text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="rounded-2xl p-5"
            style={{ background: stat.color + '08', border: `1px solid ${stat.color}22` }}
          >
            <div className="text-[24px] mb-2">{stat.icon}</div>
            <div className="font-display font-black text-[32px] leading-none" style={{ color: stat.color }}>
              {loading ? '—' : stat.value}
            </div>
            <div className="font-body text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-[14px] text-white/50 tracking-[2px] mb-4">
          ORGANIZZAZIONI RECENTI
        </h2>
        <div className="flex flex-col gap-3">
          {orgs.slice(0, 5).map(org => (
            <OrgRow key={org.id} org={org} />
          ))}
        </div>
      </div>
    </div>
  )
}

function OrgRow({ org }) {
  const moduleColor = org.moduleType === 'soccer_academy' ? '#0ec452' : '#60a5fa'
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: moduleColor + '18' }}>
          <span className="font-display text-[11px]" style={{ color: moduleColor }}>
            {org.name?.[0]?.toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-body text-[13px] text-white/80">{org.name}</div>
          <div className="font-body text-[11px] text-white/30">
            {org.moduleType} · creata {org.createdAt?.slice(0, 10)}
          </div>
        </div>
      </div>
      <span
        className="font-display text-[10px] px-2 py-0.5 rounded"
        style={{ background: moduleColor + '18', color: moduleColor }}
      >
        {org.moduleType === 'soccer_academy' ? 'SOCCER' : 'PT'}
      </span>
    </div>
  )
}
