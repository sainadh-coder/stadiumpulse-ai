/** Returns the shared StadiumPulse application state and actions for role components. */
import { useContext } from 'react'
import { AppContext } from './AppContext'

/** @returns {object} Shared application state and role actions. */
export const useApp = () => useContext(AppContext)
