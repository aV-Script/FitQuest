/**
 * EmptyState — stato vuoto con personalità.
 *
 * Ispirazione: Linear empty states — illustrativi,
 * con un'azione chiara e copy utile.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
}) {
  return (
    <div
      className="animate-fade-up flex flex-col items-center justify-center text-center"
      style={{
        padding: compact ? '32px 24px' : '64px 32px',
        gap:     20,
      }}
    >
      {icon && (
        <div
          style={{
            width:          compact ? 56 : 72,
            height:         compact ? 56 : 72,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     'var(--bg-raised)',
            border:         '1px solid var(--border-default)',
            borderRadius:   'var(--radius-xl)',
            fontSize:       compact ? 24 : 32,
            boxShadow:      'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {icon}
        </div>
      )}

      <div className="flex flex-col gap-2" style={{ maxWidth: 280 }}>
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize:   compact ? 15 : 17,
            fontWeight: 700,
            color:      'var(--text-primary)',
            margin:     0,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              fontSize:   13,
              color:      'var(--text-tertiary)',
              lineHeight: 1.6,
              margin:     0,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-col items-center gap-2">
          {action && (
            <button
              onClick={action.onClick}
              className="btn btn-primary btn-sm"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              style={{
                background:  'transparent',
                border:      'none',
                color:       'var(--text-tertiary)',
                fontSize:    12,
                cursor:      'pointer',
                padding:     '4px 8px',
                fontFamily:  'Inter, sans-serif',
                transition:  'color var(--duration-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Empty states predefiniti per le aree principali.
 */
export const EMPTY_STATES = {
  clients: {
    icon:        '👥',
    title:       'Nessun cliente ancora',
    description: 'Inizia aggiungendo il tuo primo cliente per tracciarne le performance.',
  },
  groups: {
    icon:        '🏃',
    title:       'Nessun gruppo',
    description: 'Crea un gruppo per organizzare i tuoi clienti e gestire le sessioni di gruppo.',
  },
  slots: {
    icon:        '📅',
    title:       'Nessuna sessione',
    description: 'Nessuna sessione pianificata per questo periodo.',
  },
  recurrences: {
    icon:        '↺',
    title:       'Nessuna ricorrenza',
    description: 'Crea una ricorrenza per pianificare sessioni ripetute automaticamente.',
  },
  notifications: {
    icon:        '🔔',
    title:       'Tutto aggiornato',
    description: 'Non hai nuove notifiche.',
  },
  campionamenti: {
    icon:        '📊',
    title:       'Nessuna valutazione',
    description: 'Esegui il primo campionamento per vedere le statistiche.',
  },
  bia: {
    icon:        '⚡',
    title:       'Nessuna misurazione BIA',
    description: 'Registra la prima misurazione per tracciare la composizione corporea.',
  },
  results: {
    icon:        '🔍',
    title:       'Nessun risultato',
    description: 'Prova a modificare i filtri di ricerca.',
  },
}
