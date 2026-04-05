import { useEffect }           from 'react'
import { TrainerProvider, useTrainerDispatch, ACTIONS } from '../../context/TrainerContext'
import { ReadonlyProvider }    from '../../context/ReadonlyContext'
import { ReadonlyBanner }      from '../../components/common/ReadonlyBanner'
import { TrainerShell }        from '../../components/layout/TrainerShell'
import { ClientDashboard }     from '../client/ClientDashboard'
import { useTrainerNav }       from './useTrainerNav'
import { useClients }          from '../../hooks/useClients'
import { PAGES }               from './trainer.config'

export default function TrainerView({ profile, org, terminology, readonly = false, isOrgAdmin = false, onNavigateOrg }) {
  const orgId      = org?.id ?? profile?.orgId
  const moduleType = org?.moduleType ?? 'personal_training'
  const userRole   = profile?.role ?? null
  return (
    <ReadonlyProvider readonly={readonly}>
      <TrainerProvider>
        <TrainerLayout
          orgId={orgId}
          moduleType={moduleType}
          terminology={terminology}
          userRole={userRole}
          readonly={readonly}
          isOrgAdmin={isOrgAdmin}
          onNavigateOrg={onNavigateOrg}
        />
      </TrainerProvider>
    </ReadonlyProvider>
  )
}

function TrainerLayout({ orgId, moduleType, terminology, userRole, readonly, isOrgAdmin, onNavigateOrg }) {
  const dispatch = useTrainerDispatch()

  useEffect(() => {
    dispatch({
      type:    ACTIONS.SET_ORG_CONTEXT,
      payload: { orgId, moduleType, terminology, userRole },
    })
  }, [orgId, moduleType, userRole, dispatch])

  const { page, navParams, selectedClient, navigateTo, deselectClient } = useTrainerNav()
  const {
    clients, isLoading, fetchError,
    fetchClients,
    handleAddClient, handleCampionamento, handleDeleteClient,
  } = useClients(orgId)
  const CurrentPage = PAGES[page] ?? PAGES.clients

  return (
    <div className="flex flex-col h-screen">
      <ReadonlyBanner />
      <TrainerShell
        page={page}
        onNavigate={navigateTo}
        isOrgAdmin={isOrgAdmin}
        onNavigateOrg={onNavigateOrg}
      >
      <span id="main-content" tabIndex={-1} style={{ position: 'absolute', left: 0, top: 0 }} />
      {selectedClient ? (
        <ClientDashboard
          client={selectedClient}
          orgId={orgId}
          onBack={deselectClient}
          onCampionamento={handleCampionamento}
          onDelete={handleDeleteClient}
          readonly={readonly}
        />
      ) : (
        <CurrentPage
          orgId={orgId}
          clients={clients}
          clientsLoading={isLoading}
          clientsError={fetchError}
          onAddClient={handleAddClient}
          onRefreshClients={fetchClients}
          onNavigate={navigateTo}
          readonly={readonly}
          {...(navParams ?? {})}
        />
      )}
      </TrainerShell>
    </div>
  )
}
