import { useEffect }   from 'react'
import { createPortal } from 'react-dom'
import { ALL_TESTS, getRankFromMedia } from '../../../constants/index'

export function GroupReportPrint({ group, clients, onClose }) {
  const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })

  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'rankex-print-style'
    style.textContent = `
      @media print {
        body > *:not(#rankex-print-root) { display: none !important; }
        #rankex-print-root {
          position: static !important;
          display: block !important;
          width: 100% !important;
          overflow: visible !important;
        }
        #rankex-print-controls { display: none !important; }
      }
    `
    document.head.appendChild(style)
    const timer = setTimeout(() => window.print(), 350)
    window.addEventListener('afterprint', onClose)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('afterprint', onClose)
      document.getElementById('rankex-print-style')?.remove()
    }
  }, [onClose])

  const sorted = [...clients]
    .filter(c => c.media != null)
    .sort((a, b) => (b.media ?? 0) - (a.media ?? 0))
  const noData = clients.filter(c => c.media == null)

  const statKeys = new Set()
  clients.forEach(c => Object.keys(c.stats ?? {}).forEach(k => statKeys.add(k)))
  const statCols = Array.from(statKeys).map(key => ({
    key,
    label: ALL_TESTS.find(t => t.stat === key)?.label ?? key,
  }))

  const champions = statCols.map(col => {
    const withData = clients.filter(c => c.stats?.[col.key] != null)
    if (!withData.length) return null
    const max     = Math.max(...withData.map(c => c.stats[col.key]))
    const winners = withData.filter(c => c.stats[col.key] === max)
    return { label: col.label, max, winners }
  }).filter(Boolean)

  const avgMedia = sorted.length
    ? Math.round(sorted.reduce((s, c) => s + c.media, 0) / sorted.length)
    : null

  return createPortal(
    <div id="rankex-print-root" style={{ background: '#fff', position: 'fixed', inset: 0, zIndex: 9999, overflow: 'auto' }}>

      {/* Barra controlli — nascosta in stampa via CSS iniettato */}
      <div id="rankex-print-controls" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: 3, color: '#94a3b8', fontWeight: 700 }}>
          ANTEPRIMA PDF — REPORT GRUPPO
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => window.print()}
            style={{ background: '#0ec452', color: '#fff', border: 'none', borderRadius: 3, padding: '7px 18px', fontSize: 11, fontWeight: 700, fontFamily: 'Montserrat, sans-serif', letterSpacing: 1, cursor: 'pointer' }}
          >
            STAMPA / SALVA PDF
          </button>
          <button
            onClick={onClose}
            style={{ background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: 3, padding: '7px 14px', fontSize: 15, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Documento */}
      <div style={{ maxWidth: 780, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

        {/* Testata */}
        <div style={{ padding: '24px 40px 20px', borderBottom: '2px solid #0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 24, letterSpacing: 5, color: '#0f172a', lineHeight: 1 }}>
              RANK<span style={{ color: '#0ec452' }}>EX</span>
            </div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: '#94a3b8', marginTop: 5, fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              PERFORMANCE PLATFORM
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
              Report Gruppo
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{today}</div>
          </div>
        </div>

        {/* Corpo */}
        <div style={{ padding: '32px 40px 48px' }}>

          {/* Hero gruppo */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 36 }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 900, fontFamily: 'Montserrat, sans-serif', color: '#0f172a', lineHeight: 1, marginBottom: 10 }}>
                {group.name}
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                {clients.length} {clients.length === 1 ? 'atleta' : 'atleti'}
              </div>
            </div>
            {/* Stat pillole */}
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <StatPill label="ATLETI"     value={clients.length} />
              {avgMedia != null && <StatPill label="MEDIA GRUPPO" value={`${avgMedia}°`} green />}
              {champions.length > 0 && <StatPill label="DISCIPLINE" value={champions.length} />}
            </div>
          </div>

          {/* Classifica */}
          {sorted.length > 0 && (
            <PrintSection title="Classifica">
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <Th style={{ width: 28 }}>#</Th>
                    <Th>Atleta</Th>
                    <Th right>Rank</Th>
                    <Th right>Lv.</Th>
                    <Th right>Media</Th>
                    {statCols.map(col => <Th key={col.key} right>{col.label}</Th>)}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((client, i) => {
                    const rankObj = getRankFromMedia(client.media)
                    const podium  = i === 0 ? '#b45309' : i === 1 ? '#6b7280' : i === 2 ? '#92400e' : null
                    return (
                      <tr key={client.id} style={{ background: i === 0 ? '#fffbeb' : i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                        <Td bold color={podium ?? '#cbd5e1'}>{i + 1}</Td>
                        <Td bold>{client.name}</Td>
                        <Td right bold color={rankObj?.color}>{rankObj?.label ?? '—'}</Td>
                        <Td right>{client.level ?? '—'}</Td>
                        <Td right bold>{Math.round(client.media)}°</Td>
                        {statCols.map(col => (
                          <Td key={col.key} right>
                            {client.stats?.[col.key] != null ? `${Math.round(client.stats[col.key])}°` : '—'}
                          </Td>
                        ))}
                      </tr>
                    )
                  })}
                  {noData.map(client => (
                    <tr key={client.id} style={{ background: '#f8fafc' }}>
                      <Td color="#cbd5e1">—</Td>
                      <Td color="#94a3b8">{client.name}</Td>
                      <Td right color="#cbd5e1">—</Td>
                      <Td right color="#94a3b8">{client.level ?? '—'}</Td>
                      <Td right color="#cbd5e1">N/D</Td>
                      {statCols.map(col => <Td key={col.key} right color="#cbd5e1">—</Td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </PrintSection>
          )}

          {/* Campioni per disciplina */}
          {champions.length > 0 && (
            <PrintSection title="Campioni per disciplina">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                {champions.map(({ label, max, winners }) => (
                  <div key={label} style={{ border: '1px solid #fde68a', borderRadius: 4, padding: '12px 14px', background: '#fffbeb' }}>
                    <div style={{ fontSize: 9, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#92400e', marginBottom: 6 }}>
                      🥇 {label}
                    </div>
                    {winners.map(w => (
                      <div key={w.id} style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', lineHeight: 1.3 }}>{w.name}</div>
                    ))}
                    <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Montserrat, sans-serif', color: '#b45309', marginTop: 6, lineHeight: 1 }}>
                      {Math.round(max)}°
                    </div>
                  </div>
                ))}
              </div>
            </PrintSection>
          )}

          {/* Footer */}
          <div style={{ marginTop: 48, paddingTop: 14, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'Montserrat, sans-serif', letterSpacing: 1, fontWeight: 600 }}>
              GENERATO DA RANKEX PLATFORM
            </span>
            <span style={{ fontSize: 9, color: '#94a3b8' }}>{today}</span>
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Componenti locali ─────────────────────────────────────────────────────────

function PrintSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: '#0ec452', flexShrink: 0 }} />
        <span style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 800, color: '#475569', fontFamily: 'Montserrat, sans-serif' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

function StatPill({ label, value, green }) {
  return (
    <div style={{ textAlign: 'center', background: green ? '#0ec45212' : '#f8fafc', border: `1px solid ${green ? '#0ec45244' : '#e2e8f0'}`, borderRadius: 4, padding: '8px 14px', minWidth: 64 }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: green ? '#0ec452' : '#94a3b8', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 900, fontFamily: 'Montserrat, sans-serif', color: green ? '#0ec452' : '#0f172a', lineHeight: 1 }}>
        {value}
      </div>
    </div>
  )
}

function Th({ children, right, style: extraStyle }) {
  return (
    <th style={{ textAlign: right ? 'right' : 'left', padding: '8px 6px', color: '#64748b', fontWeight: 700, fontSize: 10, letterSpacing: 1, fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', ...extraStyle }}>
      {children}
    </th>
  )
}

function Td({ children, right, bold, color }) {
  return (
    <td style={{ textAlign: right ? 'right' : 'left', padding: '7px 6px', color: color ?? (bold ? '#0f172a' : '#475569'), fontWeight: bold ? 700 : 400, borderBottom: '1px solid #f1f5f9' }}>
      {children}
    </td>
  )
}
