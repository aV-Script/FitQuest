/**
 * Configurazione degli step del wizard.
 *
 * PT/GYM:
 *   anagrafica → profileType → [categoria se tests] → account
 *
 * Soccer:
 *   anagrafica → ruolo → account
 *   (categoria è sempre 'soccer', profileType sempre 'tests_only')
 */

const PT_BASE_STEPS = [
  { type: 'anagrafica',  title: 'Dati anagrafici' },
  { type: 'profileType', title: 'Tipologia profilo' },
]

const PT_CATEGORIA_STEP = [
  { type: 'categoria', title: 'Categoria test' },
]

const TAIL_STEPS = [
  { type: 'account', title: 'Account cliente' },
]

const SOCCER_STEPS = [
  { type: 'anagrafica', title: 'Dati anagrafici' },
  { type: 'ruolo',      title: 'Ruolo in campo' },
  { type: 'account',    title: 'Account' },
]

export function getWizardSteps(profileType = 'tests_only', moduleType = 'personal_training') {
  if (moduleType === 'soccer_academy') return SOCCER_STEPS
  if (profileType === 'bia_only')      return [...PT_BASE_STEPS, ...TAIL_STEPS]
  return                                      [...PT_BASE_STEPS, ...PT_CATEGORIA_STEP, ...TAIL_STEPS]
}

export const TOTAL_STEPS_MAP = {
  tests_only:     PT_BASE_STEPS.length + PT_CATEGORIA_STEP.length + TAIL_STEPS.length,
  bia_only:       PT_BASE_STEPS.length + TAIL_STEPS.length,
  complete:       PT_BASE_STEPS.length + PT_CATEGORIA_STEP.length + TAIL_STEPS.length,
  soccer_academy: SOCCER_STEPS.length,
}

// Compatibilità con codice esistente
export const WIZARD_STEPS = getWizardSteps('tests_only')
export const TOTAL_STEPS  = TOTAL_STEPS_MAP.tests_only
