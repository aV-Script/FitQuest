/**
 * LoadingScreen — schermata di caricamento iniziale.
 * Mostrata mentre Firebase verifica l'autenticazione.
 *
 * Design: logo animato con pulse + linea di progresso indeterminata.
 */
export function LoadingScreen() {
  return (
    <div
      style={{
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--bg-base)',
        gap:            24,
      }}
    >
      {/* Pattern sfondo */}
      <div className="fixed inset-0 bg-hex opacity-20 pointer-events-none" />

      {/* Logo */}
      <div className="relative" style={{ textAlign: 'center' }}>
        {/* Glow dietro il logo */}
        <div
          style={{
            position:      'absolute',
            inset:         -40,
            background:    'radial-gradient(ellipse, rgba(14,196,82,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="text-gradient"
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      40,
            fontWeight:    900,
            letterSpacing: '-0.03em',
            lineHeight:    1,
            position:      'relative',
            animation:     'pulse-opacity 2s ease-in-out infinite',
          }}
        >
          RankEX
        </div>
      </div>

      {/* Barra di progresso indeterminata */}
      <div
        style={{
          width:        120,
          height:       2,
          background:   'var(--border-subtle)',
          borderRadius: 99,
          overflow:     'hidden',
        }}
      >
        <div
          style={{
            height:       '100%',
            width:        '40%',
            background:   'var(--gradient-primary)',
            borderRadius: 99,
            animation:    'loading-bar 1.2s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @keyframes pulse-opacity {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
