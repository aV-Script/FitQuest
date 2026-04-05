import { useGroups }         from '../../hooks/useGroups'
import { ConfirmDialog }     from '../../components/common/ConfirmDialog'
import { useWizard }         from '../../components/modals/new-client-wizard/useWizard'
import { WizardProgress }    from '../../components/modals/new-client-wizard/WizardProgress'
import { WizardNav }         from '../../components/modals/new-client-wizard/WizardNav'
import { StepAnagrafica }    from '../../components/modals/new-client-wizard/steps/StepAnagrafica'
import { StepCategoria }     from '../../components/modals/new-client-wizard/steps/StepCategoria'
import { StepRuolo }         from '../../components/modals/new-client-wizard/steps/StepRuolo'
import { StepAccount }       from '../../components/modals/new-client-wizard/steps/StepAccount'
import { StepProfileType }   from '../../components/modals/new-client-wizard/steps/StepProfileType'
import { TOTAL_STEPS_MAP }   from '../../components/modals/new-client-wizard/wizard.config'
import { useTrainerState }   from '../../context/TrainerContext'
import { Card }              from '../../components/ui'

export function NewClientView({ orgId, onAdd, onBack }) {
  const { moduleType }                                 = useTrainerState()
  const { groups, handleAddGroup, handleToggleClient } = useGroups(orgId)

  const wizard = useWizard({
    moduleType,
    orgId,
    groups,
    onAdd,
    onClose:             onBack,
    onAddGroup:          handleAddGroup,
    onToggleClientGroup: handleToggleClient,
  })

  const totalSteps = wizard.isSoccer
    ? TOTAL_STEPS_MAP.soccer_academy
    : (TOTAL_STEPS_MAP[wizard.profileType] ?? TOTAL_STEPS_MAP.tests_only)

  return (
    <div className="min-h-screen text-white">

      <div className="flex items-center justify-between px-6 py-4 border-b [border-color:var(--border-subtle)]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 bg-transparent border-none text-white/30 font-body text-[13px] cursor-pointer hover:text-white/60 transition-colors p-0"
        >
          ‹ Clienti
        </button>
        <span className="font-display font-black text-[16px] text-white">
          Nuovo cliente
        </span>
        <div className="w-24" />
      </div>

      <div className="max-w-lg mx-auto w-full px-6 py-8 flex flex-col gap-5">
        <WizardProgress
          step={wizard.step}
          totalSteps={totalSteps}
          title={wizard.stepTitle}
          progressPct={wizard.progressPct}
        />

        <Card padding="lg">
          <StepContent wizard={wizard} />
        </Card>

        <WizardNav
          step={wizard.step}
          isLastStep={wizard.isLastStep}
          loading={wizard.isLoading}
          onPrev={wizard.prev}
          onNext={wizard.next}
          onSubmit={wizard.handleRequestSubmit}
        />
      </div>

      {wizard.showConfirm && (
        <ConfirmDialog
          title="Creare il cliente?"
          description={`Stai per creare l'account per ${wizard.anagrafica.name}.`}
          confirmLabel="CREA CLIENTE"
          loading={wizard.isLoading}
          onConfirm={wizard.handleConfirmSubmit}
          onCancel={() => wizard.setShowConfirm(false)}
        />
      )}
    </div>
  )
}

function StepContent({ wizard }) {
  const { currentStep } = wizard

  if (currentStep?.type === 'anagrafica') return (
    <StepAnagrafica
      anagrafica={wizard.anagrafica}
      setAnagrafica={wizard.setAnagrafica}
      errors={wizard.errors}
    />
  )

  if (currentStep?.type === 'profileType') return (
    <StepProfileType
      profileType={wizard.profileType}
      setProfileType={wizard.setProfileType}
    />
  )

  if (currentStep?.type === 'categoria') return (
    <StepCategoria
      categoria={wizard.categoria}
      setCategoria={wizard.setCategoria}
    />
  )

  if (currentStep?.type === 'ruolo') return (
    <StepRuolo
      ruolo={wizard.ruolo}
      setRuolo={wizard.setRuolo}
    />
  )

  if (currentStep?.type === 'account') return (
    <StepAccount
      account={wizard.account}
      setAccount={wizard.setAccount}
      errors={wizard.errors}
      anagrafica={wizard.anagrafica}
      categoria={wizard.categoria}
      rankObj={wizard.rankObj}
      media={wizard.media}
    />
  )

  return null
}
