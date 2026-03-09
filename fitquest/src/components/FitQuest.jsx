import { ClientProvider, useClientState } from '../context/ClientContext'
import { TrainerArea } from './trainer/TrainerArea'
import { ClientDashboard } from './dashboard/ClientDashboard'

function FitQuestInner({ user }) {
  const { selectedClient } = useClientState()

  return (
    <div className="min-h-screen text-white" style={{ background: 'radial-gradient(ellipse at 20% 0%, #0f1f3d 0%, #070b14 60%)' }}>
      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-white/[.05] flex items-center">
        <span className="font-display font-black text-[18px] bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          FIT<span className="font-normal">QUEST</span>
        </span>
      </nav>

      {selectedClient
        ? <ClientDashboard client={selectedClient} />
        : <TrainerArea trainerId={user.uid} />
      }
    </div>
  )
}

export default function FitQuest({ user }) {
  return (
    <ClientProvider>
      <FitQuestInner user={user} />
    </ClientProvider>
  )
}
