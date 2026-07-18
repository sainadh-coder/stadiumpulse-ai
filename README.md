# StadiumPulse AI

StadiumPulse AI is a GenAI-powered operations and fan-experience platform designed for FIFA World Cup 2026 venues and the PromptWars Virtual Challenge 4: **Smart Stadiums & Tournament Operations**.

## Problem

Tournament stadiums must coordinate thousands of fans, volunteers and operators at once. Information is fragmented, queue conditions change quickly, and multilingual support is essential.

## Solution

One shared, simulated live-data layer powers three role-specific copilots:

- **Fan Copilot** — grounded multilingual guidance, gate queues and AI-made match-day itineraries.
- **Volunteer Copilot** — live incident briefings and face-to-face translation support.
- **Organizer Dashboard** — natural-language operational analysis, density heatmap, live alerts and occupancy trend.

## Architecture

```text
React + Tailwind interface
        ↓
App Context (language, role, live simulation state)
        ↓
simulationEngine.js → gates / zones / incidents / occupancy history
        ↓                         ↓
stadiumKnowledgeBase.json     Gemini 2.5 Flash via @google/genai
```

The browser-only MVP stores only selected role and language in `localStorage`. No sensitive data or database is used.

## Tech stack

- React + Vite
- Tailwind CSS
- Google Gemini API (`gemini-2.5-flash`) with `@google/genai`
- Recharts
- lucide-react
- Vercel-ready SPA configuration

## Simulation engine

`src/lib/simulationEngine.js` updates state every five seconds. It uses deterministic weighted patterns, rather than flat randomness: crowd pressure rises through arrival and kickoff, spikes at halftime, and declines during departure. Gates and zones have different pressure profiles, while incidents rotate through credible seed scenarios.

## Run locally

1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Add your Gemini key:

   ```env
   VITE_GEMINI_API_KEY=your_key
   ```

4. Run:

   ```bash
   npm install
   npm run dev
   ```

Open the localhost URL printed by Vite. Never commit `.env`.

## Deploy to Vercel

1. Push this folder to GitHub and import it into Vercel.
2. Set `VITE_GEMINI_API_KEY` in Vercel Project Settings → Environment Variables.
3. Deploy with the default Vite settings. `vercel.json` supplies the SPA fallback.

> This challenge prototype calls Gemini from the client as requested. For production, route AI calls through a protected server-side endpoint so the API key is never exposed to browser users.
