import { useState, useEffect } from 'react'
import { getClientById }       from '../../firebase/services/clients'

export function useClient(orgId, clientId) {
  const [client,  setClient]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!orgId || !clientId) return
    setLoading(true)
    setError(null)
    getClientById(orgId, clientId)
      .then(setClient)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [orgId, clientId])

  return { client, loading, error }
}
