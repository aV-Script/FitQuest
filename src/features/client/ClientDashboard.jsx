import { useState, useCallback, useMemo } from 'react'
import { useClients }                     from '../../hooks/useClients'
import { useBia }                         from '../bia/useBia'
import { DashboardHeader }               from './client-dashboard/DashboardHeader'
import { DashboardTabNav }               from './client-dashboard/DashboardTabNav'
import { PanoramicaTab }                 from './client-dashboard/tabs/PanoramicaTab'
import { StatisticheTab }                from './client-dashboard/tabs/StatisticheTab'
import { BiaTab }                        from './client-dashboard/tabs/BiaTab'
import { BiaLockedPanel }                from '../bia/BiaLockedPanel'
import { UpgradeCategoryBanner }         from '../bia/UpgradeCategoryBanner'
import { CampionamentoView }             from './CampionamentoView'
import { BiaView }                       from '../bia/BiaView'
import { ConfirmDialog }                 from '../../components/common/ConfirmDialog'
import { useClientRank }                 from '../../hooks/useClientRank'
import { getProfileCategory }            from '../../constants/bia'

/**
 * ClientDashboard — vista completa di un cliente.
 * Entry point dal TrainerView quando un cliente è selezionato.
 */
export function ClientDashboard({
  client,
  orgId,
  slots     = [],
  moduleType,
  readonly,
  onBack,
  // Legacy props da TrainerView (non più usate internamente, mantenute per compatibilità)
  onCampionamento: _onCampionamento,
  onDelete:        _onDelete,
}) {
  const { handleCampionamento, handleDeleteClient } = useClients(orgId)
  const { handleSaveBia, handleUpgradeProfile }     = useBia(orgId)
  const { color }                                   = useClientRank(client)

  const profile = getProfileCategory(client.profileType ?? 'tests_only')

  // ── Stato navigazione ──────────────────────────────────────
  const [view,       setView]       = useState('dashboard') // 'dashboard' | 'campionamento' | 'bia'
  const [activeTab,  setActiveTab]  = useState('panoramica')
  const [showDelete, setShowDelete] = useState(false)
  const [deleting,   setDeleting]   = useState(false)

  // ── Tab config (dinamico per profilo) ──────────────────────
  const tabs = useMemo(() => {
    const base = [
      { id: 'panoramica',  label: 'Panoramica', icon: '◈' },
      { id: 'statistiche', label: 'Statistiche', icon: '📊',
        count: client.campionamenti?.length ?? 0,
      },
    ]
    if (profile.hasBia) {
      base.push({
        id:    'bia',
        label: 'BIA',
        icon:  '⚡',
        count: client.biaHistory?.length ?? 0,
      })
    }
    return base
  }, [profile.hasBia, client.campionamenti?.length, client.biaHistory?.length])

  // ── Handlers ───────────────────────────────────────────────
  const handleConfirmDelete = useCallback(async () => {
    setDeleting(true)
    try {
      await handleDeleteClient(client.id)
      onBack?.()
    } finally {
      setDeleting(false)
      setShowDelete(false)
    }
  }, [client.id, handleDeleteClient, onBack])

  const handleSaveCampionamento = useCallback(async (newStats, testValues) => {
    await handleCampionamento(client, newStats, testValues)
  }, [client, handleCampionamento])

  const handleSaveBiaData = useCallback(async (biaData) => {
    await handleSaveBia(client, biaData)
  }, [client, handleSaveBia])

  // ── View inline: campionamento ─────────────────────────────
  if (view === 'campionamento') {
    return (
      <CampionamentoView
        client={client}
        color={color}
        onSave={handleSaveCampionamento}
        onBack={() => setView('dashboard')}
        moduleType={moduleType}
      />
    )
  }

  // ── View inline: BIA ───────────────────────────────────────
  if (view === 'bia') {
    return (
      <BiaView
        client={client}
        color={color}
        onSave={handleSaveBiaData}
        onBack={() => setView('dashboard')}
      />
    )
  }

  // ── Dashboard principale ───────────────────────────────��───
  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        height:        '100%',
        overflow:      'hidden',
      }}
    >
      {/* Header hero */}
      <DashboardHeader
        client={client}
        onBack={onBack}
        onCampionamento={() => setView('campionamento')}
        onBia={() => setView('bia')}
        onDelete={() => setShowDelete(true)}
        moduleType={moduleType}
        readonly={readonly}
      />

      {/* Banner upgrade (se profilo incompleto) */}
      <UpgradeCategoryBanner
        client={client}
        color={color}
        onUpgrade={handleUpgradeProfile}
      />

      {/* Tab navigation */}
      <DashboardTabNav
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Contenuto tab — scrollabile */}
      <div
        style={{
          flex:               1,
          overflowY:          'auto',
          overscrollBehavior: 'contain',
        }}
      >
        {activeTab === 'panoramica' && (
          <PanoramicaTab client={client} color={color} slots={slots} />
        )}

        {activeTab === 'statistiche' && (
          profile.hasTests ? (
            <StatisticheTab
              client={client}
              color={color}
              onCampionamento={() => setView('campionamento')}
            />
          ) : (
            <BiaLockedPanel profileType={client.profileType} color={color} />
          )
        )}

        {activeTab === 'bia' && profile.hasBia && (
          <BiaTab
            client={client}
            color={color}
            onBia={() => setView('bia')}
          />
        )}
      </div>

      {/* Dialog elimina */}
      {showDelete && (
        <ConfirmDialog
          title={`Eliminare ${client.name}?`}
          description="Tutti i dati del cliente verranno eliminati definitivamente. Questa azione non può essere annullata."
          confirmLabel="ELIMINA"
          destructive
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  )
}
