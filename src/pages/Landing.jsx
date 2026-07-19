/**
 * Landing introduces StadiumPulse's three role-specific experiences and routes users into
 * the appropriate live copilot without duplicating role-page operational logic.
 */
import { Link } from 'react-router-dom'
import { Users, Headphones, ShieldCheck, ArrowRight, Sparkles, Trophy, Goal, Flag, MapPin } from 'lucide-react'
import { useApp } from '../context/useApp'

const cards = [
  {
    to: '/fan',
    icon: Headphones,
    title: 'Fan Copilot',
    copy: 'A calm, multilingual match-day companion — from gate to final whistle.',
    tone: 'bg-gold'
  },
  {
    to: '/volunteer',
    icon: Users,
    title: 'Volunteer Copilot',
    copy: 'Brief, translate and serve every fan with confidence in the moment.',
    tone: 'bg-sky-500'
  },
  {
    to: '/organizer',
    icon: ShieldCheck,
    title: 'Organizer Command',
    copy: 'Turn live stadium signals into clear, decisive operational action.',
    tone: 'bg-pitch'
  }
]
export default function Landing() {
  const { language, setLanguage, setRole } = useApp()
  return (
    <main>
      <section
        className="stadium-sky relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-24"
        aria-label="Cinematic football stadium background"
      >
        <div className="absolute -left-5 bottom-0 h-28 w-[110%] rotate-[-2deg] rounded-t-[50%] pitch-lines opacity-95" />
        <div className="absolute right-[11%] top-16 hidden football float lg:block" aria-hidden="true" />
        <div className="absolute left-[8%] top-44 hidden text-gold/70 lg:block" aria-hidden="true">
          <Trophy size={50} strokeWidth={1.3} />
        </div>
        <header className="relative mx-auto max-w-6xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-pitch shadow-sm">
            <Sparkles size={14} className="text-amber-700" /> FIFA World Cup 2026 Operations
          </div>
          <h1 className="display mx-auto max-w-4xl text-5xl leading-[1.05] text-white sm:text-7xl">
            Every fan moment.
            <br />
            <span className="text-[#7fffe0]">Perfectly in play.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white sm:text-lg">
            StadiumPulse AI connects the people who experience, power and protect tournament day — with one intelligent
            live pulse.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-pitch px-4 py-2 text-sm font-bold text-white shadow-lg shadow-pitch/20">
              <span className="live-dot" /> Live simulated stadium
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-pitch/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              <MapPin size={15} className="text-amber-700" /> 68,500 seat venue
            </span>
          </div>
        </header>
      </section>
      <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-5 sm:px-8" aria-labelledby="role-heading">
        <div className="glass rounded-[2rem] p-5 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700">Choose your experience</p>
              <h2 id="role-heading" className="display mt-1 text-3xl text-ink">
                Select your role
              </h2>
            </div>
            <label htmlFor="landing-language" className="sr-only">
              Display language
            </label>
            <select
              id="landing-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border border-pitch/15 bg-white px-4 py-2 text-sm font-semibold text-pitch outline-none focus:ring-2 focus:ring-pitch"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>Portuguese</option>
              <option>French</option>
              <option>Hindi</option>
              <option>Arabic</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map(({ to, icon: Icon, title, copy, tone }, i) => (
              <Link
                onClick={() => setRole(to.slice(1))}
                to={to}
                key={title}
                className="card-shine group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-pitch"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${tone} text-white`}>
                    <Icon size={23} />
                  </div>
                  {i === 0 ? (
                    <Goal size={20} className="text-pitch/50" />
                  ) : i === 1 ? (
                    <Flag size={20} className="text-sky-600/70" />
                  ) : (
                    <Trophy size={20} className="text-amber-700" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-ink">{title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{copy}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-pitch">
                  Enter experience <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
