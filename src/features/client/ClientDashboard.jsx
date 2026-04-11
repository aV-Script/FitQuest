import { useState, useCallback, useEffect, useMemo } from 'react'
import { useClientRank }                    from '../../hooks/useClientRank'
import { useReadonly }                       from '../../context/ReadonlyContext'
import { useTrainerState }                   from '../../context/TrainerContext'
import { SectionLabel, StatsSection } from '../../components/ui'
import { XPBar }                             from '../../components/ui/XPBar'
import { ActivityLog }                       from '../../components/ui'
import { StatsChart }                        from './StatsChart'
import { DashboardHeader }                   from './client-dashboard/DashboardHeader'
import { DeleteDialog }                      from './client-dashboard/DeleteDialog'
import { NotesSection }                      from './client-dashboard/NotesSection'
import { WorkoutPlanSection }                from './client-dashboard/WorkoutPlanSection'
import { ClientReportPrint }                 from './client-dashboard/ClientReportPrint'
import { ClientCalendar }                    from './ClientCalendar'
import { CampionamentoView }                 from './CampionamentoView'
import { useBia }                            from '../bia/useBia'
import { BiaView }                           from '../bia/BiaView'
import { BiaSummary }                        from '../bia/bia-view/BiaSummary'
import { BiaHistoryChart }                   from '../bia/bia-view/BiaHistoryChart'
import { UpgradeCategoryBanner }             from '../bia/UpgradeCategoryBanner'
import { getProfileCategory }                from '../../constants/bia'
import { calcBiaScore, getBiaRankFromScore } from '../../utils/bia'
import { getClientSlots }                    from '../../firebase/services/calendar'
import { getMonthRange, calcMonthlyCompletion } from '../calendar/useCalendar'
import { getAuth }                           from 'firebase/auth'
import app                                   from '../../firebase/config'

export function ClientDashboard({ client, orgId, onBack, onCampionamento, onDelete }) {
  const { rankObj: testRankObj, color: testColor } = useClientRank(client)
  const { userRole }  = useTrainerState()
  const readonly      = useReadonly()
  const [view,        setView]       = useState('dashboard') // 'dashboard' | 'campionamento' | 'bia'
  const [activeTab,   setActiveTab]  = useState(null)        // lazy init su defaultTab
  const [showDelete,  setShowDelete] = useState(false)
  const [showReport,  setShowReport] = useState(false)
  const [sessionsData, setSessionsData] = useState(null)

  // Fetch sessioni mese corrente — shared tra SessionsCard e Calendario tab
  useEffect(() => {
    if (!orgId || !client.id) return
    const now   = new Date()
    const { from, to } = getMonthRange(now.getFullYear(), now.getMonth() + 1)
    getClientSlots(orgId, client.id, from, to).then(slots => {
      const { planned, completed, pct } = calcMonthlyCompletion(slots, client.id)
      const today    = now.toISOString().slice(0, 10)
      const upcoming = slots
        .filter(s => s.date >= today && s.status === 'planned')
        .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
      setSessionsData({ planned, completed, pct, upcoming })
    })
  }, [orgId, client.id])

  const { handleSaveBia, handleUpgradeProfile } = useBia()

  const trainerAuthor = {
    role: userRole,
    name: getAuth(app).currentUser?.email ?? 'Trainer',
  }

  const profileType = client.profileType ?? 'tests_only'
  const profile     = getProfileCategory(profileType)

  const biaScore   = calcBiaScore(client.lastBia, client.sesso, client.eta)
  const biaRank    = getBiaRankFromScore(biaScore)
  const biaRankObj = biaScore > 0 ? biaRank : { label: 'F', color: '#4a5568' }
  const biaColor   = biaRankObj.color

  const color   = profileType === 'bia_only' ? biaColor : testColor
  const rankObj = profileType === 'bia_only' ? biaRankObj : testRankObj

  const prevStats = client.campionamenti?.[1]?.stats ?? null

  // Tab disponibili in base al profilo
  const tabs = useMemo(() => [
    ...(profile.hasTests ? [{ id: 'test',        label: 'Test'        }] : []),
    ...(profile.hasBia   ? [{ id: 'bia',         label: 'BIA'         }] : []),
    { id: 'allenamento', label: 'Allenamento' },
    { id: 'calendario',  label: 'Calendario'  },
    { id: 'note',        label: 'Note'        },
    { id: 'attivita',    label: 'Attività'    },
  ], [profile.hasTests, profile.hasBia])

  const defaultTab = profile.hasTests ? 'test' : profile.hasBia ? 'bia' : 'allenamento'
  const tab        = activeTab ?? defaultTab

  const handleDelete = useCallback(async () => {
    await onDelete(client.id)
    setShowDelete(false)
    onBack()
  }, [onDelete, client.id, onBack])

  const handleSaveCampionamento = useCallback(async (newStats, testValues) => {
    await onCampionamento(client, newStats, testValues)
  }, [onCampionamento, client])

  if (view === 'campionamento') {
    return (
      <CampionamentoView
        client={client}
        color={color}
        onSave={handleSaveCampionamento}
        onBack={() => setView('dashboard')}
      />
    )
  }

  if (view === 'bia') {
    return (
      <BiaView
        client={client}
        color={color}
        onSave={(biaData) => handleSaveBia(client, biaData)}
        onBack={() => setView('dashboard')}
      />
    )
  }

  return (
    <div className="min-h-screen text-white">

      {/* Hero esistente — rank ring + nome + XP */}
      <DashboardHeader
        client={client}
        rankObj={rankObj}
        color={color}
        biaRankObj={profileType === 'complete' ? biaRankObj : null}
        onBack={onBack}
        onDelete={() => setShowDelete(true)}
        onExport={() => setShowReport(true)}
      />

      {/* Due card recap */}
      <div className="px-6 pt-4 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <PerformanceCard
          client={client}
          color={color}
          profile={profile}
        />
        <SessionsCard data={sessionsData} />
      </div>

      {/* Banner upgrade (se necessario) */}
      <div className="px-6 pb-2">
        <UpgradeCategoryBanner
          client={client}
          color={color}
          onUpgrade={handleUpgradeProfile}
        />
      </div>

      {/* Tab bar — sticky */}
      <div className="px-6 py-3">
        <div className="rounded-[4px] p-1 flex overflow-x-auto no-scrollbar rx-card">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="font-display text-[11px] tracking-[1px] px-4 py-2 cursor-pointer border-none transition-all shrink-0 rounded-[3px] flex-1"
              style={tab === t.id
                ? { color, background: color + '15' }
                : { color: 'rgba(255,255,255,0.30)', background: 'transparent' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenuto tab */}
      <div className="pb-12">

        {/* ── Test ── */}
        {tab === 'test' && profile.hasTests && (
          <section className="px-6 pt-6">
            <div className="rounded-[4px] p-5 rx-card">
              <div className="flex items-center justify-between mb-4">
                <SectionLabel className="mb-0">◈ Status</SectionLabel>
                {!readonly && (
                  <button
                    onClick={() => setView('campionamento')}
                    className="text-[11px] font-display px-3 py-1.5 rounded-[3px] cursor-pointer border transition-all hover:opacity-80"
                    style={{ color, borderColor: color + '55', background: color + '11' }}
                  >
                    CAMPIONAMENTO
                  </button>
                )}
              </div>
              <div
                className="rounded-[4px] p-5"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <StatsSection
                  stats={client.stats}
                  prevStats={prevStats}
                  color={color}
                  categoria={client.categoria}
                />
              </div>
              <div className="mt-6">
                <StatsChart
                  campionamenti={client.campionamenti}
                  color={color}
                  categoria={client.categoria}
                />
              </div>
            </div>
          </section>
        )}

        {/* ── BIA ── */}
        {tab === 'bia' && profile.hasBia && (
          <section className="px-6 pt-6">
            <div className="rounded-[4px] p-5 rx-card">
              <div className="flex items-center justify-between mb-4">
                <SectionLabel className="mb-0">◈ BIA</SectionLabel>
                {!readonly && (
                  <button
                    onClick={() => setView('bia')}
                    className="text-[11px] font-display px-3 py-1.5 rounded-[3px] cursor-pointer border transition-all hover:opacity-80"
                    style={{ color: biaColor, borderColor: biaColor + '55', background: biaColor + '11' }}
                  >
                    NUOVA MISURAZIONE
                  </button>
                )}
              </div>
              <BiaSummary
                bia={client.lastBia}
                prevBia={client.biaHistory?.[1] ?? null}
                sex={client.sesso}
                age={client.eta}
                color={biaColor}
                rank={biaRank.label}
              />
              <div className="mt-6">
                <BiaHistoryChart biaHistory={client.biaHistory} color={biaColor} />
              </div>
            </div>
          </section>
        )}

        {/* ── Allenamento ── */}
        {tab === 'allenamento' && (
          <WorkoutPlanSection
            orgId={orgId}
            clientId={client.id}
            color={color}
            readonly={readonly}
          />
        )}

        {/* ── Calendario ── */}
        {tab === 'calendario' && (
          <section className="px-6 pt-6">
            <div className="rounded-[4px] p-5 rx-card">
              <SectionLabel className="mb-4">◈ Calendario allenamenti</SectionLabel>
              <ClientCalendar
                clientId={client.id}
                orgId={orgId}
              />
            </div>
          </section>
        )}

        {/* ── Note ── */}
        {tab === 'note' && (
          <NotesSection
            orgId={orgId}
            clientId={client.id}
            color={color}
            author={trainerAuthor}
            readonly={readonly}
          />
        )}

        {/* ── Attività ── */}
        {tab === 'attivita' && (
          <section className="px-6 pt-6">
            <ActivityLog log={client.log} color={color} limit={10} />
          </section>
        )}

      </div>

      {showDelete && (
        <DeleteDialog
          clientName={client.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showReport && (
        <ClientReportPrint
          client={client}
          color={color}
          rankObj={rankObj}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  )
}

// ── Recap cards ────────────────────────────────────────────────────────────────

function PerformanceCard({ client, color, profile }) {
  const lastCamp = client.campionamenti?.[0]
  const lastDate = lastCamp?.date
    ? new Date(lastCamp.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
    : null
  const campCount = client.campionamenti?.length ?? 0

  return (
    <div className="rounded-[4px] p-4 rx-card flex flex-col gap-3">
      <span className="font-display text-[10px] tracking-[2px] text-white/30">◈ PERFORMANCE</span>

      {profile.hasTests && (
        <div className="flex items-end justify-between">
          <div>
            <span className="font-display text-[10px] tracking-[1px] text-white/25 block mb-0.5">MEDIA</span>
            <span className="font-display font-black text-[28px] leading-none" style={{ color }}>
              {client.media != null ? client.media.toFixed(1) : '—'}
            </span>
          </div>
          <div className="text-right">
            <span className="font-display text-[10px] tracking-[1px] text-white/25 block mb-0.5">CAMP.</span>
            <span className="font-display font-bold text-[18px] text-white/60">{campCount}</span>
          </div>
        </div>
      )}

      <XPBar xp={client.xp} xpNext={client.xpNext} color={color} />

      {lastDate && (
        <span className="font-body text-[11px] text-white/25">Ultimo camp. {lastDate}</span>
      )}
    </div>
  )
}

function SessionsCard({ data }) {
  const barColor = data
    ? data.pct === 100 ? '#34d399' : data.pct >= 50 ? '#f59e0b' : data.planned === 0 ? 'rgba(255,255,255,0.15)' : '#f87171'
    : 'rgba(255,255,255,0.15)'

  return (
    <div className="rounded-[4px] p-4 rx-card flex flex-col gap-3">
      <span className="font-display text-[10px] tracking-[2px] text-white/30">◈ SESSIONI</span>

      {!data ? (
        <div className="flex flex-col gap-2">
          <div className="h-5 skeleton rounded-[3px]" />
          <div className="h-1.5 skeleton rounded-full" />
          <div className="h-4 skeleton rounded-[3px] w-2/3" />
        </div>
      ) : (
        <>
          {/* Completamento mese */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-body text-[12px] text-white/40">Questo mese</span>
              <span className="font-display font-bold text-[14px]" style={{ color: barColor }}>
                {data.completed}/{data.planned}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{ width: `${data.pct}%`, background: barColor }}
              />
            </div>
          </div>

          {/* Prossima sessione */}
          <div className="flex items-center justify-between">
            <span className="font-display text-[10px] tracking-[1px] text-white/25">PROSSIMA</span>
            {data.upcoming ? (
              <span className="font-body text-[11px] text-white/50">
                {new Date(data.upcoming.date + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'short' })}
                {data.upcoming.startTime ? ` · ${data.upcoming.startTime}` : ''}
              </span>
            ) : (
              <span className="font-body text-[11px] text-white/25">—</span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
