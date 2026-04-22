import { useMemo } from 'react'
import { ALL_TESTS, getRankFromMedia } from '../../../constants/index'

function heatColor(val) {
  if (val == null) return { bg: 'transparent', text: 'rgba(255,255,255,0.15)' }
  if (val >= 67)   return { bg: 'rgba(15,214,90,0.15)',   text: '#0fd65a' }
  if (val >= 34)   return { bg: 'rgba(250,204,21,0.12)',  text: '#facc15' }
  return               { bg: 'rgba(248,113,113,0.13)', text: '#f87171' }
}

export function GroupAnalysis({ clients }) {
  // ── Più migliorati ──────────────────────────────────────────────────────────
  const improved = useMemo(() => {
    return clients
      .map(c => {
        const camps = c.campionamenti ?? []
        if (camps.length < 2) return {
          client: c,
          improved: null, stable: null, regressed: null,
          isFirst: camps.length === 1, noData: camps.length === 0,
        }
        const latest  = camps[0].stats ?? {}
        const prev    = camps[1].stats ?? {}
        const allKeys = new Set([...Object.keys(latest), ...Object.keys(prev)])
        let imp = 0, sta = 0, reg = 0
        allKeys.forEach(k => {
          const n = latest[k] ?? 0
          const p = prev[k]   ?? 0
          if (n > p) imp++; else if (n < p) reg++; else sta++
        })
        return { client: c, improved: imp, stable: sta, regressed: reg, isFirst: false, noData: false }
      })
      .sort((a, b) => {
        if (a.noData && !b.noData) return 1
        if (!a.noData && b.noData) return -1
        if (a.isFirst && !b.isFirst) return 1
        if (!a.isFirst && b.isFirst) return -1
        return (b.improved ?? 0) - (a.improved ?? 0)
      })
  }, [clients])

  // ── Heatmap ─────────────────────────────────────────────────────────────────
  const { statCols, heatRows, averageRow } = useMemo(() => {
    const statKeys = new Set()
    clients.forEach(c => Object.keys(c.stats ?? {}).forEach(k => statKeys.add(k)))
    const statCols = Array.from(statKeys).map(key => ({
      key,
      label: ALL_TESTS.find(t => t.stat === key)?.label ?? key,
    }))
    const sorted   = [...clients].sort((a, b) => a.name.localeCompare(b.name))
    const heatRows = sorted.map(c => ({ client: c, vals: statCols.map(col => c.stats?.[col.key] ?? null) }))
    const averageRow = statCols.map(col => {
      const vals = clients.map(c => c.stats?.[col.key]).filter(v => v != null)
      return vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : null
    })
    return { statCols, heatRows, averageRow }
  }, [clients])

  // ── Riepilogo ────────────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const withLevel = clients.filter(c => c.level != null)
    const avgLevel  = withLevel.length
      ? Math.round(withLevel.reduce((s, c) => s + c.level, 0) / withLevel.length)
      : null

    const rankCount = {}
    clients.forEach(c => { if (c.rank) rankCount[c.rank] = (rankCount[c.rank] ?? 0) + 1 })
    const topRankLabel = Object.entries(rankCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

    const statAverages = {}
    const statCounts   = {}
    clients.forEach(c => Object.entries(c.stats ?? {}).forEach(([k, v]) => {
      statAverages[k] = (statAverages[k] ?? 0) + v
      statCounts[k]   = (statCounts[k]   ?? 0) + 1
    }))
    const statMeans = Object.entries(statAverages).map(([k, sum]) => ({
      key: k, label: ALL_TESTS.find(t => t.stat === k)?.label ?? k, mean: sum / statCounts[k],
    }))
    const best  = statMeans.reduce((top, s) => s.mean > (top?.mean ?? -Infinity) ? s : top, null)
    const worst = statMeans.reduce((bot, s) => s.mean < (bot?.mean ??  Infinity) ? s : bot, null)
    return { avgLevel, topRankLabel, best, worst }
  }, [clients])

  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="font-body text-white/20 text-[14px]">Nessun atleta nel gruppo.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start">

      {/* ── Colonna sinistra: Riepilogo + Più migliorati ── */}
      <div className="flex flex-col gap-4 w-full lg:w-[42%]">

        {/* Riepilogo */}
        <div className="rounded-[4px] p-5 rx-card">
          <div className="font-display text-[10px] tracking-[3px] uppercase mb-5" style={{ color: '#0fd65a' }}>◈ Riepilogo gruppo</div>
          <div className="grid grid-cols-2 gap-2">
            <StatTile label="ATLETI"      value={clients.length}             />
            {summary.avgLevel    != null && <StatTile label="LV. MEDIO"     value={`Lv.${summary.avgLevel}`}     />}
            {summary.topRankLabel         && <StatTile label="RANK COMUNE"  value={summary.topRankLabel}         gold />}
            {summary.best                 && <StatTile label="STAT FORTE"   value={summary.best.label}   sub={`${Math.round(summary.best.mean)}°`}  positive />}
            {summary.worst                && <StatTile label="STAT DEBOLE"  value={summary.worst.label}  sub={`${Math.round(summary.worst.mean)}°`} negative />}
          </div>
        </div>

        {/* Più migliorati */}
        <div className="rounded-[4px] p-5 rx-card">
          <div className="font-display text-[10px] tracking-[3px] uppercase mb-5" style={{ color: '#0fd65a' }}>◈ Più migliorati</div>
          <div
            className="rounded-[3px] p-4 flex flex-col gap-2"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            {improved.map(({ client, improved: imp, stable: sta, regressed: reg, isFirst, noData }) => (
              <ImprovementRow
                key={client.id}
                client={client}
                improved={imp} stable={sta} regressed={reg}
                isFirst={isFirst} noData={noData}
              />
            ))}
          </div>
        </div>

      </div>

      {/* ── Colonna destra: Heatmap ── */}
      <div className="w-full lg:w-[58%]">
      {statCols.length > 0 && (
        <div className="rounded-[4px] p-5 rx-card">
          <div className="font-display text-[10px] tracking-[3px] uppercase mb-5" style={{ color: '#0fd65a' }}>◈ Heatmap gruppo</div>
          <div
            className="rounded-[3px] p-4 overflow-x-auto"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <table style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: statCols.length * 72 + 140 }}>
              <thead>
                <tr>
                  <th className="text-left pb-3 pr-3" style={{ minWidth: 130 }}>
                    <span className="font-display text-[9px] tracking-[1px] text-white/20">ATLETA</span>
                  </th>
                  {statCols.map(col => (
                    <th key={col.key} className="pb-3 px-1 text-center" style={{ minWidth: 64 }}>
                      <span className="font-display text-[9px] tracking-[1px] text-white/20 uppercase">{col.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatRows.map(({ client, vals }) => (
                  <tr key={client.id}>
                    <td className="pr-3 py-1" style={{ minWidth: 130 }}>
                      <span className="font-body text-[12px] text-white/65 truncate block max-w-[120px]">{client.name}</span>
                    </td>
                    {vals.map((val, ci) => {
                      const { bg, text } = heatColor(val)
                      return (
                        <td key={ci} className="px-1 py-1 text-center">
                          <div
                            className="rounded-[3px] font-display font-black text-[12px] leading-none py-1.5"
                            style={{ background: bg, color: text, minWidth: 48 }}
                          >
                            {val != null ? Math.round(val) : '—'}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
                {/* Riga media */}
                <tr>
                  <td className="pr-3 pt-4">
                    <span className="font-display text-[9px] tracking-[1.5px] text-white/25">MEDIA</span>
                  </td>
                  {averageRow.map((val, ci) => {
                    const { bg, text } = heatColor(val)
                    return (
                      <td key={ci} className="px-1 pt-4 text-center">
                        <div
                          className="rounded-[3px] font-display font-black text-[12px] leading-none py-1.5"
                          style={{
                            background: val != null ? bg : 'transparent',
                            color: val != null ? text : 'rgba(255,255,255,0.15)',
                            border: val != null ? `1px solid ${text}33` : 'none',
                            minWidth: 48,
                          }}
                        >
                          {val != null ? val : '—'}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>{/* fine colonna destra */}

    </div>
  )
}

// ── Componenti locali ──────────────────────────────────────────────────────────

function StatTile({ label, value, sub, gold, positive, negative }) {
  const color = gold ? '#ffd700' : positive ? '#0fd65a' : negative ? '#f87171' : 'rgba(255,255,255,0.75)'
  const bg    = gold ? 'rgba(255,215,0,0.06)' : positive ? 'rgba(15,214,90,0.06)' : negative ? 'rgba(248,113,113,0.06)' : 'rgba(255,255,255,0.03)'
  const bd    = gold ? 'rgba(255,215,0,0.18)' : positive ? 'rgba(15,214,90,0.18)' : negative ? 'rgba(248,113,113,0.18)' : 'rgba(255,255,255,0.06)'

  return (
    <div className="px-3 py-3 rounded-[3px] flex flex-col gap-1.5" style={{ background: bg, border: `1px solid ${bd}` }}>
      <span className="font-display text-[9px] tracking-[1.5px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{label}</span>
      <span className="font-display font-black text-[15px] leading-tight truncate" style={{ color }}>{value}</span>
      {sub && <span className="font-display text-[11px]" style={{ color: color + 'aa' }}>{sub}</span>}
    </div>
  )
}

function ImprovementRow({ client, improved, stable, regressed, isFirst, noData }) {
  const rankObj = client.media != null ? getRankFromMedia(client.media) : null

  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/[.04] last:border-0">
      <div
        className="w-8 h-8 rounded-[3px] flex items-center justify-center shrink-0"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="font-display text-[11px] font-bold text-white/35">
          {client.name?.[0]?.toUpperCase()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-body text-[13px] text-white/75 truncate">{client.name}</div>
        {rankObj && (
          <div className="font-display text-[10px] mt-0.5" style={{ color: rankObj.color }}>
            {rankObj.label} · Lv.{client.level}
          </div>
        )}
      </div>

      <div className="shrink-0">
        {noData  && <span className="font-display text-[11px] text-white/20">Nessun dato</span>}
        {isFirst && <span className="font-display text-[11px] text-white/30">Primo camp.</span>}
        {!noData && !isFirst && (
          <div className="flex items-center gap-2">
            <Delta value={improved}  color="#0fd65a" symbol="↑" />
            <Delta value={stable}    color="rgba(255,255,255,0.25)" symbol="=" />
            <Delta value={regressed} color="#f87171" symbol="↓" />
          </div>
        )}
      </div>
    </div>
  )
}

function Delta({ value, color, symbol }) {
  return (
    <div className="flex items-center gap-0.5">
      <span className="font-display font-black text-[14px] leading-none" style={{ color }}>{value}</span>
      <span className="font-display text-[11px]" style={{ color }}>{symbol}</span>
    </div>
  )
}
