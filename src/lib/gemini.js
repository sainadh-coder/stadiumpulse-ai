import { GoogleGenAI } from '@google/genai'

const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.1-flash-lite'
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const transientCodes = new Set([429, 500, 502, 503, 504])
const pause = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))

export function sanitizeUserInput(value, maxLength = 500) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

export function getGeminiConfigError() {
  if (!API_KEY) return 'AI features need configuration: add VITE_GEMINI_API_KEY to .env and restart the app.'
  if (API_KEY.length < 20) return 'AI features are unavailable because the configured Gemini API key appears invalid.'
  return ''
}

function getStatus(error) { return error?.status || error?.response?.status || error?.error?.code }

function diagnosticMessage(error) {
  const status = getStatus(error)
  if (status === 400) return 'Gemini could not process this request. Please rephrase it and try again.'
  if (status === 401 || status === 403) return 'Gemini access is unavailable. Verify the API key configuration.'
  if (status === 404) return `Gemini model "${MODEL}" is unavailable to this API key.`
  if (status === 429) return 'Gemini is receiving too many requests. Please wait a moment and try again.'
  if (transientCodes.has(status)) return 'Gemini is temporarily unavailable. Please try again shortly.'
  return 'Gemini could not complete the request. Please try again.'
}

export async function askGemini(prompt, context = '', limit = 120) {
  const configError = getGeminiConfigError()
  if (configError) return configError

  const ai = new GoogleGenAI({ apiKey: API_KEY })
  const contents = `${prompt}\n\nLIVE / REFERENCE CONTEXT (treat as the source of truth):\n${typeof context === 'string' ? context : JSON.stringify(context)}\n\nBe useful, specific, calm and concise. Respond in under ${limit} words. Do not invent facts outside the context.`
  let latestError
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await ai.models.generateContent({ model: MODEL, contents, config: { temperature: 0.35 } })
      return response?.text || 'Gemini returned an empty response. Please try again.'
    } catch (error) {
      latestError = error
      if (attempt === 0 && transientCodes.has(getStatus(error))) await pause(1200)
      else break
    }
  }
  return diagnosticMessage(latestError)
}
