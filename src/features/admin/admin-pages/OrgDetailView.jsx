import { useState, useEffect, useCallback } from 'react'
import { getMembers, addMember }            from '../../../firebase/services/org'
import { createClientAccount }             from '../../../firebase/services/auth'
import { createUserProfile }               from '../../../firebase/services/users'
import { ConfirmDialog }                   from '../../../components/common/ConfirmDialog'

// ── Add member form (inline) ──────────────────────────────────

function generatePassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const ROLE_OPTIONS = [
  { value: 'org_admin',      label: 'Admin',           color: '#f43f5e' },
  { value: 'trainer',        label: 'Trainer',         color: '#60a5fa' },
  { value: 'staff_readonly', label: 'Staff (lettura)', color: '#f59e0b' },
]

function AddMemberForm({ orgId, terminologyVariant, onSaved, onCancel }) {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'trainer' })
  const [showPw,  setShowPw]  = useState(false)
  const [copied,  setCopied]  = useState(false)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target?.value ?? e }))
    setErrors(p => ({ ...p, [key]: undefined }))
  }

  const handleGenerate = () => {
    const pw = generatePassword()
    setForm(p => ({ ...p, password: pw }))
    setShowPw(true)
  }

  const handleCopy = async () => {
    if (!form.password) return
    await navigator.clipboard.writeText(form.password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())       e.name     = 'Richiesto'
    if (!form.email.trim())      e.email    = 'Richiesta'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Non valida'
    if (form.password.length < 6) e.password = 'Min. 6 caratteri'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const uid = await createClientAccount(form.email.trim(), form.password)
      await createUserProfile(uid, {
        email:              form.email.trim(),
        role:               form.role,
        orgId,
        clientId:           null,
        terminologyVariant: terminologyVariant ?? 'personal_training',
        mustChangePassword: true,
        createdAt:          new Date().toISOString(),
      })
      await addMember(orgId, uid, {
        role:  form.role,
        name:  form.name.trim(),
        email: form.email.trim(),
      })
      onSaved({ uid, role: form.role, name: form.name.trim(), email: form.email.trim() })
    } catch (err) {
      setErrors({ submit: err.message })
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3 mt-3"
      style={{ background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.15)' }}>
      <div className="font-display text-[11px] tracking-[2px] text-blue-400">NUOVO MEMBRO</div>

      {/* Ruolo */}
      <div className="flex gap-2">
        {ROLE_OPTIONS.map(r => (
          <button key={r.value} onClick={() => set('role')(r.value)}
            className="flex-1 py-2 rounded-xl cursor-pointer border font-display text-[10px] transition-all"
            style={form.role === r.value
              ? { background: r.color + '18', borderColor: r.color + '44', color: r.color }
              : { background: 'transparent', borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }
            }>
            {r.label}
          </button>
        ))}
      </div>

      {/* Nome */}
      <div>
        <input
          placeholder="Nome completo"
          value={form.name}
          onChange={set('name')}
          className="input-base"
        />
        {errors.name && <p className="font-body text-[11px] text-red-400 mt-1 mb-0">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={set('email')}
          className="input-base"
        />
        {errors.email && <p className="font-body text-[11px] text-red-400 mt-1 mb-0">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password temporanea"
              value={form.password}
              onChange={set('password')}
              className="input-base pr-9"
            />
            <button type="button" onClick={() => setShowPw(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 bg-transparent border-none cursor-pointer text-[13px]">
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="button" onClick={handleGenerate}
            className="shrink-0 px-3 rounded-xl font-display text-[10px] cursor-pointer border transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
            GENERA
          </button>
          {form.password && (
            <button type="button" onClick={handleCopy}
              className="shrink-0 px-3 rounded-xl font-display text-[10px] cursor-pointer border transition-all"
              style={copied
                ? { background: 'rgba(14,196,82,0.1)', borderColor: 'rgba(14,196,82,0.3)', color: '#0ec452' }
                : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
              {copied ? '✓' : 'COPIA'}
            </button>
          )}
        </div>
        {errors.password && <p className="font-body text-[11px] text-red-400 mt-1 mb-0">{errors.password}</p>}
      </div>

      {errors.submit && <p className="font-body text-[12px] text-red-400 m-0">{errors.submit}</p>}

      <div className="flex gap-2">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl font-display text-[11px] cursor-pointer border transition-all"
          style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}>
          ANNULLA
        </button>
        <button onClick={handleSave} disabled={loading}
          className="flex-1 py-2.5 rounded-xl font-display text-[11px] cursor-pointer border-none transition-all"
          style={{ background: loading ? 'rgba(255,255,255,0.05)' : '#60a5fa', color: loading ? 'rgba(255,255,255,0.3)' : '#fff' }}>
          {loading ? 'SALVATAGGIO...' : 'AGGIUNGI'}
        </button>
      </div>
    </div>
  )
}

// ── OrgDetailView ─────────────────────────────────────────────

export function OrgDetailView({ org, onBack, onUpdate }) {
  const [showSuspend,  setShowSuspend]  = useState(false)
  const [members,      setMembers]      = useState([])
  const [loadingM,     setLoadingM]     = useState(true)
  const [showAddForm,  setShowAddForm]  = useState(false)

  const isSuspended = org.status === 'suspended'

  useEffect(() => {
    setLoadingM(true)
    getMembers(org.id)
      .then(setMembers)
      .finally(() => setLoadingM(false))
  }, [org.id])

  const handleToggleSuspend = async () => {
    const newStatus = isSuspended ? 'active' : 'suspended'
    onUpdate(org.id, { status: newStatus })
    setShowSuspend(false)
  }

  const handleMemberSaved = useCallback((member) => {
    setMembers(prev => [...prev, member])
    setShowAddForm(false)
  }, [])

  const roleLabel = (role) => ROLE_OPTIONS.find(r => r.value === role)?.label ?? role
  const roleColor = (role) => ROLE_OPTIONS.find(r => r.value === role)?.color ?? '#fff'

  return (
    <div className="px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 bg-transparent border-none text-white/30 font-body text-[13px] cursor-pointer hover:text-white/60 mb-6 p-0"
      >
        ‹ Organizzazioni
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-[24px] text-white m-0">{org.name}</h1>
          <div className="font-body text-[13px] text-white/40 mt-1">
            {org.moduleType} · {org.plan ?? 'free'} · creata {org.createdAt?.slice(0, 10)}
          </div>
        </div>
        <button
          onClick={() => setShowSuspend(true)}
          className="font-display text-[11px] px-4 py-2 rounded-xl cursor-pointer border transition-all"
          style={isSuspended
            ? { color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', background: 'transparent' }
            : { color: '#f87171', borderColor: 'rgba(248,113,113,0.2)', background: 'transparent' }
          }
        >
          {isSuspended ? 'RIATTIVA' : 'SOSPENDI'}
        </button>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { label: 'Modulo',        value: org.moduleType },
          { label: 'Piano',         value: org.plan ?? 'free' },
          { label: 'Terminologia',  value: org.terminologyVariant ?? '—' },
          { label: 'Status',        value: org.status ?? 'active' },
          { label: 'Owner ID',      value: org.ownerId ?? '—' },
          { label: 'Org ID',        value: org.id },
        ].map(item => (
          <div key={item.label} className="rounded-xl px-4 py-3"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
            <div className="font-display text-[10px] text-white/30 tracking-[2px] mb-1">
              {item.label.toUpperCase()}
            </div>
            <div className="font-body text-[13px] text-white/70 truncate">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-[12px] tracking-[2px] text-white/40 m-0">MEMBRI</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="font-display text-[10px] px-3 py-1.5 rounded-xl cursor-pointer border transition-all"
            style={{ color: '#60a5fa', borderColor: 'rgba(96,165,250,0.25)', background: 'transparent' }}
          >
            + AGGIUNGI
          </button>
        )}
      </div>

      {loadingM ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map(i => (
            <div key={i} className="h-12 rounded-xl animate-pulse"
              style={{ background: 'var(--bg-surface)' }} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {members.length === 0 && !showAddForm && (
            <div className="font-body text-[13px] text-white/25 py-4 text-center">
              Nessun membro — aggiungi un admin per iniziare
            </div>
          )}
          {members.map(m => (
            <div key={m.uid}
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: roleColor(m.role) + '18' }}>
                  <span className="font-display font-black text-[12px]"
                    style={{ color: roleColor(m.role) }}>
                    {m.name?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
                <div>
                  <div className="font-body text-[13px] text-white/80">{m.name}</div>
                  <div className="font-body text-[11px] text-white/30">{m.email}</div>
                </div>
              </div>
              <span className="font-display text-[10px] px-2.5 py-1 rounded-lg"
                style={{ background: roleColor(m.role) + '18', color: roleColor(m.role) }}>
                {roleLabel(m.role)}
              </span>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddMemberForm
          orgId={org.id}
          terminologyVariant={org.terminologyVariant}
          onSaved={handleMemberSaved}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {showSuspend && (
        <ConfirmDialog
          title={isSuspended ? `Riattivare ${org.name}?` : `Sospendere ${org.name}?`}
          description={isSuspended
            ? "L'organizzazione tornerà ad essere accessibile dai suoi membri."
            : "I membri dell'organizzazione non potranno più accedere alla piattaforma."
          }
          confirmLabel={isSuspended ? 'RIATTIVA' : 'SOSPENDI'}
          onConfirm={handleToggleSuspend}
          onCancel={() => setShowSuspend(false)}
        />
      )}
    </div>
  )
}
