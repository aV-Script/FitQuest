import { useState }       from 'react'
import { FiltersSidebar } from './FiltersSidebar'

/**
 * MobileControls — filtri e ordinamento su mobile.
 * Sheet che sale dal basso.
 */
export function MobileControls({
  filters,
  onChange,
  clientCount,
  filteredCount,
  sort,
  onSortChange,
}) {
  const [open, setOpen] = useState(false)
  const hasFilters      = Object.values(filters).some(Boolean)

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden"
        style={{
          display:       'flex',
          alignItems:    'center',
          gap:           6,
          padding:       '7px 12px',
          background:    hasFilters
            ? 'rgba(14,196,82,0.1)'
            : 'var(--bg-raised)',
          border:        `1px solid ${hasFilters
            ? 'rgba(14,196,82,0.3)'
            : 'var(--border-default)'}`,
          borderRadius:  'var(--radius-lg)',
          color:         hasFilters ? 'var(--green-400)' : 'var(--text-secondary)',
          fontFamily:    'Montserrat, sans-serif',
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: '0.06em',
          cursor:        'pointer',
          transition:    'all var(--duration-fast)',
          marginBottom:  16,
        }}
      >
        ⚙ FILTRI
        {hasFilters && (
          <span
            style={{
              background:     'var(--green-400)',
              color:          'var(--text-inverse)',
              borderRadius:   'var(--radius-full)',
              width:          16,
              height:         16,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       9,
              fontWeight:     900,
            }}
          >
            {Object.values(filters).filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Sheet mobile */}
      {open && (
        <>
          <div
            className="fixed inset-0"
            style={{ background: 'rgba(7,9,14,0.7)', zIndex: 300 }}
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 animate-slide-up"
            style={{
              background:   'var(--bg-overlay)',
              borderTop:    '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
              padding:      '8px 24px 32px',
              maxHeight:    '80vh',
              overflowY:    'auto',
              zIndex:       301,
              boxShadow:    'var(--shadow-xl)',
            }}
          >
            {/* Handle */}
            <div
              style={{
                width:        40,
                height:       4,
                background:   'var(--border-strong)',
                borderRadius: 99,
                margin:       '12px auto 20px',
              }}
            />

            <FiltersSidebar
              filters={filters}
              onChange={(newFilters) => { onChange(newFilters); setOpen(false) }}
              clientCount={clientCount}
              filteredCount={filteredCount}
            />
          </div>
        </>
      )}
    </>
  )
}
