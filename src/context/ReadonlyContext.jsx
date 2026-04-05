import { createContext, useContext } from 'react'

const ReadonlyContext = createContext(false)

export const ReadonlyProvider = ({ readonly, children }) => (
  <ReadonlyContext.Provider value={readonly}>
    {children}
  </ReadonlyContext.Provider>
)

export const useReadonly = () => useContext(ReadonlyContext)
