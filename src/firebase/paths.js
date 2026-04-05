/**
 * Helpers per costruire i path Firestore.
 *
 * Struttura:
 *   organizations/{orgId}/clients/{clientId}
 *   organizations/{orgId}/slots/{slotId}
 *   organizations/{orgId}/groups/{groupId}
 *   organizations/{orgId}/recurrences/{recId}
 *   organizations/{orgId}/notifications/{notId}
 *   organizations/{orgId}/members/{uid}
 */

export const clientsPath       = (orgId) => `organizations/${orgId}/clients`
export const slotsPath         = (orgId) => `organizations/${orgId}/slots`
export const groupsPath        = (orgId) => `organizations/${orgId}/groups`
export const recurrencesPath   = (orgId) => `organizations/${orgId}/recurrences`
export const notificationsPath = (orgId) => `organizations/${orgId}/notifications`
export const membersPath       = (orgId) => `organizations/${orgId}/members`
export const orgPath           = (orgId) => `organizations/${orgId}`
