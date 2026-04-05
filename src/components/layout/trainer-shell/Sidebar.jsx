import { SidebarIcon } from './SidebarIcon'
import { NAV_ITEMS, ORG_ADMIN_NAV_ITEMS, LogoutIcon } from './navItems.config'

export function Sidebar({ page, onNavigate, onLogout, isOrgAdmin, onNavigateOrg }) {
  const handleNav = (id) => {
    if (isOrgAdmin && (id === 'members' || id === 'settings')) {
      onNavigateOrg?.(id)
    } else {
      onNavigate(id)
    }
  }

  const allItems = isOrgAdmin ? [...NAV_ITEMS, ...ORG_ADMIN_NAV_ITEMS] : NAV_ITEMS

  return (
    <aside
      className="hidden lg:flex flex-col items-center"
      style={{
        width:       64,
        flexShrink:  0,
        padding:     '24px 8px',
        gap:         4,
        borderRight: '1px solid var(--border-subtle)',
        background:  'var(--bg-subtle)',
        height:      '100vh',
        position:    'sticky',
        top:         0,
        zIndex:      30,
      }}
      aria-label="Navigazione principale"
    >
      {/* Logo */}
      <div style={{ marginBottom: 16 }}>
        <span
          className="rx-glow-text"
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      14,
            fontWeight:    900,
            lineHeight:    1,
            letterSpacing: '0.05em',
          }}
        >
          RX
        </span>
      </div>

      {/* Voci nav */}
      <nav
        style={{
          flex:          1,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           4,
          width:         '100%',
        }}
      >
        {allItems.map(item => (
          <SidebarIcon
            key={item.id}
            item={item}
            active={page === item.id}
            onClick={() => handleNav(item.id)}
          />
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        aria-label="Logout"
        style={{
          width:          40,
          height:         40,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'transparent',
          border:         '1px solid transparent',
          borderRadius:   'var(--radius-sm)',
          color:          'var(--text-tertiary)',
          cursor:         'pointer',
          transition:     'all var(--duration-fast)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background  = 'rgba(240,82,82,0.08)'
          e.currentTarget.style.borderColor = 'rgba(240,82,82,0.2)'
          e.currentTarget.style.color       = '#f05252'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background  = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
          e.currentTarget.style.color       = 'var(--text-tertiary)'
        }}
      >
        {LogoutIcon}
      </button>
    </aside>
  )
}