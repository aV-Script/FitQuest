import { useState, useCallback }           from 'react'
import { useCalendar }                     from '../../features/calendar/useCalendar'
import { CalendarHeader }                  from './trainer-calendar/CalendarHeader'
import { MonthView }                       from './trainer-calendar/MonthView'
import { WeekView }                        from './trainer-calendar/WeekView'
import { DayView }                         from './trainer-calendar/DayView'
import { SlotPopup }                       from './trainer-calendar/SlotPopup'
import { CloseSessionModal }               from './trainer-calendar/CloseSessionModal'
import { AddSlotModal }                    from './trainer-calendar/AddSlotModal'
import { RecurrenceModal }                 from './trainer-calendar/RecurrenceModal'
import { useGroups }                       from '../../hooks/useGroups'

export function TrainerCalendar({ orgId, clients = [], onRefreshClients, onNavigate }) {
  const {
    slots, isLoading,
    currentDate, view,
    setView, navigate, goToToday,
    handleAddSlot, handleAddRecurrence,
    handleCloseSlot, handleSkipSlot, handleDeleteSlot,
  } = useCalendar(orgId)

  const { groups } = useGroups(orgId)
  const today = new Date().toISOString().slice(0, 10)

  // ── Stato UI ──────────────────────────────────────────────────────────────
  const [popup,           setPopup]           = useState(null)  // { slot, x, y }
  const [closeModal,      setCloseModal]      = useState(null)  // slot
  const [addModal,        setAddModal]        = useState(null)  // { date, startTime }
  const [recurrenceModal, setRecurrenceModal] = useState(false)

  // ── Handlers UI ───────────────────────────────────────────────────────────
  const handleSlotClick = useCallback((slot, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x    = Math.min(rect.left, window.innerWidth - 300)
    const y    = Math.min(rect.bottom + 8, window.innerHeight - 400)
    setPopup({ slot, x, y })
  }, [])

  const handleEmptyClick = useCallback((date, startTime) => {
    setAddModal({ date, startTime })
  }, [])

  const handleCloseSession = useCallback((slot) => {
    setPopup(null)
    setCloseModal(slot)
  }, [])

  const handleConfirmClose = useCallback(async (attendeeIds) => {
    await handleCloseSlot(closeModal.id, attendeeIds, clients)
    setCloseModal(null)
    onRefreshClients?.()
  }, [closeModal, handleCloseSlot, clients, onRefreshClients])

  const handleSkip = useCallback(async (slotId) => {
    setPopup(null)
    await handleSkipSlot(slotId)
  }, [handleSkipSlot])

  const handleDelete = useCallback(async (slotId) => {
    setPopup(null)
    await handleDeleteSlot(slotId)
  }, [handleDeleteSlot])

  const handleViewRecurrence = useCallback((recurrenceId) => {
    setPopup(null)
    onNavigate?.('recurrences', { initialRecurrenceId: recurrenceId })
  }, [onNavigate])

  const viewProps = {
    currentDate,
    slots,
    clients,
    today,
    onSlotClick:  handleSlotClick,
    onEmptyClick: handleEmptyClick,
  }

  return (
    <div className="text-white flex flex-col h-screen">

      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onNavigate={navigate}
        onToday={goToToday}
        onSetView={setView}
        onNewSlot={() => setAddModal({ date: today, startTime: '09:00' })}
        onNewRecurrence={() => setRecurrenceModal(true)}
      />

      {isLoading ? (
        <CalendarLoading />
      ) : (
        <div
          key={view}
          className="animate-fade-up"
          style={{ display: 'flex', flex: 1, minHeight: 0 }}
        >
          {view === 'month' && <MonthView {...viewProps} />}
          {view === 'week'  && <WeekView  {...viewProps} />}
          {view === 'day'   && <DayView   {...viewProps} />}
        </div>
      )}

      {/* Popup dettaglio slot */}
      {popup && (
        <SlotPopup
          slot={popup.slot}
          clients={clients}
          position={{ x: popup.x, y: popup.y }}
          onClose={() => setPopup(null)}
          onCloseSession={() => handleCloseSession(popup.slot)}
          onSkip={() => handleSkip(popup.slot.id)}
          onDelete={() => handleDelete(popup.slot.id)}
          onViewRecurrence={handleViewRecurrence}
        />
      )}

      {/* Modal chiusura sessione */}
      {closeModal && (
        <CloseSessionModal
          slot={closeModal}
          clients={clients}
          onClose={() => setCloseModal(null)}
          onConfirm={handleConfirmClose}
        />
      )}

      {/* Modal nuova sessione */}
      {addModal && (
        <AddSlotModal
          date={addModal.date}
          startTime={addModal.startTime}
          clients={clients}
          groups={groups}
          slots={slots}
          onClose={() => setAddModal(null)}
          onSave={async (data) => { await handleAddSlot(data); setAddModal(null) }}
        />
      )}

      {/* Modal ricorrenza */}
      {recurrenceModal && (
        <RecurrenceModal
          clients={clients}
          groups={groups}
          onClose={() => setRecurrenceModal(false)}
          onSave={async (data) => { await handleAddRecurrence(data); setRecurrenceModal(false) }}
        />
      )}
    </div>
  )
}

// ── CalendarLoading ───────────────────────────────────────────

function CalendarLoading() {
  return (
    <div
      style={{
        flex:           1,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexDirection:  'column',
        gap:            16,
      }}
    >
      <div
        style={{
          width:        40,
          height:       40,
          border:       '2px solid var(--border-default)',
          borderTop:    '2px solid var(--green-400)',
          borderRadius: '50%',
          animation:    'spin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span
        style={{
          fontFamily:    'Montserrat, sans-serif',
          fontSize:      10,
          fontWeight:    600,
          letterSpacing: '0.15em',
          color:         'var(--text-tertiary)',
          textTransform: 'uppercase',
        }}
      >
        Caricamento...
      </span>
    </div>
  )
}
