/**
 * Card singolo gruppo nella lista.
 * Mostra nome, numero clienti e avatar dei primi 3 clienti.
 */
export function GroupCard({ group, clients, onClick }) {
  const memberCount = group.clientIds?.length ?? 0
  const preview     = group.clientIds
    ?.slice(0, 3)
    .map(id => clients.find(c => c.id === id)?.name?.[0]?.toUpperCase())
    .filter(Boolean) ?? []

  return (
    <button
      onClick={onClick}
      className="w-full text-left"
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          14,
        padding:      '16px',
        background:   'var(--bg-surface)',
        border:       '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        cursor:       'pointer',
        transition:   'all var(--duration-fast)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-default)'
        e.currentTarget.style.background  = 'var(--bg-raised)'
        e.currentTarget.style.transform   = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-default)'
        e.currentTarget.style.background  = 'var(--bg-surface)'
        e.currentTarget.style.transform   = 'translateY(0)'
      }}
    >
      {/* Avatar gruppo */}
      <div
        style={{
          width:          48,
          height:         48,
          borderRadius:   'var(--radius-lg)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'rgba(14,196,82,0.08)',
          border:         '1px solid rgba(14,196,82,0.15)',
          flexShrink:     0,
          fontFamily:     'Montserrat, sans-serif',
          fontSize:       20,
          fontWeight:     900,
          color:          'var(--green-400)',
        }}
      >
        {group.name?.[0]?.toUpperCase() ?? '?'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily:   'Inter, sans-serif',
            fontSize:     14,
            fontWeight:   600,
            color:        'var(--text-primary)',
            marginBottom: 4,
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}
        >
          {group.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          {memberCount} {memberCount === 1 ? 'membro' : 'membri'}
        </div>
      </div>

      {/* Avatar stack */}
      {preview.length > 0 && (
        <div style={{ display: 'flex' }}>
          {preview.map((initial, i) => (
            <div
              key={i}
              style={{
                width:          24,
                height:         24,
                borderRadius:   '50%',
                background:     'var(--bg-overlay)',
                border:         '1.5px solid var(--bg-surface)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontFamily:     'Montserrat, sans-serif',
                fontSize:       9,
                fontWeight:     700,
                color:          'var(--text-secondary)',
                marginLeft:     i > 0 ? -6 : 0,
              }}
            >
              {initial}
            </div>
          ))}
        </div>
      )}

      {/* Chevron */}
      <span style={{ color: 'var(--text-tertiary)', fontSize: 16 }}>›</span>
    </button>
  )
}
