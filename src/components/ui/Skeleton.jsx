/**
 * Skeleton — placeholder durante il loading.
 *
 * Ispirazione: GitHub, Linear — skeleton che
 * rispecchiano fedelmente la forma del contenuto.
 */

export function Skeleton({ width, height = 16, radius, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width:        width ?? '100%',
        height,
        borderRadius: radius ?? 'var(--radius-md)',
        flexShrink:   0,
      }}
    />
  )
}

/**
 * SkeletonText — simula N righe di testo.
 */
export function SkeletonText({ lines = 2, lastLineWidth = '60%' }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  )
}

/**
 * SkeletonCard — placeholder per una Card generica.
 */
export function SkeletonCard({ lines = 3, showAvatar = false }) {
  return (
    <div
      style={{
        background:    'var(--bg-surface)',
        border:        '1px solid var(--border-subtle)',
        borderRadius:  'var(--radius-xl)',
        padding:       20,
        display:       'flex',
        gap:           12,
      }}
    >
      {showAvatar && (
        <Skeleton
          width={40}
          height={40}
          radius="var(--radius-lg)"
        />
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton height={18} width="55%" />
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <Skeleton
            key={i}
            height={13}
            width={i === lines - 2 ? '35%' : '85%'}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * SkeletonClientCard — skeleton per ClientCard.
 * Replica la forma esatta della card.
 */
export function SkeletonClientCard() {
  return (
    <div
      style={{
        background:    'var(--bg-surface)',
        border:        '1px solid var(--border-subtle)',
        borderRadius:  'var(--radius-xl)',
        padding:       16,
        display:       'flex',
        flexDirection: 'column',
        gap:           12,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton width={44} height={44} radius="var(--radius-lg)" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton height={15} width="60%" />
          <Skeleton height={11} width="40%" />
        </div>
      </div>
      {/* XP bar */}
      <Skeleton height={3} radius="99px" />
      {/* Stat bars */}
      {[80, 65, 90, 50, 75].map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton width={64} height={11} />
          <div style={{ flex: 1 }}>
            <Skeleton height={4} radius="99px" width={`${w}%`} />
          </div>
          <Skeleton width={20} height={11} />
        </div>
      ))}
    </div>
  )
}

/**
 * SkeletonList — lista di skeleton card.
 */
export function SkeletonList({ count = 4, CardSkeleton = SkeletonCard }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
