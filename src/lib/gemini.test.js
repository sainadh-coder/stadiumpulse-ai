import { beforeEach, describe, expect, it, vi } from 'vitest'

const generateContent = vi.fn()
vi.mock('@google/genai', () => ({ GoogleGenAI: vi.fn(() => ({ models: { generateContent } })) }))

describe('askGemini', () => {
  beforeEach(() => { vi.resetModules(); generateContent.mockReset(); vi.stubEnv('VITE_GEMINI_API_KEY', 'a'.repeat(32)); vi.stubEnv('VITE_GEMINI_MODEL', 'test-model') })
  it('returns a successful Gemini response', async () => {
    generateContent.mockResolvedValue({ text: 'Use Gate 2.' })
    const { askGemini } = await import('./gemini')
    await expect(askGemini('Test prompt', { phase: 'arrival' })).resolves.toBe('Use Gate 2.')
    expect(generateContent).toHaveBeenCalledOnce()
  })
  it('returns a safe user-facing message when Gemini fails', async () => {
    generateContent.mockRejectedValue({ status: 400, message: 'internal detail' })
    const { askGemini } = await import('./gemini')
    await expect(askGemini('Test prompt')).resolves.toContain('rephrase')
  })
})
