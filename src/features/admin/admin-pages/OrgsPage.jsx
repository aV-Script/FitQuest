import { useState, useEffect }   from 'react'
import { getAllOrgs, updateOrg }  from '../../../firebase/services/org'
import { OrgDetailView }         from './OrgDetailView'
import { CreateOrgForm }         from './CreateOrgForm'

export function OrgsPage() {
  const [orgs,       setOrgs]       = useState([])
  const [loading,    setLoading]    = useState(true)
  const [selected,   setSelected]   = useState(null)
  const [search,     setSearch]     = useState('')
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    getAllOrgs().then(setOrgs).finally(() => setLoading(false))
  }, [])

  const handleCreated = (newOrg) => {
    setOrgs(prev => [newOrg, ...prev])
    setShowCreate(false)
  }

  const filtered = orgs.filter(o =>
    o.name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpdate = (id, data) => {
    updateOrg(id, data)
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, ...data } : o))
    setSelected(prev => prev ? { ...prev, ...data } : null)
  }

  if (selected) {
    return (
      <OrgDetailView
        org={selected}
        onBack={() => setSelected(null)}
        onUpdate={handleUpdate}
      />
    )
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-[24px] text-white m-0">Organizzazioni</h1>
        <div className="flex items-center gap-3">
          <span className="font-body text-[13px] text-white/30">{orgs.length} totali</span>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-xl px-4 py-2 font-display text-[11px] tracking-widest border-0 cursor-pointer hover:opacity-85"
            style={{ background: 'linear-gradient(135deg,#0ec452,#0a9e42)', color: '#fff' }}
          >
            + NUOVA
          </button>
        </div>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Cerca organizzazione..."
        className="input-base mb-5"
      />

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'var(--bg-surface)' }} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(org => (
            <button
              key={org.id}
              onClick={() => setSelected(org)}
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer border text-left transition-all hover:border-white/20"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: org.moduleType === 'soccer_academy'
                      ? 'rgba(14,196,82,0.12)'
                      : 'rgba(96,165,250,0.12)',
                  }}
                >
                  <span className="text-[16px]">
                    {org.moduleType === 'soccer_academy' ? '⚽' : '🏋️'}
                  </span>
                </div>
                <div>
                  <div className="font-body text-[14px] text-white/80">{org.name}</div>
                  <div className="font-body text-[11px] text-white/30">
                    {org.moduleType} · {org.plan ?? 'free'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {org.status === 'suspended' && (
                  <span
                    className="font-display text-[9px] px-2 py-0.5 rounded"
                    style={{ background: '#f8717122', color: '#f87171' }}
                  >
                    SOSPESA
                  </span>
                )}
                <span className="text-white/20 text-[16px]">›</span>
              </div>
            </button>
          ))}
        </div>
      )}
      {showCreate && (
        <CreateOrgForm
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
