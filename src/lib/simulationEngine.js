import seeds from '../data/mockIncidents.json'
const gateNames = ['Gate 1','Gate 2','Gate 3','Gate 4','Gate 5','Gate 6','Gate 7','Gate 8']
const zones = ['North Concourse','East Promenade','South Fan Village','West Transit Hub','Lower Bowl','Upper Bowl']
const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))
const phaseFor = (tick) => tick % 12 < 3 ? 'arrival' : tick % 12 < 6 ? 'kickoff' : tick % 12 < 8 ? 'match' : tick % 12 < 10 ? 'halftime' : 'departure'

export function createInitialState() {
  return { tick: 0, phase: 'arrival', updatedAt: new Date().toISOString(), occupancy: 48, gates: gateNames.map((name, i) => ({ name, congestion: 28 + i * 4, wait: 4 + i })), zones: zones.map((name, i) => ({ name, density: 32 + i * 5 })), incidents: seeds.slice(0, 2).map((x, i) => ({ ...x, id: i, time: 'Now' })), history: [{ time: 'Now', occupancy: 48 }] }
}
export function nextSimulation(previous) {
  const tick = previous.tick + 1, phase = phaseFor(tick)
  const phaseLift = { arrival: 5, kickoff: 14, match: 1, halftime: 18, departure: 8 }[phase]
  const gates = previous.gates.map((g, i) => { const wave = ((tick * 13 + i * 19) % 17) - 8; const pressure = [2,4,9,1,5,0,7,3][i]; return { ...g, congestion: clamp(g.congestion * .58 + 24 + phaseLift + pressure + wave), wait: Math.max(2, Math.round((g.congestion * .58 + 24 + phaseLift + pressure + wave) / 7)) } })
  const zoneData = previous.zones.map((z, i) => ({ ...z, density: clamp(z.density * .5 + 25 + phaseLift + ((tick * 7 + i * 11) % 19) + (i === 1 && phase === 'halftime' ? 14 : 0)) }))
  const occupancy = clamp(previous.occupancy + ({ arrival: 6, kickoff: 3, match: 1, halftime: 0, departure: -7 }[phase]) + ((tick % 3) - 1))
  const incidents = [...previous.incidents, ...(tick % 2 === 0 ? [{ ...seeds[tick % seeds.length], id: Date.now(), time: 'Just now' }] : [])].slice(-5).reverse()
  return { tick, phase, updatedAt: new Date().toISOString(), occupancy, gates, zones: zoneData, incidents, history: [...previous.history, { time: `${tick * 5}s`, occupancy }].slice(-14) }
}
