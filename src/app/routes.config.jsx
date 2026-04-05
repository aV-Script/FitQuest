import { lazy, Suspense }       from 'react'
import ChangePasswordScreen     from '../features/client/ChangePasswordScreen'
import { ErrorBoundary }        from '../components/common/ErrorBoundary'
import { LoadingScreen }        from '../components/common/LoadingScreen'

const TrainerView    = lazy(() => import('../features/trainer/TrainerView'))
const ClientView     = lazy(() => import('../features/client/ClientView'))
const OrgAdminView   = lazy(() => import('../features/org/OrgAdminView'))
const SuperAdminView = lazy(() => import('../features/admin/SuperAdminView'))

export const ROLE_REDIRECT = {
  super_admin:    '/admin',
  org_admin:      '/org',
  trainer:        '/trainer',
  staff_readonly: '/trainer',
  client:         '/client',
}

export const PROTECTED_ROUTES = [
  {
    path:         '/admin',
    allowedRoles: ['super_admin'],
    element:      (user, profile, org, terminology, helpers) => (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <SuperAdminView />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path:         '/org',
    allowedRoles: ['org_admin'],
    element:      (user, profile, org, terminology, helpers) => (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <OrgAdminView profile={profile} org={org} terminology={terminology} />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path:         '/trainer',
    allowedRoles: ['trainer', 'staff_readonly'],
    element:      (user, profile, org, terminology, helpers) => (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <TrainerView
            profile={profile}
            org={org}
            terminology={terminology}
            readonly={profile?.role === 'staff_readonly'}
          />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path:         '/client',
    allowedRoles: ['client'],
    element:      (user, profile, org, terminology, helpers) => (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          {profile?.mustChangePassword
            ? <ChangePasswordScreen userId={user.uid} onDone={() => helpers.refreshProfile(user.uid)} />
            : <ClientView orgId={profile?.orgId} clientId={profile?.clientId} />
          }
        </Suspense>
      </ErrorBoundary>
    ),
  },
]
