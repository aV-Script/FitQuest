import { Button } from '../../ui'

/**
 * Navigazione wizard — bottoni indietro e avanti/crea.
 */
export function WizardNav({ step, isLastStep, loading, onPrev, onNext, onSubmit }) {
  return (
    <div className={`flex gap-3 ${step === 0 ? 'justify-end' : 'justify-between'}`}>
      {step > 0 && (
        <Button variant="ghost" onClick={onPrev}>
          ‹ INDIETRO
        </Button>
      )}
      {isLastStep ? (
        <Button variant="primary" className="flex-1" loading={loading} onClick={onSubmit}>
          CREA CLIENTE
        </Button>
      ) : (
        <Button variant="primary" className="flex-1" onClick={onNext}>
          AVANTI ›
        </Button>
      )}
    </div>
  )
}
