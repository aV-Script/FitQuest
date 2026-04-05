/**
 * Matrice dei permessi per ruolo.
 *
 * Ruoli: super_admin | org_admin | trainer | staff_readonly | client
 *
 * Convenzione:
 *   'action'     → chi può eseguire questa azione su dati altrui
 *   'action.own' → chi può eseguire questa azione solo sui propri dati
 */

// ── Permessi ──────────────────────────────────────────────────
export const PERMISSIONS = {

  // Clienti / Allievi
  'clients.view':            ['super_admin', 'org_admin', 'trainer', 'staff_readonly'],
  'clients.viewOwn':         ['client'],
  'clients.create':          ['super_admin', 'org_admin', 'trainer'],
  'clients.edit':            ['super_admin', 'org_admin', 'trainer'],
  'clients.delete':          ['super_admin', 'org_admin', 'trainer'],

  // Campionamento / Test
  'campionamento.view':      ['super_admin', 'org_admin', 'trainer', 'staff_readonly'],
  'campionamento.viewOwn':   ['client'],
  'campionamento.create':    ['super_admin', 'org_admin', 'trainer'],
  'campionamento.delete':    ['super_admin', 'org_admin', 'trainer'],

  // BIA
  'bia.view':                ['super_admin', 'org_admin', 'trainer', 'staff_readonly'],
  'bia.viewOwn':             ['client'],
  'bia.create':              ['super_admin', 'org_admin', 'trainer'],
  'bia.delete':              ['super_admin', 'org_admin', 'trainer'],

  // Gruppi / Squadre
  'groups.view':             ['super_admin', 'org_admin', 'trainer', 'staff_readonly'],
  'groups.create':           ['super_admin', 'org_admin', 'trainer'],
  'groups.edit':             ['super_admin', 'org_admin', 'trainer'],
  'groups.delete':           ['super_admin', 'org_admin', 'trainer'],
  'groups.toggleClient':     ['super_admin', 'org_admin', 'trainer'],

  // Calendario / Sessioni
  'calendar.view':           ['super_admin', 'org_admin', 'trainer', 'staff_readonly'],
  'calendar.viewOwn':        ['client'],
  'calendar.create':         ['super_admin', 'org_admin', 'trainer'],
  'calendar.edit':           ['super_admin', 'org_admin', 'trainer'],
  'calendar.delete':         ['super_admin', 'org_admin', 'trainer'],
  'calendar.closeSession':   ['super_admin', 'org_admin', 'trainer'],

  // Ricorrenze
  'recurrences.view':        ['super_admin', 'org_admin', 'trainer', 'staff_readonly'],
  'recurrences.create':      ['super_admin', 'org_admin', 'trainer'],
  'recurrences.edit':        ['super_admin', 'org_admin', 'trainer'],
  'recurrences.delete':      ['super_admin', 'org_admin', 'trainer'],

  // Guida Test
  'guide.view':              ['super_admin', 'org_admin', 'trainer', 'staff_readonly'],

  // Notifiche
  'notifications.view':      ['super_admin', 'org_admin', 'trainer', 'staff_readonly'],
  'notifications.viewOwn':   ['client'],
  'notifications.create':    ['super_admin', 'org_admin', 'trainer'],

  // Profilo utente (proprio)
  'profile.view':            ['super_admin', 'org_admin', 'trainer', 'staff_readonly', 'client'],
  'profile.edit':            ['super_admin', 'org_admin', 'trainer', 'staff_readonly', 'client'],

  // Team / Membri org
  'members.view':            ['super_admin', 'org_admin'],
  'members.create':          ['super_admin', 'org_admin'],
  'members.editRole':        ['super_admin', 'org_admin'],
  'members.remove':          ['super_admin', 'org_admin'],

  // Impostazioni org
  'org.settings.view':       ['super_admin', 'org_admin'],
  'org.settings.edit':       ['super_admin', 'org_admin'],

  // Area Super Admin
  'admin.dashboard':         ['super_admin'],
  'admin.orgs.view':         ['super_admin'],
  'admin.orgs.edit':         ['super_admin'],
  'admin.orgs.suspend':      ['super_admin'],
  'admin.orgs.create':       ['super_admin'],
}

// ── Helpers ───────────────────────────────────────────────────

/** Restituisce true se il ruolo ha il permesso richiesto. */
export function hasPermission(role, permission) {
  return PERMISSIONS[permission]?.includes(role) ?? false
}

/** Restituisce true se il ruolo ha almeno uno dei permessi. */
export function hasAnyPermission(role, permissions) {
  return permissions.some(p => hasPermission(role, p))
}

/** Restituisce tutti i permessi di un ruolo. */
export function getPermissionsForRole(role) {
  return Object.entries(PERMISSIONS)
    .filter(([, roles]) => roles.includes(role))
    .map(([perm]) => perm)
}

/**
 * Matrice visiva — usata solo per documentazione/debug.
 *
 * Sezione          | super | org_admin | trainer | readonly | client
 * ─────────────────────────────────────────────────────────────────
 * Clienti view     |  ✅   |    ✅     |   ✅    |    👁    |  🟡
 * Clienti create   |  ✅   |    ✅     |   ✅    |    🔒    |  🔒
 * Clienti edit     |  ✅   |    ✅     |   ✅    |    🔒    |  🔒
 * Campionamento    |  ✅   |    ✅     |   ✅    |    👁    |  🟡
 * BIA              |  ✅   |    ✅     |   ✅    |    👁    |  🟡
 * Gruppi view      |  ✅   |    ✅     |   ✅    |    👁    |  🔒
 * Gruppi write     |  ✅   |    ✅     |   ✅    |    🔒    |  🔒
 * Calendario view  |  ✅   |    ✅     |   ✅    |    👁    |  🟡
 * Calendario write |  ✅   |    ✅     |   ✅    |    🔒    |  🔒
 * Chiudi sessione  |  ✅   |    ✅     |   ✅    |    🔒    |  🔒
 * Ricorrenze view  |  ✅   |    ✅     |   ✅    |    👁    |  🔒
 * Ricorrenze write |  ✅   |    ✅     |   ✅    |    🔒    |  🔒
 * Guida Test       |  ✅   |    ✅     |   ✅    |    ✅    |  🔒
 * Notifiche write  |  ✅   |    ✅     |   ✅    |    🔒    |  🔒
 * Profilo proprio  |  ✅   |    ✅     |   ✅    |    ✅    |  ✅
 * Team view/write  |  ✅   |    ✅     |   🔒    |    🔒    |  🔒
 * Impost. org      |  ✅   |    ✅     |   🔒    |    🔒    |  🔒
 * Super Admin      |  ✅   |    🔒     |   🔒    |    🔒    |  🔒
 *
 * Legenda: ✅ pieno  👁 sola lettura  🟡 solo propri dati  🔒 nessun accesso
 */
