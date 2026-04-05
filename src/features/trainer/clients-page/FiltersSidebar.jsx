import { SectionLabel } from '../../../components/ui'
import { CATEGORIE }    from '../../../constants'
import { RANKS }        from '../../../constants'

/**
 * FiltersSidebar — filtri laterali nella lista clienti.
 *
 * Ispirazione: Linear sidebar filters — compatta,
 * con indicatori visivi chiari per i filtri attivi.
 */
export function FiltersSidebar({
  filters,
  onChange,
  clientCount,
  filteredCount,
}) {
  const hasFilters = filters.categoria || filters.rank ||
                     filters.profileType

  return (
    <aside
      style={{
        width:         240,
        flexShrink:    0,
        display:       'flex',
        flexDirection: 'column',
        gap:           24,
        padding:       '0 0 24px',
        position:      'sticky',
        top:           24,
        height:        'fit-content',
      }}
    >
      {/* Header filtri */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SectionLabel style={{ margin: 0 }}>FILTRI</SectionLabel>
        {hasFilters && (
          <button
            onClick={() => onChange({ categoria: null, rank: null, profileType: null })}
            style={{
              background:    'transparent',
              border:        'none',
              color:         'var(--text-tertiary)',
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor:        'pointer',
              padding:       '3px 6px',
              borderRadius:  'var(--radius-sm)',
              transition:    'all var(--duration-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color      = '#f05252'
              e.currentTarget.style.background = 'rgba(240,82,82,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color      = 'var(--text-tertiary)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            RESET
          </button>
        )}
      </div>

      {/* Conteggio risultati */}
      <div
        style={{
          padding:      '12px 14px',
          background:   'var(--bg-raised)',
          border:       '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          display:      'flex',
          alignItems:   'center',
          gap:          8,
        }}
      >
        <span
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      20,
            fontWeight:    900,
            color:         filteredCount < clientCount
              ? 'var(--green-400)'
              : 'var(--text-primary)',
            lineHeight:    1,
            letterSpacing: '-0.02em',
          }}
        >
          {filteredCount}
        </span>
        <span
          style={{
            fontSize:   12,
            color:      'var(--text-tertiary)',
            lineHeight: 1.3,
          }}
        >
          {filteredCount === 1 ? 'cliente' : 'clienti'}
          {filteredCount < clientCount && (
            <span style={{ display: 'block', fontSize: 10, marginTop: 1 }}>
              su {clientCount} totali
            </span>
          )}
        </span>
      </div>

      {/* Filtro categoria */}
      <FilterGroup label="Categoria">
        {[null, ...CATEGORIE.filter(c => !c.hidden)].map(cat => {
          const isActive = filters.categoria === (cat?.id ?? null)
          return (
            <FilterChip
              key={cat?.id ?? 'all'}
              label={cat?.label ?? 'Tutte'}
              active={isActive}
              color={cat?.color}
              onClick={() => onChange({
                ...filters,
                categoria: isActive ? null : (cat?.id ?? null),
              })}
            />
          )
        })}
      </FilterGroup>

      {/* Filtro profilo */}
      <FilterGroup label="Profilo">
        {[
          { id: null,          label: 'Tutti' },
          { id: 'tests_only',  label: 'Solo test' },
          { id: 'bia_only',    label: 'Solo BIA' },
          { id: 'complete',    label: 'Completo' },
        ].map(opt => {
          const isActive = filters.profileType === opt.id
          return (
            <FilterChip
              key={opt.id ?? 'all'}
              label={opt.label}
              active={isActive}
              onClick={() => onChange({
                ...filters,
                profileType: isActive ? null : opt.id,
              })}
            />
          )
        })}
      </FilterGroup>

      {/* Filtro rank */}
      <FilterGroup label="Rank">
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap:                 4,
          }}
        >
          {RANKS.slice(0, 8).map(rank => {
            const isActive = filters.rank === rank.label
            return (
              <button
                key={rank.label}
                onClick={() => onChange({
                  ...filters,
                  rank: isActive ? null : rank.label,
                })}
                style={{
                  padding:       '5px 4px',
                  background:    isActive ? rank.color + '18' : 'transparent',
                  border:        `1px solid ${isActive ? rank.color + '44' : 'var(--border-subtle)'}`,
                  borderRadius:  'var(--radius-sm)',
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      9,
                  fontWeight:    900,
                  color:         isActive ? rank.color : 'var(--text-tertiary)',
                  cursor:        'pointer',
                  transition:    'all var(--duration-fast)',
                  lineHeight:    1,
                  letterSpacing: '0.03em',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = rank.color + '33'
                    e.currentTarget.style.color       = rank.color + 'aa'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    e.currentTarget.style.color       = 'var(--text-tertiary)'
                  }
                }}
              >
                {rank.label}
              </button>
            )
          })}
        </div>
      </FilterGroup>
    </aside>
  )
}

// ── Componenti locali ─────────────────────────────────────────

function FilterGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SectionLabel>{label}</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {children}
      </div>
    </div>
  )
}

function FilterChip({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:      '7px 10px',
        background:   active
          ? (color ? color + '12' : 'rgba(14,196,82,0.1)')
          : 'transparent',
        border:       `1px solid ${active
          ? (color ? color + '30' : 'rgba(14,196,82,0.3)')
          : 'transparent'}`,
        borderRadius: 'var(--radius-md)',
        fontFamily:   'Inter, sans-serif',
        fontSize:     12,
        fontWeight:   active ? 600 : 400,
        color:        active
          ? (color ?? 'var(--green-400)')
          : 'var(--text-secondary)',
        cursor:       'pointer',
        textAlign:    'left',
        transition:   'all var(--duration-fast)',
        display:      'flex',
        alignItems:   'center',
        gap:          6,
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          e.currentTarget.style.color      = 'var(--text-primary)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color      = 'var(--text-secondary)'
        }
      }}
    >
      {active && (
        <span style={{ color: color ?? 'var(--green-400)', fontSize: 10 }}>✓</span>
      )}
      {label}
    </button>
  )
}
