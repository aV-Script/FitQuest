import { useState } from 'react'
import { ClientProvider, useClientState } from '../context/ClientContext'
import { TrainerShell }   from './layout/TrainerShell'
import { ClientDashboard } from './dashboard/ClientDashboard'
import { ClientsPage }     from './trainer/ClientsPage'
import { TrainerCalendar } from './trainer/TrainerCalendar'
import { TestGuidePage }   from './trainer/TestGuidePage'
import { ProfilePage }     from './trainer/ProfilePage'
import { useClients }      from '../hooks/useClients'

function FitQuestInner({ user }) {
  const { selectedClient }  = useClientState()
  const { clients }         = useClients(user.uid)
  const [page, setPage]     = useState('clients')

  // Se un cliente è selezionato mostra la sua dashboard (sovrasta la navigazione)
  if (selectedClient) {
    return <ClientDashboard client={selectedClient} trainerId={user.uid} />
  }

  return (
    <TrainerShell page={page} setPage={setPage}>
      {page === 'clients'  && <ClientsPage  trainerId={user.uid} />}
      {page === 'calendar' && <TrainerCalendar trainerId={user.uid} clients={clients} />}
      {page === 'guide'    && <TestGuidePage />}
      {page === 'profile'  && <ProfilePage user={user} />}
    </TrainerShell>
  )
}

export default function FitQuest({ user }) {
  return (
    <ClientProvider>
      <FitQuestInner user={user} />
    </ClientProvider>
  )
}
