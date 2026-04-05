import { useTrainerState }                        from '../context/TrainerContext'
import { hasPermission, hasAnyPermission }         from '../config/permissions.config'

/**
 * Hook per verificare i permessi dell'utente corrente.
 *
 * Legge userRole da TrainerContext (impostato al login in SET_ORG_CONTEXT).
 *
 * @example
 * const { can, canAny } = usePermissions()
 *
 * // bottone visibile solo se può creare clienti
 * {can('clients.create') && <button>NUOVO CLIENTE</button>}
 *
 * // sezione visibile se può leggere clienti o i propri dati
 * {canAny(['clients.view', 'clients.viewOwn']) && <ClientSection />}
 */
export function usePermissions() {
  const { userRole } = useTrainerState()

  return {
    role: userRole,

    /** true se il ruolo ha il permesso richiesto */
    can: (permission) => hasPermission(userRole, permission),

    /** true se il ruolo ha almeno uno dei permessi */
    canAny: (permissions) => hasAnyPermission(userRole, permissions),

    /** true se è super_admin */
    isSuperAdmin: userRole === 'super_admin',

    /** true se è org_admin o super_admin */
    isAdmin: userRole === 'org_admin' || userRole === 'super_admin',

    /** true se è staff in sola lettura */
    isReadonly: userRole === 'staff_readonly',

    /** true se è client */
    isClient: userRole === 'client',
  }
}
