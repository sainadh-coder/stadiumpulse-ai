# StadiumPulse AI

StadiumPulse AI is a GenAI-enabled FIFA World Cup 2026 operations platform for PromptWars Virtual Challenge 4. It improves **navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, and real-time decision support** for fans, volunteers, and venue teams.

## Solution

One shared simulated live-data layer powers three role-specific copilots: Fan Copilot, Volunteer Copilot, and Organizer Dashboard. Gemini responses are grounded in the current stadium snapshot and the selected language.

| Problem-statement focus area | Working StadiumPulse feature                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Navigation                   | Fan Copilot generates practical gate directions and numbered, time-ordered itinerary cues.                       |
| Crowd management             | Organizer heatmap and alerts explicitly identify crowd-management pressure by gate and zone.                     |
| Accessibility                | Fan prompts and itinerary inputs support accessible entrances, quiet rooms, and access needs.                    |
| Transportation               | Fan Copilot's **Plan my transit** action recommends shuttle, metro, or rideshare using the least-congested gate. |
| Sustainability               | Fan Copilot's **Get Green Score tip** action gives contextual public-transit, refill, or recycling guidance.     |
| Multilingual assistance      | Selected language is passed to Fan responses, Volunteer briefings, and translation requests.                     |
| Operational intelligence     | Organizer's Operational Intelligence query turns live telemetry into grounded recommendations.                   |
| Real-time decision support   | Threshold alerts state a suggested reroute action and expected queue relief.                                     |

## Architecture

```text
React + Tailwind interface
        ↓
App Context (language, role, shared live simulation state)
        ↓
simulationEngine.js → gates / zones / incidents / occupancy history
        ↓                         ↓
stadiumKnowledgeBase.json     Gemini via @google/genai
```

The browser-only MVP stores only selected role and language in `localStorage`. No sensitive data or database is used.

## Performance & Code Quality

- Role pages are code-split with `React.lazy` and `Suspense`, keeping the landing-page bundle smaller.
- Derived gate and critical-gate data use `useMemo`; repeated action handlers use `useCallback`; the context value is memoized.
- The simulation advances one immutable snapshot every five seconds and cleans up its interval on unmount.
- Shared `SectionCard`, `LiveBadge`, and `ErrorBoundary` components reduce duplicated dashboard markup and isolate role failures.
- ESLint/Prettier configuration, JSDoc API/prop documentation, deterministic simulation helpers, and `CONTRIBUTING.md` define maintainable project standards.

## Tech stack

- React + Vite + Tailwind CSS
- Google Gemini API (`@google/genai`)
- Recharts and lucide-react
- Vitest + Testing Library

## Run locally

1. Install Node.js 18+.
2. Copy `.env.example` to `.env` and add `VITE_GEMINI_API_KEY=your_key`.
3. Run `npm install`, then `npm run dev`.

An absent or invalid key renders a safe in-app configuration message; the role pages remain usable with simulated telemetry.

## Verification commands

```bash
npm run lint
npm test
npm run build
```

## Security

User text is sanitized and length-limited before it enters a prompt, AI actions have a short client-side cooldown, and configuration errors are presented without technical secrets. See [SECURITY.md](SECURITY.md) for the MVP data-safety boundaries.

## Deploy to Vercel

Push this folder to GitHub, import it into Vercel, and set `VITE_GEMINI_API_KEY` in Project Settings → Environment Variables. `vercel.json` supplies the SPA fallback.
