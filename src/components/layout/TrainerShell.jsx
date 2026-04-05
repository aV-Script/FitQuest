import { logout }    from '../../firebase/services/auth'
import { Sidebar }   from './trainer-shell/Sidebar'
import { MobileNav } from './trainer-shell/MobileNav'

/**
 * Shell principale dell'area trainer.
 * Compone sidebar desktop e navigazione mobile.
 * È l'unico posto che conosce `logout` — lo passa ai figli come prop.
 *
 * Props:
 *   page       — pagina attiva ('clients' | 'calendar' | 'guide' | 'profile')
 *   onNavigate — callback chiamato al cambio pagina
 *   children   — contenuto della pagina corrente
 */
export function TrainerShell({ page, onNavigate, children, isOrgAdmin = false, onNavigateOrg }) {
  return (
    <div
      style={{
        display:    'flex',
        height:     '100vh',
        overflow:   'hidden',
        background: 'var(--bg-base)',
        color:      'var(--text-primary)',
      }}
    >
      <Sidebar
        page={page}
        onNavigate={onNavigate}
        onLogout={logout}
        isOrgAdmin={isOrgAdmin}
        onNavigateOrg={onNavigateOrg}
      />

      <div
        style={{
          flex:          1,
          display:       'flex',
          flexDirection: 'column',
          overflow:      'hidden',
          minWidth:      0,
        }}
      >
        <MobileNav
          page={page}
          onNavigate={onNavigate}
          onLogout={logout}
          isOrgAdmin={isOrgAdmin}
          onNavigateOrg={onNavigateOrg}
        />

        <main
          style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}
          aria-label="Contenuto principale"
        >
          {children}
        </main>
      </div>
    </div>
  )
}