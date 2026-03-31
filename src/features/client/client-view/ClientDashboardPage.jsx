import { RankRing }                        from '../../../components/ui/RankRing'
import { XPBar }                           from '../../../components/ui/XPBar'
import { SectionLabel, Divider, ActivityLog, StatsSection } from '../../../components/ui'
import { StatsChart }                      from '../StatsChart'
import { getCategoriaById }                from '../../../constants'
import { BiaSummary }                      from '../../bia/bia-view/BiaSummary'
import { BiaHistoryChart }                 from '../../bia/bia-view/BiaHistoryChart'
import { BiaLockedPanel }                  from '../../bia/BiaLockedPanel'
import { getProfileCategory }              from '../../../constants/bia'

/**
 * Pagina dashboard del cliente — statistiche, grafico, attività.
 */
export function ClientDashboardPage({ client, color, rankObj, biaRankObj }) {
  const prevStats   = client.campionamenti?.[1]?.stats ?? null
  const categoria   = getCategoriaById(client.categoria)
  const profileType = client.profileType ?? 'tests_only'
  const profile     = getProfileCategory(profileType)

  return (
    <div>
      {/* Hero */}
      <div className="px-6 py-8 flex flex-col items-center text-center gap-4">

        {biaRankObj ? (
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center gap-1.5">
              <RankRing rankObj={rankObj} xp={client.xp} xpNext={client.xpNext} size={120} />
              <span className="font-display text-[9px] tracking-[2px] text-white/30">TEST</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RankRing rankObj={biaRankObj} xp={client.xp} xpNext={client.xpNext} size={120} />
              <span className="font-display text-[9px] tracking-[2px] text-white/30">BIA</span>
            </div>
          </div>
        ) : (
          <RankRing rankObj={rankObj} xp={client.xp} xpNext={client.xpNext} size={160} />
        )}

        <div>
          <div className="font-display font-black text-[28px] leading-none tracking-wide text-white">
            {client.name}
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <span className="font-display text-[12px] rounded-[3px] px-3 py-1 text-white/40 border border-white/10">
              LIVELLO {client.level}
            </span>
            {categoria && (
              <span
                className="font-display text-[12px] rounded-[3px] px-3 py-1"
                style={{ background: categoria.color + '1a', color: categoria.color, border: `1px solid ${categoria.color}44` }}
              >
                {categoria.label}
              </span>
            )}
          </div>
        </div>

        <XPBar xp={client.xp} xpNext={client.xpNext} color={color} />
      </div>

      <Divider color={color} />

      {/* Sezione test — solo se il profilo include test */}
      {profile.hasTests ? (
        <>
          <section className="px-6 py-6">
            <div className="rounded-[4px] p-5 rx-card">
              <SectionLabel>◈ Status</SectionLabel>
              <StatsSection
                stats={client.stats}
                prevStats={prevStats}
                color={color}
                categoria={client.categoria}
              />
            </div>
          </section>

          <Divider color={color} />

          <section className="px-6 py-6">
            <StatsChart
              campionamenti={client.campionamenti}
              color={color}
              categoria={client.categoria}
            />
          </section>

          <Divider color={color} />
        </>
      ) : (
        <BiaLockedPanel profileType={profileType} color={color} />
      )}

      {/* Sezione BIA */}
      {profile.hasBia ? (
        <>
          <section className="px-6 py-6">
            <BiaSummary
              bia={client.lastBia}
              prevBia={client.biaHistory?.[1] ?? null}
              sex={client.sesso}
              age={client.eta}
              color={color}
            />
          </section>
          <Divider color={color} />
          <section className="px-6 py-6">
            <BiaHistoryChart biaHistory={client.biaHistory} color={color} />
          </section>
          <Divider color={color} />
        </>
      ) : (
        <BiaLockedPanel profileType={profileType} color={color} />
      )}

      {/* Attività */}
      <section className="px-6 py-6">
        <ActivityLog log={client.log} color={color} />
      </section>

      <div className="h-10" />
    </div>
  )
}
