import { useState, useMemo } from 'react'
import { useCalendar, calcMonthlyCompletion, calcSessionConfig } from '../../hooks/useCalendar'
import { useGroups } from '../../hooks/useGroups'
import { SectionLabel } from '../ui'

const MONTH_NAMES = [
  'Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
  'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre',
]
const DAY_NAMES = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom']

export function TrainerCalendar({ trainerId, clients }) {
  const {
    sessions, loading,
    currentYear, currentMonth,
    goToPrevMonth, goToNextMonth,
    handleAddSessions,
    handleCompleteSession,
    handleCompleteByDate,
    handleDeleteSession,
  } = useCalendar(trainerId)

  const { groups, handleAddGroup, handleToggleClient, handleDeleteGroup } = useGroups(trainerId)

  const [selectedDate, setSelectedDate]   = useState(null)
  const [showAdd,      setShowAdd]        = useState(false)
  const [showGroups,   setShowGroups]     = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  // Raggruppa sessioni per data per la griglia
  const sessionsByDate = useMemo(() => {
    const map = {}
    sessions.forEach(s => {
      if (!map[s.date]) map[s.date] = []
      map[s.date].push(s)
    })
    return map
  }, [sessions])

  // Costruisce la griglia del mese
  const calendarDays = useMemo(() => {
    const firstDay    = new Date(currentYear, currentMonth - 1, 1)
    const lastDay     = new Date(currentYear, currentMonth, 0)
    const startOffset = (firstDay.getDay() + 6) % 7
    const days = []
    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`
      days.push({ day: d, dateStr, sessions: sessionsByDate[dateStr] ?? [] })
    }
    return days
  }, [currentYear, currentMonth, sessionsByDate])

  // Sessioni del giorno selezionato, arricchite col nome cliente
  const selectedDaySessions = useMemo(() => {
    if (!selectedDate) return []
    return (sessionsByDate[selectedDate] ?? []).map(s => ({
      ...s,
      client: clients.find(c => c.id === s.clientId),
    }))
  }, [selectedDate, sessionsByDate, clients])

  // Panoramica mensile per sidebar: completamento per cliente
  const monthlyOverview = useMemo(() => {
    return clients
      .map(client => {
        const clientSessions = sessions.filter(s => s.clientId === client.id)
        const stats = calcMonthlyCompletion(clientSessions)
        return { client, ...stats }
      })
      .filter(row => row.planned > 0)
      .sort((a, b) => b.pct - a.pct)
  }, [clients, sessions])

  return (
    <div className="text-white">
      {/* Header pagina */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[.05]">
        <h1 className="font-display font-black text-[20px] text-white m-0">Calendario</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGroups(true)}
            className="bg-transparent border border-white/10 rounded-xl px-3 py-1.5 text-white/40 font-display text-[11px] tracking-widest cursor-pointer hover:text-white/60 transition-all">
            GRUPPI
          </button>
          <button
            onClick={() => { setSelectedDate(today); setShowAdd(true) }}
            className="rounded-xl px-4 py-2 font-display text-[11px] tracking-widest cursor-pointer border-0 transition-opacity hover:opacity-85"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}>
            NUOVA SESSIONE
          </button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-57px)]">

        {/* ── Sidebar: panoramica mensile + gruppi ── */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 border-r border-white/[.05] p-6 gap-5 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          <div>
            <SectionLabel>MESE IN CORSO</SectionLabel>
            {monthlyOverview.length === 0
              ? <p className="font-body text-[12px] text-white/20">Nessuna sessione pianificata.</p>
              : monthlyOverview.map(({ client, planned, completed, pct }) => (
                <div key={client.id} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-body text-[12px] text-white/70 truncate flex-1">{client.name}</span>
                    <span className="font-display text-[11px] ml-2 shrink-0"
                      style={{ color: pct === 100 ? '#34d399' : pct >= 50 ? '#f59e0b' : '#f87171' }}>
                      {completed}/{planned}
                    </span>
                  </div>
                  <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: pct === 100 ? '#34d399' : pct >= 50 ? '#f59e0b' : '#f87171' }} />
                  </div>
                </div>
              ))
            }
          </div>

          {groups.length > 0 && (
            <div>
              <SectionLabel>GRUPPI</SectionLabel>
              {groups.map(g => (
                <div key={g.id} className="flex items-center justify-between py-1.5">
                  <span className="font-body text-[12px] text-white/50">{g.name}</span>
                  <span className="font-display text-[10px] text-white/25">{g.clientIds.length} clienti</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* ── Calendario principale ── */}
        <main className="flex-1 px-4 lg:px-8 py-6 min-w-0">

          {/* Navigazione mese */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={goToPrevMonth}
              className="bg-transparent border border-white/10 rounded-xl w-9 h-9 flex items-center justify-center cursor-pointer hover:border-white/20 transition-all text-white/40 hover:text-white/70 text-[18px]">
              ‹
            </button>
            <h2 className="font-display font-black text-[20px] text-white">
              {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </h2>
            <button onClick={goToNextMonth}
              className="bg-transparent border border-white/10 rounded-xl w-9 h-9 flex items-center justify-center cursor-pointer hover:border-white/20 transition-all text-white/40 hover:text-white/70 text-[18px]">
              ›
            </button>
          </div>

          {/* Header giorni */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center font-display text-[10px] text-white/30 tracking-[2px] py-1">{d}</div>
            ))}
          </div>

          {/* Griglia */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, i) => {
              if (!cell) return <div key={`empty-${i}`} />
              const isToday    = cell.dateStr === today
              const isSelected = cell.dateStr === selectedDate
              const total      = cell.sessions.length
              const done       = cell.sessions.filter(s => s.completed).length

              return (
                <button key={cell.dateStr}
                  onClick={() => setSelected(cell.dateStr, isSelected)}
                  className="relative rounded-xl p-2 min-h-[60px] flex flex-col items-center gap-1 cursor-pointer transition-all border"
                  style={{
                    background:   isSelected ? 'rgba(59,130,246,0.15)' : isToday ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    borderColor:  isSelected ? '#3b82f6' : isToday ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                  }}>
                  <span className="font-display text-[12px]"
                    style={{ color: isToday ? '#60a5fa' : isSelected ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                    {cell.day}
                  </span>
                  {total > 0 && (
                    <div className="flex flex-col items-center gap-0.5 w-full px-1">
                      {/* Barra mini completamento */}
                      <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${Math.round((done / total) * 100)}%`, background: done === total ? '#34d399' : '#f59e0b' }} />
                      </div>
                      <span className="font-display text-[9px]"
                        style={{ color: done === total ? '#34d399' : 'rgba(255,255,255,0.3)' }}>
                        {done}/{total}
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Dettaglio giorno selezionato */}
          {selectedDate && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <SectionLabel className="mb-0">
                  {new Date(selectedDate + 'T12:00').toLocaleDateString('it-IT', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}
                </SectionLabel>
                <div className="flex gap-2">
                  {selectedDaySessions.some(s => !s.completed) && (
                    <button
                      onClick={() => handleCompleteByDate(selectedDate, clients)}
                      className="text-[11px] font-display px-3 py-1.5 rounded-lg cursor-pointer border transition-all"
                      style={{ color: '#34d399', borderColor: '#34d39955', background: '#34d39911' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#34d39922'}
                      onMouseLeave={e => e.currentTarget.style.background = '#34d39911'}>
                      COMPLETA TUTTI
                    </button>
                  )}
                  <button
                    onClick={() => setShowAdd(true)}
                    className="text-[11px] font-display px-3 py-1.5 rounded-lg cursor-pointer border transition-all"
                    style={{ color: '#60a5fa', borderColor: '#60a5fa55', background: '#60a5fa11' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#60a5fa22'}
                    onMouseLeave={e => e.currentTarget.style.background = '#60a5fa11'}>
                    AGGIUNGI
                  </button>
                </div>
              </div>

              {selectedDaySessions.length === 0 ? (
                <p className="font-body text-[13px] text-white/20">Nessuna sessione per questo giorno.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedDaySessions.map(({ id, completed, client }) => (
                    <div key={id}
                      className="flex items-center gap-3 rounded-xl px-4 py-3"
                      style={{
                        background: completed ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${completed ? '#34d39933' : 'rgba(255,255,255,0.07)'}`,
                      }}>
                      {/* Checkbox completamento */}
                      <button
                        onClick={() => !completed && client && handleCompleteSession(id, client)}
                        disabled={completed}
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border cursor-pointer"
                        style={{
                          background:   completed ? '#34d399' : 'transparent',
                          borderColor:  completed ? '#34d399' : 'rgba(255,255,255,0.2)',
                          cursor:       completed ? 'default' : 'pointer',
                        }}>
                        {completed && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>

                      <span className="font-body text-[13px] flex-1"
                        style={{ color: completed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)' }}>
                        {client?.name ?? '—'}
                      </span>

                      {completed && (
                        <span className="font-display text-[10px] text-emerald-400">+{calcSessionConfig(client?.sessionsPerWeek ?? 3).xpPerSession} XP</span>
                      )}

                      <button
                        onClick={() => handleDeleteSession(id)}
                        className="bg-transparent border-none text-white/20 cursor-pointer hover:text-red-400 transition-colors text-[14px] leading-none p-0 ml-1">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modale aggiungi sessione */}
      {showAdd && (
        <AddSessionModal
          date={selectedDate || today}
          clients={clients}
          groups={groups}
          onClose={() => setShowAdd(false)}
          onSave={async (date, clientIds) => {
            await handleAddSessions(date, clientIds)
            setShowAdd(false)
            setSelectedDate(date)
          }}
        />
      )}

      {/* Modale gestione gruppi */}
      {showGroups && (
        <GroupsModal
          groups={groups}
          clients={clients}
          onClose={() => setShowGroups(false)}
          onAddGroup={handleAddGroup}
          onToggleClient={handleToggleClient}
          onDeleteGroup={handleDeleteGroup}
        />
      )}
    </div>
  )

  function setSelected(dateStr, isAlreadySelected) {
    setSelectedDate(isAlreadySelected ? null : dateStr)
  }
}

// ── AddSessionModal ───────────────────────────────────────────────────────────
function AddSessionModal({ date, clients, groups, onClose, onSave }) {
  const [selectedDate,    setSelectedDate]    = useState(date)
  const [selectedClients, setSelectedClients] = useState([])

  const toggle = (id) =>
    setSelectedClients(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  const selectGroup = (group) => {
    // Aggiunge tutti i clienti del gruppo (senza duplicati)
    setSelectedClients(prev => {
      const next = new Set(prev)
      group.clientIds.forEach(id => next.add(id))
      return [...next]
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-white text-[15px] m-0">Nuova sessione</h3>
          <button onClick={onClose} className="bg-transparent border-none text-white/40 text-xl cursor-pointer hover:text-white/70">✕</button>
        </div>

        {/* Data */}
        <div className="mb-4">
          <label className="font-display text-[10px] text-white/30 tracking-[2px] block mb-1.5">DATA</label>
          <input type="date" value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="input-base w-full" style={{ colorScheme: 'dark' }} />
        </div>

        {/* Selezione rapida per gruppo */}
        {groups.length > 0 && (
          <div className="mb-4">
            <label className="font-display text-[10px] text-white/30 tracking-[2px] block mb-2">SELEZIONA PER GRUPPO</label>
            <div className="flex flex-wrap gap-2">
              {groups.map(g => (
                <button key={g.id} onClick={() => selectGroup(g)}
                  className="rounded-xl px-3 py-1.5 font-display text-[11px] cursor-pointer border transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
                  {g.name} ({g.clientIds.length})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lista clienti */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="font-display text-[10px] text-white/30 tracking-[2px]">CLIENTI</label>
            <div className="flex gap-2">
              <button onClick={() => setSelectedClients(clients.map(c => c.id))}
                className="font-display text-[9px] text-white/30 cursor-pointer hover:text-white/50 bg-transparent border-none p-0">
                TUTTI
              </button>
              <span className="text-white/15">·</span>
              <button onClick={() => setSelectedClients([])}
                className="font-display text-[9px] text-white/30 cursor-pointer hover:text-white/50 bg-transparent border-none p-0">
                NESSUNO
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
            {clients.map(c => (
              <button key={c.id} onClick={() => toggle(c.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer border transition-all text-left"
                style={selectedClients.includes(c.id)
                  ? { background: 'rgba(59,130,246,0.12)', borderColor: '#3b82f655', color: '#fff' }
                  : { background: 'transparent', borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}>
                <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 border"
                  style={{
                    background:  selectedClients.includes(c.id) ? '#3b82f6' : 'transparent',
                    borderColor: selectedClients.includes(c.id) ? '#3b82f6' : 'rgba(255,255,255,0.2)',
                  }}>
                  {selectedClients.includes(c.id) && (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="font-body text-[13px] flex-1">{c.name}</span>
                <span className="font-display text-[10px] opacity-30">{c.rank ?? 'F'}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => selectedClients.length > 0 && onSave(selectedDate, selectedClients)}
          disabled={selectedClients.length === 0}
          className="w-full rounded-xl py-3 font-display text-[12px] tracking-widest border-0 transition-opacity"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: '#fff',
            opacity: selectedClients.length === 0 ? 0.4 : 1,
            cursor: selectedClients.length === 0 ? 'not-allowed' : 'pointer',
          }}>
          {selectedClients.length === 0
            ? 'SELEZIONA ALMENO UN CLIENTE'
            : `CREA ${selectedClients.length} SESSION${selectedClients.length === 1 ? 'E' : 'I'}`}
        </button>
      </div>
    </div>
  )
}

// ── GroupsModal ───────────────────────────────────────────────────────────────
function GroupsModal({ groups, clients, onClose, onAddGroup, onToggleClient, onDeleteGroup }) {
  const [newName,       setNewName]       = useState('')
  const [expandedGroup, setExpandedGroup] = useState(null)

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) return
    await onAddGroup(name)
    setNewName('')
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-white text-[15px] m-0">Gruppi clienti</h3>
          <button onClick={onClose} className="bg-transparent border-none text-white/40 text-xl cursor-pointer hover:text-white/70">✕</button>
        </div>

        {/* Crea nuovo gruppo */}
        <div className="flex gap-2 mb-5">
          <input
            className="input-base flex-1"
            placeholder="Nome gruppo (es. Arti Marziali)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <button onClick={handleCreate}
            className="rounded-xl px-4 font-display text-[11px] tracking-widest cursor-pointer border-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}>
            CREA
          </button>
        </div>

        {/* Lista gruppi */}
        {groups.length === 0
          ? <p className="font-body text-[13px] text-white/20 text-center py-6">Nessun gruppo creato.</p>
          : groups.map(g => (
            <div key={g.id} className="mb-3 rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Header gruppo */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <button onClick={() => setExpandedGroup(expandedGroup === g.id ? null : g.id)}
                  className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-left flex-1 p-0">
                  <span className="font-display text-[13px] text-white">{g.name}</span>
                  <span className="font-body text-[11px] text-white/30">{g.clientIds.length} clienti</span>
                  <span className="text-white/30 text-[12px] ml-auto">{expandedGroup === g.id ? '▲' : '▼'}</span>
                </button>
                <button onClick={() => onDeleteGroup(g.id)}
                  className="bg-transparent border-none text-white/20 cursor-pointer hover:text-red-400 transition-colors text-[13px] ml-3 p-0">
                  ✕
                </button>
              </div>

              {/* Lista clienti del gruppo (espandibile) */}
              {expandedGroup === g.id && (
                <div className="px-2 py-2 flex flex-col gap-1">
                  {clients.map(c => {
                    const inGroup = g.clientIds.includes(c.id)
                    return (
                      <button key={c.id} onClick={() => onToggleClient(g.id, c.id)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer border transition-all text-left"
                        style={inGroup
                          ? { background: 'rgba(59,130,246,0.1)', borderColor: '#3b82f633', color: '#fff' }
                          : { background: 'transparent', borderColor: 'transparent', color: 'rgba(255,255,255,0.4)' }}>
                        <div className="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0"
                          style={{
                            background:  inGroup ? '#3b82f6' : 'transparent',
                            borderColor: inGroup ? '#3b82f6' : 'rgba(255,255,255,0.2)',
                          }}>
                          {inGroup && (
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className="font-body text-[12px]">{c.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  )
}
