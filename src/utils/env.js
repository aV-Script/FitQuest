export const ENV = import.meta.env.VITE_ENV ?? import.meta.env.MODE

export const isDev        = ENV === 'development'
export const isProduction = ENV === 'production'
export const isUat        = ENV === 'uat'

const ADMIN_HOSTNAMES = ['admin.rankex.app', 'admin-uat.rankex.app', 'rankex-admin.web.app']

/**
 * Ritorna true se il browser è sul dominio admin (admin.rankex.app).
 * In development (localhost) ritorna sempre false — nessuna separazione locale.
 */
export function isAdminDomain() {
  if (isDev) return false
  return ADMIN_HOSTNAMES.includes(window.location.hostname)
}
