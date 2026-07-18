import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppProvider } from '../context/AppContext'
import Fan from './Fan'
import Volunteer from './Volunteer'
import Organizer from './Organizer'

vi.mock('../lib/gemini', async () => {
  const actual = await vi.importActual('../lib/gemini')
  return { ...actual, askGemini: vi.fn().mockResolvedValue('Safe test response') }
})
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  Tooltip: () => null,
  YAxis: () => null
}))
const renderPage = (page) => render(<AppProvider>{page}</AppProvider>)

describe('copilot pages', () => {
  it('renders Fan Copilot controls', () => { renderPage(<Fan/>); expect(screen.getByRole('heading', { name: 'Fan Copilot' })).toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Send question' })).toBeInTheDocument() })
  it('renders Volunteer Copilot controls', async () => { renderPage(<Volunteer/>); expect(screen.getByRole('heading', { name: 'Volunteer Copilot' })).toBeInTheDocument(); expect(await screen.findByRole('button', { name: /translate to/i })).toBeInTheDocument(); await screen.findByText('Safe test response') })
  it('renders Organizer Dashboard controls', () => { renderPage(<Organizer/>); expect(screen.getByRole('heading', { name: 'Organizer Dashboard' })).toBeInTheDocument(); expect(screen.getByRole('button', { name: /ask stadium/i })).toBeInTheDocument() })
})
