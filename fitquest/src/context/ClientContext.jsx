import { createContext, useContext, useReducer, useCallback } from 'react'

// ─── State shape ─────────────────────────────────────────────────────────────
// {
//   clients: Client[],
//   selectedClient: Client | null,
//   loading: boolean,
//   error: string | null,
// }

const initialState = {
  clients:        [],
  selectedClient: null,
  loading:        false,
  error:          null,
}

// ─── Action types ─────────────────────────────────────────────────────────────
export const ACTIONS = {
  SET_LOADING:      'SET_LOADING',
  SET_ERROR:        'SET_ERROR',
  SET_CLIENTS:      'SET_CLIENTS',
  ADD_CLIENT:       'ADD_CLIENT',
  UPDATE_CLIENT:    'UPDATE_CLIENT',
  SELECT_CLIENT:    'SELECT_CLIENT',
  DESELECT_CLIENT:  'DESELECT_CLIENT',
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function clientReducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: payload, error: null }

    case ACTIONS.SET_ERROR:
      return { ...state, error: payload, loading: false }

    case ACTIONS.SET_CLIENTS:
      return { ...state, clients: payload, loading: false }

    case ACTIONS.ADD_CLIENT:
      return { ...state, clients: [...state.clients, payload] }

    case ACTIONS.UPDATE_CLIENT: {
      const updated = state.clients.map(c => c.id === payload.id ? { ...c, ...payload } : c)
      // Se il client aggiornato è quello selezionato, aggiornalo anche lì
      const selectedClient =
        state.selectedClient?.id === payload.id
          ? { ...state.selectedClient, ...payload }
          : state.selectedClient
      return { ...state, clients: updated, selectedClient }
    }

    case ACTIONS.SELECT_CLIENT:
      return { ...state, selectedClient: payload }

    case ACTIONS.DESELECT_CLIENT:
      return { ...state, selectedClient: null }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ClientStateContext   = createContext(null)
const ClientDispatchContext = createContext(null)

export function ClientProvider({ children }) {
  const [state, dispatch] = useReducer(clientReducer, initialState)

  return (
    <ClientStateContext.Provider value={state}>
      <ClientDispatchContext.Provider value={dispatch}>
        {children}
      </ClientDispatchContext.Provider>
    </ClientStateContext.Provider>
  )
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useClientState() {
  const ctx = useContext(ClientStateContext)
  if (!ctx) throw new Error('useClientState must be used within ClientProvider')
  return ctx
}

export function useClientDispatch() {
  const ctx = useContext(ClientDispatchContext)
  if (!ctx) throw new Error('useClientDispatch must be used within ClientProvider')
  return ctx
}
