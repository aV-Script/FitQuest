import { useState } from 'react'
import { TEST_GUIDES } from '../../constants/testGuides'
import { STATS } from '../../constants'

export function TestGuidePage() {
  const [selected,  setSelected]  = useState(STATS[0].key)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const guide = TEST_GUIDES[selected]

  const handleSelect = (key) => {
    setSelected(key)
    setMenuOpen(false)
  }

  return (
    <div className="text-white">
      <div className="flex items-center px-6 py-4 border-b border-white/[.05]">
        <h1 className="font-display font-black text-[20px] text-white m-0">Guida Test</h1>
      </div>

      <div className="flex min-h-[calc(100vh-113px)] lg:min-h-[calc(100vh-57px)]">

        {/* ── Sidebar desktop — lista fissa ── */}
        <aside className="hidden lg:flex w-56 xl:w-64 shrink-0 border-r border-white/[.05] p-6 flex-col gap-2 sticky top-0 h-screen overflow-y-auto">
          <p className="font-display text-[10px] text-white/30 tracking-[3px] mb-2">TEST BASE</p>
          {STATS.map(s => (
            <button
              key={s.key}
              onClick={() => setSelected(s.key)}
              className="text-left px-3 py-2.5 rounded-xl font-body text-[13px] cursor-pointer border transition-all"
              style={selected === s.key
                ? { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }
                : { background: 'transparent', borderColor: 'transparent', color: 'rgba(255,255,255,0.4)' }
              }
            >
              {s.label}
              <span className="block font-display text-[10px] opacity-50 mt-0.5">{TEST_GUIDES[s.key]?.name}</span>
            </button>
          ))}
        </aside>

        {/* ── Mobile: menu a tendina ── */}
        <div className="lg:hidden w-full">
          {/* Trigger */}
          <div className="px-4 py-3 border-b border-white/[.05]">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer border transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="text-left">
                <span className="font-display text-[12px] text-white/30 tracking-[2px] block">TEST SELEZIONATO</span>
                <span className="font-body text-[14px] text-white mt-0.5 block">
                  {STATS.find(s => s.key === selected)?.label} — {guide?.name}
                </span>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                className="mt-1 rounded-xl overflow-hidden"
                style={{ background: 'rgba(15,31,61,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {STATS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => handleSelect(s.key)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between cursor-pointer transition-all border-none"
                    style={{
                      background: selected === s.key ? 'rgba(59,130,246,0.15)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={e => { if (selected !== s.key) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={e => { if (selected !== s.key) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div>
                      <span className="font-body text-[14px]"
                        style={{ color: selected === s.key ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                        {s.label}
                      </span>
                      <span className="block font-display text-[10px] opacity-40 mt-0.5">
                        {TEST_GUIDES[s.key]?.name}
                      </span>
                    </div>
                    {selected === s.key && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contenuto guida mobile */}
          {guide && (
            <div className="px-4 py-6">
              <GuideContent guide={guide} />
            </div>
          )}
        </div>

        {/* ── Contenuto desktop ── */}
        {guide && (
          <main className="hidden lg:block flex-1 px-8 py-8 max-w-3xl overflow-y-auto">
            <GuideContent guide={guide} />
          </main>
        )}
      </div>
    </div>
  )
}

// ── Contenuto guida (condiviso desktop/mobile) ────────────────────────────────
function GuideContent({ guide }) {
  return (
    <>
      <div className="mb-8">
        <p className="font-display text-[10px] text-white/30 tracking-[3px] mb-2">GUIDA ESECUZIONE TEST</p>
        <h2 className="font-display font-black text-[28px] lg:text-[32px] text-white m-0 leading-tight">
          {guide.name}
        </h2>
        <div className="flex gap-2 mt-3 flex-wrap">
          <Pill label="Statistica" value={guide.stat} />
          <Pill label="Unità"      value={guide.unit} />
          <Pill label="Durata"     value={guide.duration} />
        </div>
      </div>

      <GuideSection title="Attrezzatura necessaria">
        <ul className="m-0 pl-0 list-none flex flex-col gap-2">
          {guide.equipment.map((item, i) => (
            <li key={i} className="flex gap-2.5 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-[6px] shrink-0" />
              <span className="font-body text-[14px] text-white/70">{item}</span>
            </li>
          ))}
        </ul>
      </GuideSection>

      <GuideSection title="Riscaldamento">
        <ol className="m-0 pl-0 list-none flex flex-col gap-2">
          {guide.warmup.map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="font-display text-[11px] text-white/25 mt-0.5 w-4 shrink-0">{i + 1}</span>
              <span className="font-body text-[14px] text-white/70">{step}</span>
            </li>
          ))}
        </ol>
      </GuideSection>

      <GuideSection title="Protocollo di esecuzione">
        <ol className="m-0 pl-0 list-none flex flex-col gap-4">
          {guide.protocol.map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span
                className="font-display font-black text-[13px] w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
              >
                {i + 1}
              </span>
              <span className="font-body text-[14px] text-white/80 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </GuideSection>

      <GuideSection title="Note operative">
        <ul className="m-0 pl-0 list-none flex flex-col gap-2">
          {guide.notes.map((note, i) => (
            <li key={i}
              className="flex gap-2.5 items-start rounded-xl px-3 py-2.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-yellow-400/60 mt-0.5 shrink-0 text-[12px]">!</span>
              <span className="font-body text-[13px] text-white/60">{note}</span>
            </li>
          ))}
        </ul>
      </GuideSection>

      <div
        className="mt-6 rounded-2xl p-6 flex flex-col items-center justify-center gap-2"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', minHeight: 100 }}
      >
        <div className="font-display text-[10px] text-white/20 tracking-[3px]">VIDEO DIMOSTRAZIONE</div>
        <div className="font-body text-[13px] text-white/20">Disponibile prossimamente</div>
      </div>
    </>
  )
}

function GuideSection({ title, children }) {
  return (
    <div className="mb-8">
      <div className="font-display text-[10px] text-white/30 tracking-[3px] uppercase mb-4">{title}</div>
      {children}
    </div>
  )
}

function Pill({ label, value }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span className="font-body text-[11px] text-white/30">{label}:</span>
      <span className="font-display text-[11px] text-white/70">{value}</span>
    </div>
  )
}
