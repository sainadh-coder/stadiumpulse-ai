/**
 * This module produces bounded, deterministic stadium telemetry for the live demo.
 * Its stable patterns make operational changes explainable while still feeling responsive.
 */
import seeds from '../data/mockIncidents.json'
const gateNames = ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5', 'Gate 6', 'Gate 7', 'Gate 8']
const zones = ['North Concourse', 'East Promenade', 'South Fan Village', 'West Transit Hub', 'Lower Bowl', 'Upper Bowl']
const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)))
const phaseFor = (tick) =>
  tick % 12 < 3
    ? 'arrival'
    : tick % 12 < 6
      ? 'kickoff'
      : tick % 12 < 8
        ? 'match'
        : tick % 12 < 10
          ? 'halftime'
          : 'departure'

function gateTelemetry(gate, index, tick, phaseLift) {
  // A deterministic wave avoids misleading, unexplainable random alerts while still creating realistic variation per gate.
  const wave = ((tick * 13 + index * 19) % 17) - 8
  const pressure = [2, 4, 9, 1, 5, 0, 7, 3][index]
  const congestion = clamp(gate.congestion * 0.58 + 24 + phaseLift + pressure + wave)
  return { ...gate, congestion, wait: Math.max(2, Math.round(congestion / 7)) }
}

function zoneTelemetry(zone, index, tick, phase, phaseLift) {
  const halftimeLift = index === 1 && phase === 'halftime' ? 14 : 0
  return {
    ...zone,
    density: clamp(zone.density * 0.5 + 25 + phaseLift + ((tick * 7 + index * 11) % 19) + halftimeLift)
  }
}

/**
 * Creates the first stable snapshot consumed by all role experiences.
 * @returns {object} Initial live stadium simulation state.
 */
export function createInitialState() {
  return {
    tick: 0,
    phase: 'arrival',
    updatedAt: new Date().toISOString(),
    occupancy: 48,
    gates: gateNames.map((name, i) => ({ name, congestion: 28 + i * 4, wait: 4 + i })),
    zones: zones.map((name, i) => ({ name, density: 32 + i * 5 })),
    incidents: seeds.slice(0, 2).map((x, i) => ({ ...x, id: i, time: 'Now' })),
    history: [{ time: 'Now', occupancy: 48 }]
  }
}
/**
 * Advances one five-second simulation cycle in a single immutable state update.
 * @param {object} previous - The previous stadium telemetry snapshot.
 * @returns {object} The next bounded telemetry snapshot.
 */
export function nextSimulation(previous) {
  const tick = previous.tick + 1
  const phase = phaseFor(tick)
  const phaseLift = { arrival: 5, kickoff: 14, match: 1, halftime: 18, departure: 8 }[phase]
  const gates = previous.gates.map((gate, index) => gateTelemetry(gate, index, tick, phaseLift))
  const zoneData = previous.zones.map((zone, index) => zoneTelemetry(zone, index, tick, phase, phaseLift))
  const occupancy = clamp(
    previous.occupancy + { arrival: 6, kickoff: 3, match: 1, halftime: 0, departure: -7 }[phase] + ((tick % 3) - 1)
  )
  const newIncident =
    tick % 2 === 0 ? [{ ...seeds[tick % seeds.length], id: `incident-${tick}`, time: 'Just now' }] : []
  const incidents = [...previous.incidents, ...newIncident].slice(-5).reverse()
  return {
    tick,
    phase,
    updatedAt: new Date().toISOString(),
    occupancy,
    gates,
    zones: zoneData,
    incidents,
    history: [...previous.history, { time: `${tick * 5}s`, occupancy }].slice(-14)
  }
}
