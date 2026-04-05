import { useState }         from 'react'
import TrainerView          from '../trainer/TrainerView'
import { MembersPage }      from './org-pages/MembersPage'
import { OrgSettingsPage }  from './org-pages/OrgSettingsPage'
import { TrainerShell }     from '../../components/layout/TrainerShell'
import { logout }           from '../../firebase/services/auth'

/**
 * OrgAdminView — entry point per org_admin.
 * Estende TrainerView aggiungendo la gestione del team e le impostazioni org.
 */
export default function OrgAdminView({ profile, org, terminology }) {
  const [orgPage, setOrgPage] = useState(null) // null = trainer area, 'members' | 'settings'

  if (orgPage === 'members') {
    return (
      <TrainerShell
        page="members"
        onNavigate={(p) => {
          if (p === 'members' || p === 'settings') setOrgPage(p)
          else setOrgPage(null)
        }}
        isOrgAdmin
        onNavigateOrg={setOrgPage}
      >
        <MembersPage orgId={org.id} />
      </TrainerShell>
    )
  }

  if (orgPage === 'settings') {
    return (
      <TrainerShell
        page="settings"
        onNavigate={(p) => {
          if (p === 'members' || p === 'settings') setOrgPage(p)
          else setOrgPage(null)
        }}
        isOrgAdmin
        onNavigateOrg={setOrgPage}
      >
        <OrgSettingsPage org={org} />
      </TrainerShell>
    )
  }

  return (
    <TrainerView
      profile={profile}
      org={org}
      terminology={terminology}
      isOrgAdmin
      onNavigateOrg={setOrgPage}
    />
  )
}
