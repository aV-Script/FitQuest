import { ClientProvider, useClientState } from '../context/ClientContext'
import { TrainerArea } from './trainer/TrainerArea'
import { ClientDashboard } from './dashboard/ClientDashboard'
import { tokens } from './ui'

// ─── Inner ────────────────────────────────────────────────────────────────────
// Separato dal Provider per poter leggere il context
function FitQuestInner({ user }) {
  const { selectedClient } = useClientState()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #070b14; }
        input[type=range] { height: 4px; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 20% 0%, #0f1f3d 0%, #070b14 60%)', color: '#fff' }}>
        {/* Navbar */}
        <nav style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: tokens.fontDisplay, fontWeight: 900, fontSize: 18, background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FIT<span style={{ fontWeight: 400 }}>QUEST</span>
          </span>
        </nav>

        {/* Views */}
        {selectedClient
          ? <ClientDashboard client={selectedClient} />
          : <TrainerArea trainerId={user.uid} />
        }
      </div>
    </>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function FitQuest({ user }) {
  return (
    <ClientProvider>
      <FitQuestInner user={user} />
    </ClientProvider>
  )
}
