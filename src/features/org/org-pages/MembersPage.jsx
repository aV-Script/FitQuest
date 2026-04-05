import { useState, useEffect, useCallback } from 'react'
import { getMembers, addMember,
         updateMember, removeMember }        from '../../../firebase/services/org'
import { createClientAccount }               from '../../../firebase/services/auth'
import { createUserProfile }                 from '../../../firebase/services/users'
import { ConfirmDialog }                     from '../../../components/common/ConfirmDialog'
import { CreateMemberForm }                  from './CreateMemberForm'

const ROLE_CONFIG = {
  trainer: {
    label: 'Trainer',
    color: '#60a5fa',
    desc:  'Lettura e scrittura completa',
    icon:  '✏️',
  },
  staff_readonly: {
    label: 'Staff (sola lettura)',
    color: '#f59e0b',
    desc:  'Solo visualizzazione dati',
    icon:  '👁️',
  },
  org_admin: {
    label: 'Admin',
    color: '#f43f5e',
    desc:  'Gestione completa organizzazione',
    icon:  '⭐',
  },
}

export function MembersPage({ orgId }) {
  const [members,      setMembers]      = useState([])
  const [loading,      setLoading]      = useState(false)
  const [showCreate,   setShowCreate]   = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    if (!orgId) return
    setLoading(true)
    getMembers(orgId)
      .then(setMembers)
      .finally(() => setLoading(false))
  }, [orgId])

  const handleCreate = useCallback(async ({ email, password, role, name }) => {
    const uid = await createClientAccount(email, password)
    await createUserProfile(uid, { email, role, orgId, mustChangePassword: true })
    await addMember(orgId, uid, { role, name, email })
    setMembers(prev => [...prev, { uid, role, name, email }])
    setShowCreate(false)
  }, [orgId])

  const handleChangeRole = useCallback(async (uid, newRole) => {
    await updateMember(orgId, uid, { role: newRole })
    setMembers(prev => prev.map(m => m.uid === uid ? { ...m, role: newRole } : m))
  }, [orgId])

  const handleRemove = useCallback(async () => {
    await removeMember(orgId, deleteTarget.uid)
    setMembers(prev => prev.filter(m => m.uid !== deleteTarget.uid))
    setDeleteTarget(null)
  }, [orgId, deleteTarget])

  return (
    <div className="text-white">
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <h1 className="font-display font-black text-[20px] text-white m-0">Team</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl px-4 py-2 font-display text-[11px] tracking-widest border-0 cursor-pointer hover:opacity-85"
          style={{ background: 'var(--gradient-primary)', color: '#080c12' }}
        >
          + AGGIUNGI MEMBRO
        </button>
      </div>

      <div className="px-6 py-5">
        {/* Legenda ruoli */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {Object.entries(ROLE_CONFIG).map(([id, cfg]) => (
            <div
              key={id}
              className="rounded-xl px-4 py-3"
              style={{ background: cfg.color + '08', border: `1px solid ${cfg.color}22` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px]">{cfg.icon}</span>
                <span className="font-display text-[11px] font-bold" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>
              <p className="font-body text-[11px] text-white/30 m-0">{cfg.desc}</p>
            </div>
          ))}
        </div>

        {/* Lista membri */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'var(--bg-surface)' }} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map(member => {
              const roleCfg = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.trainer
              return (
                <div
                  key={member.uid}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: roleCfg.color + '18' }}
                    >
                      <span className="font-display font-black text-[13px]" style={{ color: roleCfg.color }}>
                        {member.name?.[0]?.toUpperCase() ?? '?'}
                      </span>
                    </div>
                    <div>
                      <div className="font-body text-[13px] text-white/80">{member.name}</div>
                      <div className="font-body text-[11px] text-white/30">{member.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={member.role}
                      onChange={e => handleChangeRole(member.uid, e.target.value)}
                      className="font-display text-[11px] px-3 py-1.5 rounded-lg cursor-pointer border bg-transparent"
                      style={{ color: roleCfg.color, borderColor: roleCfg.color + '33', background: roleCfg.color + '08' }}
                    >
                      {Object.entries(ROLE_CONFIG).map(([id, cfg]) => (
                        <option key={id} value={id} style={{ background: '#0c1219', color: cfg.color }}>
                          {cfg.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setDeleteTarget(member)}
                      className="font-display text-[10px] px-2.5 py-1 rounded-lg cursor-pointer border transition-all"
                      style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.2)', background: 'transparent' }}
                    >
                      RIMUOVI
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateMemberForm onClose={() => setShowCreate(false)} onSave={handleCreate} />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={`Rimuovere ${deleteTarget.name}?`}
          description="Il membro verrà rimosso dal team. Il suo account rimarrà attivo ma non potrà accedere all'organizzazione."
          confirmLabel="RIMUOVI"
          onConfirm={handleRemove}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
