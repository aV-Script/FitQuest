import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, SectionLabel } from '../ui'
import { STATS } from '../../constants'

export function StatsChart({ campionamenti, color }) {
  const [selectedStat, setSelectedStat] = useState('forza')
  const [navIndex, setNavIndex]         = useState(0) // per radar navigation

  if (!campionamenti || campionamenti.length < 2) {
    return (
      <Card>
        <SectionLabel>📈 Andamento</SectionLabel>
        <p className="text-white/20 font-body text-[13px] text-center py-4">
          Servono almeno 2 campionamenti per visualizzare l'andamento.
        </p>
      </Card>
    )
  }

  // Dati ordinati dal più vecchio al più recente per il grafico
  const chartData = [...campionamenti].reverse().map((c, i) => ({
    name:  c.date,
    value: c.stats?.[selectedStat] ?? 0,
    media: c.media ?? 0,
    index: i,
  }))

  // Navigazione campionamenti per confronto
  const sorted     = [...campionamenti]  // già dal più recente
  const totalNav   = sorted.length
  const currentCamp = sorted[navIndex]
  const prevCamp    = sorted[navIndex + 1]

  const stat = STATS.find(s => s.key === selectedStat)

  return (
    <Card>
      <SectionLabel>📈 Andamento Statistiche</SectionLabel>

      {/* Stat selector */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {STATS.map(s => (
          <button key={s.key} onClick={() => setSelectedStat(s.key)}
            className={`px-3 py-1 rounded-lg font-display text-[11px] border cursor-pointer transition-all
              ${selectedStat === s.key
                ? 'text-white border-transparent'
                : 'text-white/30 border-white/10 hover:text-white/50 bg-transparent'}`}
            style={selectedStat === s.key ? { background: color + '33', borderColor: color + '55', color } : {}}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Line chart */}
      <div className="h-40 mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Rajdhani' }} />
            <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: '#111827', border: `1px solid ${color}44`, borderRadius: 10, fontFamily: 'Rajdhani' }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              itemStyle={{ color }}
              formatter={(v) => [v, stat?.label]}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2}
              dot={{ fill: color, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: color }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campionamento navigator */}
      <div className="border-t border-white/[.06] pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-display text-[11px] text-white/30 tracking-[2px]">CONFRONTO CAMPIONAMENTI</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setNavIndex(i => Math.min(i + 1, totalNav - 2))}
              disabled={navIndex >= totalNav - 2}
              className="w-7 h-7 rounded-lg bg-white/[.05] border border-white/10 text-white/40 font-display text-[12px] cursor-pointer hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              ‹
            </button>
            <span className="font-body text-[11px] text-white/30">{navIndex + 1} / {totalNav}</span>
            <button onClick={() => setNavIndex(i => Math.max(i - 1, 0))}
              disabled={navIndex <= 0}
              className="w-7 h-7 rounded-lg bg-white/[.05] border border-white/10 text-white/40 font-display text-[12px] cursor-pointer hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              ›
            </button>
          </div>
        </div>

        {/* Stats comparison table */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-1.5">
          <div className="text-white/20 font-display text-[10px] tracking-wider"></div>
          <div className="text-white/30 font-display text-[10px] text-right">{prevCamp?.date ?? '—'}</div>
          <div className="font-display text-[10px] text-right" style={{ color }}>{currentCamp?.date}</div>

          {STATS.map(s => {
            const curr  = currentCamp?.stats?.[s.key] ?? 0
            const prev  = prevCamp?.stats?.[s.key] ?? 0
            const delta = curr - prev
            const deltaColor = delta > 0 ? '#6ee7b7' : delta < 0 ? '#f87171' : 'rgba(255,255,255,0.2)'
            return (
              <>
                <div key={s.key + 'l'} className="font-body text-[12px] text-white/50 flex items-center gap-1.5">
                  {s.icon} {s.label}
                </div>
                <div key={s.key + 'p'} className="font-display text-[12px] text-white/30 text-right">{prevCamp ? prev : '—'}</div>
                <div key={s.key + 'c'} className="font-display text-[12px] text-right flex items-center justify-end gap-1" style={{ color }}>
                  {curr}
                  {prevCamp && delta !== 0 && (
                    <span className="text-[10px]" style={{ color: deltaColor }}>
                      {delta > 0 ? `▲${delta}` : `▼${Math.abs(delta)}`}
                    </span>
                  )}
                </div>
              </>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
