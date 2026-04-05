import { useState, useMemo, useCallback }  from 'react'
import { useTrainerNav }                   from './useTrainerNav'
import { useTrainerState }                 from '../../context/TrainerContext'
import { usePagination }                   from '../../hooks/usePagination'
import { ClientCard }                      from './clients-page/ClientCard'
import { FiltersSidebar }                  from './clients-page/FiltersSidebar'
import { MobileControls }                  from './clients-page/MobileControls'
import { NewClientView }                   from './NewClientView'
import { Pagination }                      from '../../components/common/Pagination'
import { ReadonlyGuard }                   from '../../components/common/ReadonlyGuard'
import { EmptyState, EMPTY_STATES,
         SkeletonClientCard, Button }      from '../../components/ui'

const PAGE_SIZE = 12

const SORT_OPTIONS = [
  { id: 'name',  label: 'Nome A→Z' },
  { id: 'rank',  label: 'Rank' },
  { id: 'level', label: 'Livello' },
  { id: 'xp',    label: 'XP' },
]

export function ClientsPage({
  orgId,
  clients       = [],
  clientsLoading: loading = false,
  clientsError:   error   = null,
  onAddClient,
}) {
  const { selectClient }  = useTrainerNav()
  const { terminology }   = useTrainerState()

  const [view,    setView]    = useState('list')
  const [search,  setSearch]  = useState('')
  const [sort,    setSort]    = useState('name')
  const [filters, setFilters] = useState({
    categoria:   null,
    rank:        null,
    profileType: null,
  })

  // ── Filtra e ordina ─────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...clients]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      )
    }

    if (filters.categoria) {
      result = result.filter(c => c.categoria === filters.categoria)
    }
    if (filters.rank) {
      result = result.filter(c => c.rank === filters.rank)
    }
    if (filters.profileType) {
      result = result.filter(c => (c.profileType ?? 'tests_only') === filters.profileType)
    }

    result.sort((a, b) => {
      switch (sort) {
        case 'rank':  return (b.media ?? 0) - (a.media ?? 0)
        case 'level': return (b.level ?? 0) - (a.level ?? 0)
        case 'xp':    return (b.xp ?? 0) - (a.xp ?? 0)
        default:      return (a.name ?? '').localeCompare(b.name ?? '')
      }
    })

    return result
  }, [clients, search, sort, filters])

  const { paginatedItems, ...pagination } = usePagination(filtered, PAGE_SIZE)

  const handleClientClick = useCallback((client) => {
    selectClient(client)
  }, [selectClient])

  const handleAdd = useCallback(async (formData) => {
    const newClient = await onAddClient(formData)
    if (newClient) selectClient(newClient)
    return newClient
  }, [onAddClient, selectClient])

  if (view === 'new') {
    return (
      <NewClientView
        orgId={orgId}
        onAdd={handleAdd}
        onBack={() => setView('list')}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '20px 24px',
          borderBottom:   '1px solid var(--border-subtle)',
          gap:            16,
          flexShrink:     0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      20,
              fontWeight:    900,
              color:         'var(--text-primary)',
              margin:        0,
              letterSpacing: '-0.01em',
            }}
          >
            {terminology?.members ?? 'Clienti'}
          </h1>
          {!loading && (
            <span
              style={{
                fontFamily:   'Montserrat, sans-serif',
                fontSize:     11,
                fontWeight:   600,
                color:        'var(--text-tertiary)',
                background:   'var(--bg-raised)',
                border:       '1px solid var(--border-default)',
                borderRadius: 'var(--radius-full)',
                padding:      '2px 10px',
                lineHeight:   1.6,
              }}
            >
              {clients.length}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position:      'absolute',
                left:          12,
                top:           '50%',
                transform:     'translateY(-50%)',
                color:         'var(--text-tertiary)',
                fontSize:      13,
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              type="search"
              placeholder={`Cerca ${terminology?.member ?? 'cliente'}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base"
              style={{ paddingLeft: 36, width: 220, height: 36, fontSize: 13 }}
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              height:        36,
              padding:       '0 12px',
              background:    'var(--bg-raised)',
              border:        '1px solid var(--border-default)',
              borderRadius:  'var(--radius-lg)',
              color:         'var(--text-secondary)',
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      11,
              fontWeight:    600,
              cursor:        'pointer',
              outline:       'none',
              letterSpacing: '0.05em',
            }}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id} style={{ background: 'var(--bg-overlay)' }}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Nuovo cliente */}
          <ReadonlyGuard>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setView('new')}
              icon="+"
            >
              {terminology?.newMember ?? 'Nuovo cliente'}
            </Button>
          </ReadonlyGuard>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div
        style={{
          display:  'flex',
          flex:     1,
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* Sidebar filtri — desktop */}
        <div
          className="hidden lg:block"
          style={{
            borderRight: '1px solid var(--border-subtle)',
            padding:     '24px 20px',
            overflowY:   'auto',
            flexShrink:  0,
            width:       260,
          }}
        >
          <FiltersSidebar
            filters={filters}
            onChange={setFilters}
            clientCount={clients.length}
            filteredCount={filtered.length}
          />
        </div>

        {/* Lista */}
        <div
          style={{
            flex:      1,
            overflowY: 'auto',
            padding:   '24px',
          }}
        >
          {/* Mobile: bottone filtri */}
          <MobileControls
            filters={filters}
            onChange={setFilters}
            clientCount={clients.length}
            filteredCount={filtered.length}
            sort={sort}
            onSortChange={setSort}
          />

          {error && (
            <div
              style={{
                padding:      '10px 14px',
                background:   'rgba(240,82,82,0.08)',
                border:       '1px solid rgba(240,82,82,0.2)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 16,
                fontSize:     13,
                color:        '#f05252',
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap:                 12,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonClientCard key={i} />
              ))}
            </div>
          ) : paginatedItems.length === 0 ? (
            <EmptyState
              {...(search || Object.values(filters).some(Boolean)
                ? EMPTY_STATES.results
                : {
                    ...EMPTY_STATES.clients,
                    action: {
                      label:   `+ ${terminology?.newMember ?? 'Nuovo cliente'}`,
                      onClick: () => setView('new'),
                    },
                  }
              )}
            />
          ) : (
            <>
              <div
                className="stagger"
                style={{
                  display:             'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap:                 12,
                  marginBottom:        20,
                }}
              >
                {paginatedItems.map(client => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onClick={() => handleClientClick(client)}
                  />
                ))}
              </div>
              <Pagination {...pagination} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
