import { useState, useEffect } from 'react'
import { onAuthChange }        from '../../firebase/services/auth'
import { getUserProfile }      from '../../firebase/services/users'
import { getOrg }              from '../../firebase/services/org'
import { getTerminology }      from '../../config/modules.config'

/**
 * Hook auth aggiornato.
 * Carica user + profile + org + terminology in sequenza.
 */
export function useAuth() {
  const [user,        setUser]        = useState(undefined)
  const [profile,     setProfile]     = useState(undefined)
  const [org,         setOrg]         = useState(null)
  const [terminology, setTerminology] = useState(null)
  const [loading,     setLoading]     = useState(true)

  const refreshProfile = async (uid) => {
    const p = await getUserProfile(uid)
    setProfile(p)
    if (p?.orgId) {
      const orgData = await getOrg(p.orgId)
      setOrg(orgData)
      setTerminology(getTerminology(
        p.terminologyVariant ?? orgData?.terminologyVariant ?? 'personal_training'
      ))
    }
  }

  useEffect(() => {
    return onAuthChange(async (u) => {
      if (!u) {
        setUser(null)
        setProfile(null)
        setOrg(null)
        setTerminology(null)
        setLoading(false)
        return
      }

      setUser(u)
      setProfile(undefined)

      try {
        const prof = await getUserProfile(u.uid)
        setProfile(prof)

        if (prof?.orgId) {
          const orgData = await getOrg(prof.orgId)
          setOrg(orgData)
          setTerminology(getTerminology(
            prof.terminologyVariant ?? orgData?.terminologyVariant ?? 'personal_training'
          ))
        }
      } catch (err) {
        console.error('Auth profile load error:', err)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  return { user, profile, org, terminology, loading, refreshProfile }
}
