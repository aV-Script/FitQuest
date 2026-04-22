import { useState, useMemo, useCallback }           from 'react'
import { usePagination }                            from '../../../hooks/usePagination'
import { Pagination }                               from '../../../components/common/Pagination'
import { ConfirmDialog }                            from '../../../components/common/ConfirmDialog'
import { GroupToggleDialog }                        from './GroupToggleDialog'
import { GroupLeaderboard }                         from './GroupLeaderboard'
import { GroupChampions }                           from './GroupChampions'
import { GroupAnalysis }                            from './GroupAnalysis'
import { GroupComparison }                          from './GroupComparison'
import {
  addClientToGroupSlots,
  removeClientFromGroupSlots,
} from '../../../features/calendar/calendarGroupUtils'

const CLIENTS_PAGE_SIZE = 8

// ── Icone tab ─────────────────────────────────────────────────────────────────

const ICON_MANAGE = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const ICON_LEADERBOARD = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 20 18 10"/>
    <polyline points="12 20 12 4"/>
    <polyline points="6 20 6 14"/>
  </svg>
)
const ICON_ANALYSIS = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const ICON_COMPARE = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const TABS = [
  { id: 'manage',      label: 'Gestione',  icon: ICON_MANAGE      },
  { id: 'leaderboard', label: 'Classifica',icon: ICON_LEADERBOARD },
  { id: 'analysis',   label: 'Analisi',   icon: ICON_ANALYSIS    },
  { id: 'comparison', label: 'Confronto', icon: ICON_COMPARE     },
]

// ── Componente principale ─────────────────────────────────────────────────────

export function GroupDetailView({ group, clients, orgId, onToggleClient, onRename, onDelete, onBack }) {
  const [subView,      setSubView]      = useState('manage')
  const [clientSearch, setClientSearch] = useState('')
  const [isEditing,    setIsEditing]    = useState(false)
  const [editingName,  setEditingName]  = useState(group.name)
  const [showDelete,   setShowDelete]   = useState(false)
  const [toggleDialog, setToggleDialog] = useState(null)
  const [toggling,     setToggling]     = useState(null)

  const allClientsInGroup = useMemo(() =>
    clients.filter(c => group.clientIds.includes(c.id))
  , [clients, group.clientIds])

  const filteredClients = useMemo(() =>
    clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
  , [clients, clientSearch])

  const clientsInGroup    = useMemo(() => filteredClients.filter(c =>  group.clientIds.includes(c.id)), [filteredClients, group.clientIds])
  const clientsNotInGroup = useMemo(() => filteredClients.filter(c => !group.clientIds.includes(c.id)), [filteredClients, group.clientIds])

  const inGroupPagination    = usePagination(clientsInGroup,    CLIENTS_PAGE_SIZE)
  const notInGroupPagination = usePagination(clientsNotInGroup, CLIENTS_PAGE_SIZE)

  const handleRequestToggle = useCallback((client, isRemoving) => {
    setToggleDialog({ client, isRemoving })
  }, [])

  const handleConfirmToggle = useCallback(async () => {
    const { client, isRemoving } = toggleDialog
    setToggling(client.id)
    setToggleDialog(null)
    try {
      await onToggleClient(group.id, client.id)
      if (isRemoving) {
        await removeClientFromGroupSlots(orgId, group.id, client.id)
      } else {
        await addClientToGroupSlots(orgId, group.id, client.id)
      }
    } catch (err) {
      console.error('[GroupDetailView] toggleClient failed', err)
    } finally {
      setToggling(null)
    }
  }, [toggleDialog, group.id, onToggleClient, orgId])

  const handleRename = useCallback(async () => {
    if (!editingName.trim() || editingName === group.name) { setIsEditing(false); return }
    await onRename(group.id, editingName.trim())
    setIsEditing(false)
  }, [editingName, group.id, group.name, onRename])

  const handleDelete = useCallback(async () => {
    await onDelete(group.id)
    onBack()
  }, [group.id, onDelete, onBack])

  return (
    <div className="min-h-screen text-white flex flex-col">

      {/* ── Header sticky ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[.05] sticky top-0 z-30 backdrop-blur-md shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 bg-transparent border-none text-white/30 font-body text-[13px] cursor-pointer hover:text-white/60 transition-colors p-0"
        >
          ‹ Gruppi
        </button>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <input
                autoFocus
                value={editingName}
                onChange={e => setEditingName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter')  handleRename()
                  if (e.key === 'Escape') { setIsEditing(false); setEditingName(group.name) }
                }}
                className="input-base text-center font-display font-black text-[16px]"
                style={{ minWidth: 200 }}
              />
              <ActionBtn onClick={handleRename} color="#34d399">SALVA</ActionBtn>
              <ActionBtn onClick={() => { setIsEditing(false); setEditingName(group.name) }} muted>ANNULLA</ActionBtn>
            </>
          ) : (
            <span className="font-display font-black text-[16px] text-white">{group.name}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && <ActionBtn onClick={() => setIsEditing(true)}>RINOMINA</ActionBtn>}
          <ActionBtn onClick={() => setShowDelete(true)} danger>ELIMINA</ActionBtn>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1">

        {/* Info gruppo */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-4">
          <div
            className="w-14 h-14 rounded-[4px] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(15,214,90,0.08)', border: '1px solid rgba(15,214,90,0.2)' }}
          >
            <span className="font-display font-black text-[20px]" style={{ color: '#0fd65a' }}>
              {group.name[0].toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-display font-black text-[20px] text-white">{group.name}</div>
            <div className="font-body text-[13px] text-white/30 mt-0.5">
              {group.clientIds.length} {group.clientIds.length === 1 ? 'atleta' : 'atleti'}
            </div>
          </div>
        </div>

        {/* ── Tab nav — rx-card sticky ── */}
        <section className="px-4 pb-3 sticky top-[57px] z-10 backdrop-blur-md">
          <div className="rounded-[4px] rx-card overflow-hidden">
            <div className="grid grid-flow-col auto-cols-fr px-1 py-2">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSubView(t.id)}
                  className="flex items-center justify-center gap-1.5 px-1 sm:px-3 py-2 rounded-[3px] font-display text-[11px] tracking-[0.5px] cursor-pointer border transition-all"
                  style={subView === t.id
                    ? { background: 'rgba(15,214,90,0.15)', borderColor: 'rgba(15,214,90,0.4)', color: '#0fd65a' }
                    : { background: 'transparent', borderColor: 'transparent', color: 'rgba(255,255,255,0.35)' }
                  }
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contenuto tab ── */}

        {subView === 'leaderboard' && (
          <div className="px-6 pt-4 pb-12">
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              <div className="w-full lg:w-[58%]">
                <div className="rounded-[4px] p-5 rx-card">
                  <div className="font-display text-[10px] tracking-[3px] uppercase mb-5" style={{ color: '#0fd65a' }}>◈ Classifica</div>
                  <GroupLeaderboard clients={allClientsInGroup} />
                </div>
              </div>
              <div className="w-full lg:w-[42%]">
                <GroupChampions clients={allClientsInGroup} />
              </div>
            </div>
          </div>
        )}

        {subView === 'analysis' && (
          <div className="px-6 pt-4 pb-12">
            <GroupAnalysis clients={allClientsInGroup} />
          </div>
        )}

        {subView === 'comparison' && (
          <div className="px-6 pt-4 pb-12">
            <GroupComparison clients={allClientsInGroup} />
          </div>
        )}

        {subView === 'manage' && (
          <div className="px-6 pt-4 pb-12">
            {/* Search bar full-width */}
            <input
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
              placeholder="Cerca atleta per nome..."
              className="input-base w-full mb-4"
            />

            {/* Due colonne */}
            <div className="flex flex-col lg:flex-row gap-4 items-start">

              {/* Nel gruppo */}
              <div className="w-full lg:flex-1">
                <div className="rounded-[4px] p-5 rx-card">
                  <div className="font-display text-[10px] tracking-[3px] uppercase mb-5" style={{ color: '#0fd65a' }}>
                    ◈ Nel gruppo <span className="text-white/25 ml-1">({clientsInGroup.length})</span>
                  </div>
                  {inGroupPagination.paginatedItems.length === 0 ? (
                    <p className="font-body text-[13px] text-white/20">
                      {clientSearch ? 'Nessun risultato.' : 'Nessun atleta in questo gruppo.'}
                    </p>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        {inGroupPagination.paginatedItems.map(c => (
                          <ClientRow key={c.id} client={c} inGroup loading={toggling === c.id} onToggle={() => handleRequestToggle(c, true)} />
                        ))}
                      </div>
                      <Pagination {...inGroupPagination} />
                    </>
                  )}
                </div>
              </div>

              {/* Da aggiungere */}
              <div className="w-full lg:flex-1">
                <div className="rounded-[4px] p-5 rx-card">
                  <div className="font-display text-[10px] tracking-[3px] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    ◈ Da aggiungere <span className="text-white/25 ml-1">({clientsNotInGroup.length})</span>
                  </div>
                  {notInGroupPagination.paginatedItems.length === 0 ? (
                    <p className="font-body text-[13px] text-white/20">
                      {clientSearch ? 'Nessun risultato.' : 'Tutti gli atleti sono già nel gruppo.'}
                    </p>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        {notInGroupPagination.paginatedItems.map(c => (
                          <ClientRow key={c.id} client={c} inGroup={false} loading={toggling === c.id} onToggle={() => handleRequestToggle(c, false)} />
                        ))}
                      </div>
                      <Pagination {...notInGroupPagination} />
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {toggleDialog && (
        <GroupToggleDialog
          client={toggleDialog.client}
          group={group}
          orgId={orgId}
          isRemoving={toggleDialog.isRemoving}
          onConfirm={handleConfirmToggle}
          onCancel={() => setToggleDialog(null)}
        />
      )}

      {showDelete && (
        <ConfirmDialog
          title={`Eliminare "${group.name}"?`}
          description="Il gruppo verrà eliminato. Gli atleti non verranno rimossi dall'app."
          confirmLabel="ELIMINA"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  )
}

// ── Componenti locali ─────────────────────────────────────────────────────────

function ClientRow({ client, inGroup, loading, onToggle }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-[3px] transition-all"
      style={inGroup
        ? { background: 'rgba(15,214,90,0.06)', border: '1px solid rgba(15,214,90,0.15)' }
        : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }
      }
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-[3px] flex items-center justify-center shrink-0"
          style={inGroup ? { background: 'rgba(15,214,90,0.15)' } : { background: 'rgba(255,255,255,0.05)' }}
        >
          <span className="font-display text-[11px]" style={{ color: inGroup ? '#0fd65a' : 'rgba(255,255,255,0.35)' }}>
            {client.name?.[0]?.toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-body text-[13px] text-white/70">{client.name}</div>
          {client.rank && (
            <div className="font-display text-[10px] text-white/25 mt-0.5">
              {client.rank} · Lv.{client.level}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onToggle}
        disabled={loading}
        className="font-display text-[10px] px-3 py-1.5 rounded-[3px] cursor-pointer border transition-all disabled:opacity-40"
        style={inGroup
          ? { color: '#f87171', borderColor: 'rgba(248,113,113,0.2)', background: 'transparent' }
          : { color: '#0fd65a', borderColor: 'rgba(15,214,90,0.2)',   background: 'rgba(15,214,90,0.06)' }
        }
      >
        {loading ? '...' : inGroup ? 'RIMUOVI' : 'AGGIUNGI'}
      </button>
    </div>
  )
}

function ActionBtn({ onClick, children, color, danger, muted }) {
  return (
    <button
      onClick={onClick}
      className="font-display text-[10px] px-2.5 py-1.5 rounded-[3px] cursor-pointer border transition-all"
      style={
        danger ? { color: '#f87171', borderColor: 'rgba(248,113,113,0.2)', background: 'transparent' } :
        muted  ? { color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.1)', background: 'transparent' } :
        color  ? { color, borderColor: color + '44', background: color + '11' } :
                 { color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.1)', background: 'transparent' }
      }
    >
      {children}
    </button>
  )
}
