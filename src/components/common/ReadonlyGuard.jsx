import { useReadonly } from '../../context/ReadonlyContext'

/**
 * Nasconde i figli se readonly è true.
 * fallback: opzionale — cosa mostrare al posto dei figli.
 */
export function ReadonlyGuard({ children, fallback = null }) {
  const readonly = useReadonly()
  if (readonly) return fallback
  return children
}
