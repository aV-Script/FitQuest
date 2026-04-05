import { useState, useCallback }  from 'react'
import { createOrg, addMember }  from '../../../firebase/services/org'
import { createClientAccount }   from '../../../firebase/services/auth'
import { createUserProfile }     from '../../../firebase/services/users'
import { MODULES, TERMINOLOGIES } from '../../../config/modules.config'

const MODULE_OPTIONS = Object.values(MODULES)

const PLAN_OPTIONS = [
  { value: 'free',    label: 'Free',    desc: 'Per iniziare' },
  { value: 'starter', label: 'Starter', desc: 'Fino a 50 clienti' },
  { value: 'pro',     label: 'Pro',     desc: 'Illimitato' },
]

// ── Helpers ────────────────────────────────────────────────────

function generatePassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function Field({ label, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-display text-[10px] tracking-[2px] text-white/30">{label}</label>
      {children}
      {error && <span className="font-body text-[11px] text-red-400">{error}</span>}
      {hint && !error && <span className="font-body text-[11px] text-white/25">{hint}</span>}
    </div>
  )
}

function InputBase({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`input-base ${className}`}
    />
  )
}

// ── Step indicator ────────────────────────────────────────────

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2 px-6 py-3 shrink-0"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      {[
        { n: 1, label: 'Organizzazione' },
        { n: 2, label: 'Admin account' },
      ].map((s, i) => (
        <div key={s.n} className="flex items-center gap-2">
          {i > 0 && <div className="w-8 h-px" style={{ background: step > i ? 'rgba(14,196,82,0.5)' : 'rgba(255,255,255,0.1)' }} />}
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center font-display text-[10px]"
              style={step === s.n
                ? { background: '#0ec452',                    color: '#fff' }
                : step > s.n
                ? { background: 'rgba(14,196,82,0.2)',        color: '#0ec452' }
                : { background: 'rgba(255,255,255,0.06)',     color: 'rgba(255,255,255,0.3)' }
              }
            >
              {step > s.n ? '✓' : s.n}
            </div>
            <span
              className="font-display text-[11px]"
              style={{ color: step === s.n ? '#fff' : 'rgba(255,255,255,0.3)' }}
            >
              {s.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Summary ───────────────────────────────────────────────────

function SummaryRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between py-2"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <span className="font-display text-[10px] tracking-[1px] text-white/30">{label}</span>
      <span className="font-body text-[13px]" style={{ color: accent ?? 'rgba(255,255,255,0.7)' }}>
        {value}
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

const INITIAL = {
  name: '', moduleType: 'personal_training', terminologyVariant: 'personal_training', plan: 'free',
  adminName: '', adminEmail: '', adminPassword: '',
}

export function CreateOrgForm({ onClose, onCreated }) {
  const [step,    setStep]    = useState(1)
  const [form,    setForm]    = useState(INITIAL)
  const [showPw,  setShowPw]  = useState(false)
  const [copied,  setCopied]  = useState(false)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  const set = useCallback((key) => (e) => {
    const val = e.target?.value ?? e
    setForm(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'moduleType') {
        const mod = MODULES[val]
        next.terminologyVariant = mod?.defaultTerminology ?? val
      }
      return next
    })
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }, [])

  const validateStep1 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nome richiesto'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.adminName.trim())         e.adminName    = 'Nome richiesto'
    if (!form.adminEmail.trim())        e.adminEmail   = 'Email richiesta'
    else if (!/\S+@\S+\.\S+/.test(form.adminEmail)) e.adminEmail = 'Email non valida'
    if (form.adminPassword.length < 6)  e.adminPassword = 'Minimo 6 caratteri'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

  const handleGenerate = () => {
    const pw = generatePassword()
    setForm(p => ({ ...p, adminPassword: pw }))
    setShowPw(true)
    setErrors(p => ({ ...p, adminPassword: undefined }))
  }

  const handleCopy = async () => {
    if (!form.adminPassword) return
    await navigator.clipboard.writeText(form.adminPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!validateStep2()) return
    setLoading(true)
    try {
      const orgRef = await createOrg({
        name:               form.name.trim(),
        moduleType:         form.moduleType,
        terminologyVariant: form.terminologyVariant,
        plan:               form.plan,
        status:             'active',
      })
      const orgId = orgRef.id

      const uid = await createClientAccount(form.adminEmail.trim(), form.adminPassword)
      await createUserProfile(uid, {
        email:              form.adminEmail.trim(),
        role:               'org_admin',
        orgId,
        clientId:           null,
        terminologyVariant: form.terminologyVariant,
        mustChangePassword: true,
        createdAt:          new Date().toISOString(),
      })
      await addMember(orgId, uid, {
        role:  'org_admin',
        name:  form.adminName.trim(),
        email: form.adminEmail.trim(),
      })

      onCreated({
        id: orgId, name: form.name.trim(),
        moduleType: form.moduleType, terminologyVariant: form.terminologyVariant,
        plan: form.plan, status: 'active', createdAt: new Date().toISOString(),
      })
    } catch (err) {
      setErrors({ submit: err.message })
      setLoading(false)
    }
  }

  const selectedMod   = MODULES[form.moduleType]
  const termVariants  = selectedMod?.terminologyVariants ?? [form.moduleType]
  const selectedTerm  = TERMINOLOGIES[form.terminologyVariant]
  const selectedPlan  = PLAN_OPTIONS.find(p => p.value === form.plan)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl flex flex-col"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 className="font-display font-black text-[16px] text-white m-0">
            Nuova organizzazione
          </h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 text-[22px] bg-transparent border-none cursor-pointer leading-none"
          >×</button>
        </div>

        <StepIndicator step={step} />

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4 flex-1">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <Field label="NOME ORGANIZZAZIONE" error={errors.name}>
                <InputBase
                  placeholder="Es. Palestra Roma Nord"
                  value={form.name}
                  onChange={set('name')}
                  autoFocus
                />
              </Field>

              <Field label="MODULO">
                <div className="flex gap-2">
                  {MODULE_OPTIONS.map(mod => (
                    <button
                      key={mod.id}
                      onClick={() => set('moduleType')(mod.id)}
                      className="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl cursor-pointer border transition-all"
                      style={form.moduleType === mod.id
                        ? { background: 'rgba(14,196,82,0.1)', borderColor: 'rgba(14,196,82,0.35)' }
                        : { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--border-strong)' }
                      }
                    >
                      <span className="text-[24px]">{mod.icon}</span>
                      <span className="font-display text-[11px]"
                        style={{ color: form.moduleType === mod.id ? '#0ec452' : 'rgba(255,255,255,0.35)' }}>
                        {mod.label}
                      </span>
                    </button>
                  ))}
                </div>
              </Field>

              {termVariants.length > 1 && (
                <Field label="TERMINOLOGIA"
                  hint={`${selectedTerm?.manager} · ${selectedTerm?.member} · ${selectedTerm?.group}`}>
                  <div className="flex gap-2">
                    {termVariants.map(v => {
                      const t = TERMINOLOGIES[v]
                      return (
                        <button
                          key={v}
                          onClick={() => set('terminologyVariant')(v)}
                          className="flex-1 py-3 rounded-xl cursor-pointer border text-center transition-all"
                          style={form.terminologyVariant === v
                            ? { background: 'rgba(96,165,250,0.1)', borderColor: 'rgba(96,165,250,0.35)' }
                            : { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--border-strong)' }
                          }
                        >
                          <div className="font-display text-[12px]"
                            style={{ color: form.terminologyVariant === v ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                            {t?.appName}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}

              <Field label="PIANO">
                <div className="flex gap-2">
                  {PLAN_OPTIONS.map(p => (
                    <button
                      key={p.value}
                      onClick={() => set('plan')(p.value)}
                      className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl cursor-pointer border transition-all"
                      style={form.plan === p.value
                        ? { background: 'rgba(167,139,250,0.1)', borderColor: 'rgba(167,139,250,0.35)' }
                        : { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--border-strong)' }
                      }
                    >
                      <span className="font-display text-[12px]"
                        style={{ color: form.plan === p.value ? '#a78bfa' : 'rgba(255,255,255,0.5)' }}>
                        {p.label}
                      </span>
                      <span className="font-body text-[10px] text-white/25">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <p className="font-body text-[12px] text-white/40 m-0">
                Crea le credenziali per l'amministratore dell'organizzazione.
              </p>

              <Field label="NOME COMPLETO" error={errors.adminName}>
                <InputBase
                  placeholder="Mario Rossi"
                  value={form.adminName}
                  onChange={set('adminName')}
                  autoFocus
                />
              </Field>

              <Field label="EMAIL" error={errors.adminEmail}>
                <InputBase
                  type="email"
                  placeholder="mario@example.com"
                  value={form.adminEmail}
                  onChange={set('adminEmail')}
                />
              </Field>

              <Field label="PASSWORD TEMPORANEA" error={errors.adminPassword}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <InputBase
                      type={showPw ? 'text' : 'password'}
                      placeholder="Min. 6 caratteri"
                      value={form.adminPassword}
                      onChange={set('adminPassword')}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 bg-transparent border-none cursor-pointer text-[14px]"
                    >
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="shrink-0 px-3 rounded-xl font-display text-[10px] tracking-wide cursor-pointer border transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    GENERA
                  </button>
                  {form.adminPassword && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="shrink-0 px-3 rounded-xl font-display text-[10px] tracking-wide cursor-pointer border transition-all"
                      style={copied
                        ? { background: 'rgba(14,196,82,0.1)', borderColor: 'rgba(14,196,82,0.3)', color: '#0ec452' }
                        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
                      }
                    >
                      {copied ? '✓' : 'COPIA'}
                    </button>
                  )}
                </div>
              </Field>

              <div className="rounded-xl px-4 py-3"
                style={{ background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.12)' }}>
                <p className="font-body text-[11px] text-blue-300/60 m-0">
                  Dovrà cambiare la password al primo accesso. Condividi le credenziali in modo sicuro.
                </p>
              </div>

              {/* Riepilogo */}
              <div className="rounded-xl px-4 py-1"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <div className="font-display text-[10px] tracking-[2px] text-white/25 py-2">RIEPILOGO</div>
                <SummaryRow label="ORG"    value={form.name} />
                <SummaryRow label="MODULO" value={selectedMod?.label} />
                <SummaryRow label="PIANO"  value={selectedPlan?.label} />
                {form.adminEmail && <SummaryRow label="ADMIN" value={form.adminEmail} accent="#60a5fa" />}
              </div>

              {errors.submit && (
                <p className="font-body text-[12px] text-red-400 m-0">{errors.submit}</p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 shrink-0 flex gap-3"
          style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {step === 2 && (
            <button
              onClick={() => { setStep(1); setErrors({}) }}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-display text-[12px] tracking-widest cursor-pointer border transition-all"
              style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              INDIETRO
            </button>
          )}
          <button
            onClick={step === 1 ? handleNext : handleSave}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-display text-[12px] tracking-widest cursor-pointer border-none transition-all"
            style={{
              background: loading ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#0ec452,#0a9e42)',
              color:      loading ? 'rgba(255,255,255,0.3)' : '#fff',
            }}
          >
            {loading ? 'CREAZIONE...' : step === 1 ? 'AVANTI →' : 'CREA ORGANIZZAZIONE'}
          </button>
        </div>
      </div>
    </div>
  )
}
