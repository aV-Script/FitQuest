import { useState, useEffect } from 'react'
import FitQuest from './components/FitQuest'
import ClientView from './components/client/ClientView'
import LoginPage from './components/LoginPage'
import { onAuthChange, getUserProfile } from './firebase/services'

export default function App() {
  const [user,    setUser]    = useState(undefined)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    return onAuthChange(async (u) => {
      if (!u) { setUser(null); setProfile(null); return }
      setUser(u)
      const p = await getUserProfile(u.uid)
      setProfile(p)
    })
  }, [])

  if (user === undefined) return <LoadingScreen />
  if (!user)              return <LoginPage />

  if (profile?.role === 'client') {
    return (
      <ClientView
        clientId={profile.clientId}
        userId={user.uid}
        mustChangePassword={profile.mustChangePassword ?? false}
      />
    )
  }

  return <FitQuest user={user} />
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
      <div className="font-display text-white/30 tracking-[3px] text-[13px]">LOADING...</div>
    </div>
  )
}
