/**
 * Spinner SVG animato.
 * Non usa CSS animation per evitare jank durante il layout.
 */
export function LoadingSpinner({ size = 16, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Caricamento"
      style={{ animation: 'spin 0.65s linear infinite', flexShrink: 0 }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <circle
        cx="12" cy="12" r="10"
        stroke={color}
        strokeWidth="2.5"
        strokeOpacity="0.2"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
