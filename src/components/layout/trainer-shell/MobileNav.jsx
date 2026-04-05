import { TabItem }                                from './TabItem'
import { NAV_ITEMS, ORG_ADMIN_NAV_ITEMS, LogoutIcon } from './navItems.config'

export function MobileNav({ page, onNavigate, onLogout, isOrgAdmin, onNavigateOrg }) {
  const handleNav = (id) => {
    if (isOrgAdmin && (id === 'members' || id === 'settings')) {
      onNavigateOrg?.(id)
    } else {
      onNavigate(id)
    }
  }
  const allItems = isOrgAdmin ? [...NAV_ITEMS, ...ORG_ADMIN_NAV_ITEMS] : NAV_ITEMS
  return (
    <div className="lg:hidden" style={{ flexShrink: 0 }}>

      {/* Header */}
      <header
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 20px',
          height:         52,
          borderBottom:   '1px solid var(--border-subtle)',
          background:     'var(--bg-subtle)',
          position:       'sticky',
          top:            0,
          zIndex:         30,
        }}
        aria-label="Header mobile"
      >
        <span
          className="rx-glow-text"
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      17,
            fontWeight:    900,
            lineHeight:    1,
            letterSpacing: '-0.02em',
          }}
        >
          RankEX
        </span>

        <button
          onClick={onLogout}
          aria-label="Logout"
          style={{
            background:  'transparent',
            border:      'none',
            cursor:      'pointer',
            color:       'var(--text-tertiary)',
            transition:  'color var(--duration-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-secondary)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
        >
          {LogoutIcon}
        </button>
      </header>

      {/* Tab bar */}
      <nav
        style={{
          display:     'flex',
          borderBottom: '1px solid var(--border-subtle)',
          position:    'sticky',
          top:         52,
          zIndex:      20,
          background:  'var(--bg-subtle)',
        }}
        aria-label="Navigazione mobile"
      >
        {allItems.map(item => (
          <TabItem
            key={item.id}
            item={item}
            active={page === item.id}
            onClick={() => handleNav(item.id)}
          />
        ))}
      </nav>

    </div>
  )
}