import { useState }       from 'react'
import { AdminDashboard } from './admin-pages/AdminDashboard'
import { OrgsPage }       from './admin-pages/OrgsPage'
import { logout }         from '../../firebase/services/auth'

const ADMIN_PAGES = {
  dashboard: AdminDashboard,
  orgs:      OrgsPage,
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'orgs',      label: 'Organizzazioni', icon: '🏢' },
]

export default function SuperAdminView() {
  const [page, setPage] = useState('dashboard')
  const PageComponent   = ADMIN_PAGES[page] ?? AdminDashboard

  return (
    <div className="flex h-screen text-white" style={{ background: '#07090e' }}>

      {/* Sidebar admin */}
      <aside
        className="w-56 shrink-0 flex flex-col p-4 gap-1"
        style={{ borderRight: '1px solid var(--border-subtle)' }}
      >
        <div className="px-2 py-4 mb-4">
          <div className="font-display font-black text-[14px]" style={{ color: '#0ec452' }}>
            RANKEX
          </div>
          <div className="font-display text-[9px] tracking-[2px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
            SUPER ADMIN
          </div>
        </div>

        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer border-none text-left transition-all"
            style={page === item.id
              ? { background: 'rgba(14,196,82,0.1)', color: '#0ec452' }
              : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }
            }
          >
            <span className="text-[14px]">{item.icon}</span>
            <span className="font-display text-[12px]">{item.label}</span>
          </button>
        ))}

        <div className="flex-1" />
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer border-none text-left"
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.25)' }}
        >
          <span className="text-[14px]">⬅</span>
          <span className="font-display text-[12px]">Logout</span>
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <PageComponent />
      </main>
    </div>
  )
}
