import { createContext, useContext, useReducer } from 'react'

// ── Azioni ────────────────────────────────────────────────────────────────────
export const ACTIONS = Object.freeze({
  SELECT_CLIENT:   'SELECT_CLIENT',
  DESELECT_CLIENT: 'DESELECT_CLIENT',
  UPDATE_CLIENT:   'UPDATE_CLIENT',
  SET_ORG_CONTEXT: 'SET_ORG_CONTEXT',
})

// ── Stato iniziale ────────────────────────────────────────────────────────────
const initialState = {
  selectedClient: null,
  orgId:          null,
  moduleType:     null,
  terminology:    null,
  userRole:       null,
}

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SELECT_CLIENT:
      return { ...state, selectedClient: payload }

    case ACTIONS.DESELECT_CLIENT:
      return { ...state, selectedClient: null }

    case ACTIONS.UPDATE_CLIENT:
      return {
        ...state,
        selectedClient: state.selectedClient?.id === payload.id
          ? { ...state.selectedClient, ...payload }
          : state.selectedClient,
      }

    case ACTIONS.SET_ORG_CONTEXT:
      return {
        ...state,
        orgId:       payload.orgId,
        moduleType:  payload.moduleType,
        terminology: payload.terminology,
        userRole:    payload.userRole,
      }

    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const StateCtx    = createContext(null)
const DispatchCtx = createContext(null)

// ── Provider ──────────────────────────────────────────────────────────────────
export function TrainerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>
        {children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

// ── Hook consumers ────────────────────────────────────────────────────────────
export function useTrainerState() {
  const ctx = useContext(StateCtx)
  if (!ctx) throw new Error('useTrainerState deve essere usato dentro <TrainerProvider>')
  return ctx
}

export function useTrainerDispatch() {
  const ctx = useContext(DispatchCtx)
  if (!ctx) throw new Error('useTrainerDispatch deve essere usato dentro <TrainerProvider>')
  return ctx
}
