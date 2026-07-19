/**
 * AppContext owns language, selected role, and the single shared simulation snapshot.
 * It deliberately advances simulation state in one update so consumers do not receive partial telemetry.
 */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { createInitialState, nextSimulation } from '../lib/simulationEngine'
export const AppContext = createContext()
/** @typedef {{ children: import('react').ReactNode }} AppProviderProps */

/** @param {AppProviderProps} props */
export function AppProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('sp-language') || 'English')
  const [role, setRoleState] = useState(() => localStorage.getItem('sp-role') || 'fan')
  const [sim, setSim] = useState(createInitialState)
  const setLanguage = useCallback((value) => {
    localStorage.setItem('sp-language', value)
    setLanguageState(value)
  }, [])
  const setRole = useCallback((value) => {
    localStorage.setItem('sp-role', value)
    setRoleState(value)
  }, [])
  useEffect(() => {
    const id = setInterval(() => setSim(nextSimulation), 5000)
    return () => clearInterval(id)
  }, [])
  const value = useMemo(
    () => ({ language, setLanguage, role, setRole, sim }),
    [language, setLanguage, role, setRole, sim]
  )
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
