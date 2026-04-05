import { useState }                from 'react'
import { login }                   from '../../firebase/services/auth'
import { getFirebaseErrorMessage } from '../../utils/firebaseErrors'

export function useLoginForm() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleLogin = async ({ email, password }) => {
    setLoading(true)
    setError('')
    try {
      await login(email.trim(), password)
      // il redirect avviene nel router tramite onAuthChange
    } catch (err) {
      setError(getFirebaseErrorMessage(err, 'Credenziali non valide'))
    } finally {
      setLoading(false)
    }
  }

  return { handleLogin, loading, error }
}
