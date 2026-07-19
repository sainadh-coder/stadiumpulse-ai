/**
 * Volunteer Copilot turns live stadium conditions into shift-ready briefings and multilingual
 * assistance for frontline tournament volunteers.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { ClipboardList, Languages, LoaderCircle, RefreshCw } from 'lucide-react'
import { useApp } from '../context/useApp'
import { askGemini, sanitizeUserInput } from '../lib/gemini'
import LiveBadge from '../components/LiveBadge'
import SectionCard from '../components/SectionCard'

export default function Volunteer() {
  const { sim, language } = useApp()
  const [briefing, setBriefing] = useState('')
  const [busy, setBusy] = useState(false)
  const [phrase, setPhrase] = useState('Welcome! How can I help you today?')
  const [translation, setTranslation] = useState('')
  const [cooldown, setCooldown] = useState(false)
  const startCooldown = useCallback(() => {
    setCooldown(true)
    window.setTimeout(() => setCooldown(false), 1200)
  }, [])
  const makeBriefing = useCallback(async () => {
    if (busy || cooldown) return
    setBusy(true)
    startCooldown()
    const response = await askGemini(
      `You are a stadium volunteer supervisor. Create a 4–6 bullet shift briefing in ${language}. Prioritize safety, empathy, and concrete action.`,
      { phase: sim.phase, occupancy: sim.occupancy, incidents: sim.incidents, gates: sim.gates },
      120
    )
    setBriefing(response)
    setBusy(false)
  }, [busy, cooldown, language, sim.gates, sim.incidents, sim.occupancy, sim.phase, startCooldown])
  const translate = useCallback(async () => {
    if (busy || cooldown) return
    setBusy(true)
    startCooldown()
    const response = await askGemini(
      `Translate the text data between <phrase> tags into ${language}: <phrase>${sanitizeUserInput(phrase)}</phrase>. Give the translation and then a simple Latin-script phonetic pronunciation guide. Keep it friendly and compact.`,
      {},
      80
    )
    setTranslation(response)
    setBusy(false)
  }, [busy, cooldown, language, phrase, startCooldown])
  const briefingRequested = useRef(false)
  useEffect(() => {
    if (!briefingRequested.current) {
      briefingRequested.current = true
      makeBriefing()
    }
  }, [makeBriefing])

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
      <header className="mb-7 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700">Serve with confidence</p>
          <h1 className="display mt-1 text-4xl">Volunteer Copilot</h1>
        </div>
        <LiveBadge label={`${sim.incidents.length} active updates`} />
      </header>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="space-y-5">
          <SectionCard className="!p-6" labelledBy="briefing-heading">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-pitch text-amber-200">
                  <ClipboardList size={20} />
                </span>
                <div>
                  <h2 id="briefing-heading" className="font-bold">
                    Today’s briefing
                  </h2>
                  <p className="text-xs text-slate-600">AI summary in {language}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={makeBriefing}
                aria-label="Refresh today's briefing"
                disabled={busy || cooldown}
                className="rounded-xl bg-emerald-50 p-2 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-pitch disabled:opacity-60"
              >
                <RefreshCw size={18} />
              </button>
            </div>
            <div
              className="mt-5 whitespace-pre-line rounded-2xl bg-mist p-4 text-sm leading-7 text-slate-700"
              aria-live="polite"
            >
              {busy && !briefing ? <LoaderCircle className="animate-spin" /> : briefing}
            </div>
          </SectionCard>
          <section className="rounded-3xl bg-ink p-6 text-white" aria-labelledby="translate-heading">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-ink">
                <Languages size={20} />
              </span>
              <div>
                <h2 id="translate-heading" className="font-bold">
                  Quick Translate
                </h2>
                <p className="text-xs text-slate-200">Speak clearly, help instantly.</p>
              </div>
            </div>
            <label htmlFor="translation-phrase" className="sr-only">
              Phrase to translate
            </label>
            <textarea
              id="translation-phrase"
              value={phrase}
              maxLength={500}
              onChange={(event) => setPhrase(event.target.value)}
              className="mt-5 h-24 w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none ring-amber-300 focus:ring-2"
            />
            <button
              type="button"
              onClick={translate}
              disabled={busy || cooldown || !phrase.trim()}
              className="mt-3 rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-ink focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-60"
            >
              Translate to {language}
            </button>
            {translation && (
              <div
                className="mt-4 rounded-xl border border-white/10 bg-white/10 p-4 text-sm leading-7"
                aria-live="polite"
              >
                {translation}
              </div>
            )}
          </section>
        </div>
        <SectionCard labelledBy="incident-feed-heading" live>
          <div className="flex items-center justify-between">
            <h2 id="incident-feed-heading" className="font-bold">
              Live incident feed
            </h2>
            <LiveBadge />
          </div>
          <div className="mt-4 space-y-3">
            {sim.incidents.map((incident) => (
              <article key={incident.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${incident.severity === 'high' ? 'bg-rose-100 text-rose-700' : incident.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-700'}`}
                  >
                    {incident.severity}
                  </span>
                  <span className="text-xs text-slate-500">{incident.time}</span>
                </div>
                <h3 className="mt-2 text-sm font-bold">{incident.title}</h3>
                <p className="mt-1 text-xs font-semibold text-emerald-800">{incident.zone}</p>
                <p className="mt-2 text-sm leading-5 text-slate-600">{incident.detail}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </main>
  )
}
