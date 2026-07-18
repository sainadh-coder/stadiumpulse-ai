import { describe, expect, it } from 'vitest'
import { createInitialState, nextSimulation } from './simulationEngine'

describe('simulationEngine', () => {
  it('keeps congestion, density, and occupancy within 0 to 100', () => {
    let state = createInitialState()
    for (let tick = 0; tick < 40; tick += 1) {
      state = nextSimulation(state)
      expect(state.occupancy).toBeGreaterThanOrEqual(0)
      expect(state.occupancy).toBeLessThanOrEqual(100)
      state.gates.forEach(gate => expect(gate.congestion).toBeGreaterThanOrEqual(0) && expect(gate.congestion).toBeLessThanOrEqual(100))
      state.zones.forEach(zone => expect(zone.density).toBeGreaterThanOrEqual(0) && expect(zone.density).toBeLessThanOrEqual(100))
    }
  })

  it('adds and retains rotating incidents on even simulation ticks', () => {
    const initial = createInitialState()
    const first = nextSimulation(initial)
    expect(first.incidents).toHaveLength(2)
    const second = nextSimulation(first)
    expect(second.incidents).toHaveLength(3)
    expect(second.incidents[0].time).toBe('Just now')
    let state = second
    for (let tick = 0; tick < 12; tick += 1) state = nextSimulation(state)
    expect(state.incidents.length).toBeLessThanOrEqual(5)
    expect(new Set(state.incidents.map(incident => incident.title)).size).toBeGreaterThan(1)
  })
})
