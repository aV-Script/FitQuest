import { memo } from 'react'

/**
 * DashboardTabNav — navigazione a tab per il dashboard.
 * Ispirazione: Linear — tab compatti, indicatore bottom.
 */
export const DashboardTabNav = memo(function DashboardTabNav({
  tabs,
  activeTab,
  onChange,
}) {
  return (
    <div
      style={{
        display:        'flex',
        borderBottom:   '1px solid var(--border-subtle)',
        padding:        '0 24px',
        flexShrink:     0,
        overflowX:      'auto',
        scrollbarWidth: 'none',
      }}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              padding:       '12px 16px',
              background:    'transparent',
              border:        'none',
              borderBottom:  isActive
                ? '2px solid var(--green-400)'
                : '2px solid transparent',
              color:         isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      12,
              fontWeight:    isActive ? 700 : 500,
              letterSpacing: '0.05em',
              cursor:        'pointer',
              whiteSpace:    'nowrap',
              transition:    'all var(--duration-fast)',
              display:       'flex',
              alignItems:    'center',
              gap:           6,
              marginBottom:  -1,
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            {tab.icon && <span style={{ fontSize: 13 }}>{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span
                style={{
                  background:   isActive ? 'rgba(14,196,82,0.15)' : 'var(--bg-raised)',
                  border:       `1px solid ${isActive ? 'rgba(14,196,82,0.2)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-full)',
                  padding:      '1px 6px',
                  fontFamily:   'Montserrat, sans-serif',
                  fontSize:     9,
                  fontWeight:   700,
                  color:        isActive ? 'var(--green-400)' : 'var(--text-tertiary)',
                  lineHeight:   1.6,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
})
