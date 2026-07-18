import { GoogleGenAI } from '@google/genai'

const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.1-flash-lite'
const transientCodes = new Set([429, 500, 502, 503, 504])
const pause = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))

function getStatus(error) {
  return error?.status || error?.response?.status || error?.error?.code
}

function diagnosticMessage(error) {
  const status = getStatus(error)
  const detail = error?.message || 'No error detail was returned by Gemini.'
  if (status === 400) return `Gemini rejected this request (400): ${detail}`
  if (status === 401 || status === 403) return `Gemini permission denied (${status}). Check that this API key is valid and allowed for Gemini API access. ${detail}`
  if (status === 404) return `Gemini model "${MODEL}" was not found or is unavailable to this key (404). ${detail}`
  if (status === 429) return `Gemini quota is currently exhausted (429). ${detail}`
  if (status === 500 || status === 502 || status === 503 || status === 504) return `Gemini is temporarily unavailable (${status}). Please retry in a moment. ${detail}`
  return `Gemini request failed${status ? ` (${status})` : ''}: ${detail}`
}

export async function askGemini(prompt, context = '', limit = 120) {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  console.log('Gemini key present:', Boolean(key))
  console.log('Gemini key length:', key?.length)
  console.log('Gemini model:', MODEL)
  if (!key) return 'Gemini API key missing. Add VITE_GEMINI_API_KEY to .env and restart Vite.'
  if (key.length < 20) return 'Gemini API key appears invalid: the configured key is too short.'

  const ai = new GoogleGenAI({ apiKey: key })
  const contents = `${prompt}\n\nLIVE / REFERENCE CONTEXT (treat as the source of truth):\n${typeof context === 'string' ? context : JSON.stringify(context)}\n\nBe useful, specific, calm and concise. Respond in under ${limit} words. Do not invent facts outside the context.`
  let latestError
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await ai.models.generateContent({ model: MODEL, contents, config: { temperature: 0.35 } })
      if (!response?.text) return 'Gemini returned an invalid response with no text content.'
      return response.text
    } catch (error) {
      latestError = error
      const status = getStatus(error)
      console.error(`Gemini request failed (attempt ${attempt + 1}, status ${status ?? 'unknown'}):`, error)
      if (attempt === 0 && transientCodes.has(status)) await pause(1200)
      else break
    }
  }
  return diagnosticMessage(latestError)
}
