import { BrandingPanel } from './components/BrandingPanel'
import { FormPanel }     from './components/FormPanel'
import { useLoginForm }  from './useLoginForm'

/**
 * LoginPage — entry point dell'applicazione.
 *
 * Layout:
 * Desktop → grid 50/50 (BrandingPanel | FormPanel)
 * Mobile  → solo FormPanel a schermo intero
 */
export default function LoginPage() {
  const { handleLogin, loading, error } = useLoginForm()

  return (
    <div
      style={{
        minHeight:           '100vh',
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        background:          'var(--bg-base)',
      }}
    >
      <BrandingPanel />
      <FormPanel
        onLogin={handleLogin}
        loading={loading}
        error={error}
      />
    </div>
  )
}
