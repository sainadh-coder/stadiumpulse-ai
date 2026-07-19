/** Provides shared navigation, language selection, and AI configuration feedback. */
import { NavLink, useLocation } from 'react-router-dom'
import { Activity, ChevronDown } from 'lucide-react'
import { useApp } from '../context/useApp'
import { getGeminiConfigError } from '../lib/gemini'

const roles = [
  ['fan', 'Fan'],
  ['volunteer', 'Volunteer'],
  ['organizer', 'Organizer']
]

/** @typedef {{ children: import('react').ReactNode }} LayoutProps */
/** @param {LayoutProps} props */
export default function Layout({ children }) {
  const { language, setLanguage } = useApp()
  const location = useLocation()
  const aiConfigError = getGeminiConfigError()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-cyan-100/30 bg-[#04162e]/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-[#06203a] shadow-lg shadow-cyan-500/30">
              <Activity size={20} />
            </span>
            <span className="hidden sm:block">
              StadiumPulse <span className="text-gold">AI</span>
            </span>
          </NavLink>
          <nav className="flex rounded-full border border-white/15 bg-white/10 p-1">
            {roles.map(([to, label]) => (
              <NavLink
                key={to}
                to={'/' + to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-xs font-bold transition sm:px-4 sm:text-sm ${isActive || (to === 'fan' && location.pathname === '/') ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-[#06203a] shadow' : 'text-slate-200 hover:text-white'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="live-dot" />
            <span className="text-xs font-medium text-cyan-100">LIVE</span>
            <div className="relative">
              <label htmlFor="header-language" className="sr-only">
                Display language
              </label>
              <select
                id="header-language"
                aria-label="Display language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none rounded-full border border-white/15 bg-white/10 py-1.5 pl-3 pr-7 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-200"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>Portuguese</option>
                <option>French</option>
                <option>Hindi</option>
                <option>Arabic</option>
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 top-2 text-cyan-100" />
            </div>
          </div>
        </div>
      </header>
      {aiConfigError && (
        <aside
          role="alert"
          className="mx-auto mt-4 max-w-7xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
        >
          {aiConfigError}
        </aside>
      )}
      {children}
      <footer className="px-5 py-8 text-center text-xs">
        StadiumPulse AI · Gemini-powered live stadium copilots · Simulated operational data
      </footer>
    </div>
  )
}
