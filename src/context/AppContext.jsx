import { createContext, useContext, useEffect, useState } from 'react'
import { createInitialState, nextSimulation } from '../lib/simulationEngine'
const AppContext = createContext()
export function AppProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('sp-language') || 'English')
  const [role, setRoleState] = useState(() => localStorage.getItem('sp-role') || 'fan')
  const [sim, setSim] = useState(createInitialState)
  const setLanguage = (x) => { localStorage.setItem('sp-language', x); setLanguageState(x) }
  const setRole = (x) => { localStorage.setItem('sp-role', x); setRoleState(x) }
  useEffect(() => { const id = setInterval(() => setSim(nextSimulation), 5000); return () => clearInterval(id) }, [])
  return <AppContext.Provider value={{ language, setLanguage, role, setRole, sim }}>{children}</AppContext.Provider>
}
export const useApp = () => useContext(AppContext)
