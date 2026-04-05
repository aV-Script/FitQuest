/**
 * Sidebar desktop per la sezione gruppi.
 * Ricerca gruppi + bottone nuovo gruppo.
 */
export function GroupsSidebar({ groupSearch, onGroupSearchChange, onNewGroup, totalGroups }) {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 p-6 gap-5 sticky top-0 h-screen overflow-y-auto"
      style={{ borderRight: '1px solid var(--border-subtle)' }}
    >
      <button
        onClick={onNewGroup}
        className="w-full py-2.5 text-[11px] rounded-[3px] font-display tracking-widest cursor-pointer border-0 transition-opacity hover:opacity-85"
        style={{ background: 'var(--gradient-primary)', color: '#080c12' }}
      >
        NUOVO GRUPPO
      </button>

      <div>
        <p className="font-display text-[10px] text-white/30 tracking-[3px] mb-2">RICERCA</p>
        <input
          value={groupSearch}
          onChange={e => onGroupSearchChange(e.target.value)}
          placeholder="Nome gruppo..."
          className="input-base w-full"
        />
      </div>

      <div className="mt-auto">
        <p className="font-display text-[10px] text-white/20 tracking-[2px]">
          {totalGroups} {totalGroups === 1 ? 'GRUPPO' : 'GRUPPI'}
        </p>
      </div>
    </aside>
  )
}