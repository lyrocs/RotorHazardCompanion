import transformPilots from '@/transformer/pilots'

const extractFinals = raw => {
  if (!Object.keys(raw.result_data || {}).length || !raw.pilot_data.length) {
    return []
  }
  const finals = {}
  Object.keys(raw.result_data).forEach(heatId => {
    const heat = raw.result_data[heatId]
    const heatName = heat.displayname?.toLowerCase() || ''
    if (!['race', 'final'].some(item => heatName.includes(item))) {
      return
    }
    const raceNumber = heatName.replace(/^\D+/g, '') || 'final'
    const pilots = heat.leaderboard.by_race_time.map(pilot => {
      return {
        name: pilot.callsign,
        position: pilot.position,
      }
    })
    if (raceNumber === 'final') {
      finals.final = computeFinalResult(heat.rounds)
    } else {
      finals[raceNumber] = pilots
    }
  })

  return finals
}

const extractQualifs = pilots => {
  const leadboard = []
  pilots.forEach(pilot => {
    const bestLap = pilot.qualifs.reduce((acc, value) => {
      if (!acc || value.time < acc) {
        acc = value.time
      }
      return acc
    }, '')
    leadboard.push({ name: pilot.name, time: bestLap })
  })
  return leadboard.sort((a, b) => {
    return a.time > b.time ? 1 : -1
  })
}

const extractFinalPilotName = (finals, round, position) => {
  if (!Object.keys(finals) || !finals[round]) {
    return ''
  }
  const pilot = finals[round].find(pilot => pilot.position === position)
  return pilot?.name || ''
}

const extractFinalResult = (finals, qualifs) => {
  const results = {}
  if (!Object.keys(finals)) {
    return results
  }
  results[1] = extractFinalPilotName(finals, 'final', 1)
  results[2] = extractFinalPilotName(finals, 'final', 2)
  results[3] = extractFinalPilotName(finals, 'final', 3)
  results[4] = extractFinalPilotName(finals, 'final', 4)
  results[5] = extractFinalPilotName(finals, 13, 3)
  results[6] = extractFinalPilotName(finals, 13, 4)
  results[7] = extractFinalPilotName(finals, 11, 3)
  results[8] = extractFinalPilotName(finals, 11, 4)

  const qualifsPilots = qualifs.map(pilot => pilot.name)
  const pos9to12 = [
    extractFinalPilotName(finals, 9, 3),
    extractFinalPilotName(finals, 9, 4),
    extractFinalPilotName(finals, 10, 3),
    extractFinalPilotName(finals, 10, 4),
  ].sort((a, b) => (qualifsPilots.indexOf(a) > qualifsPilots.indexOf(b) ? 1 : -1))
  results[9] = pos9to12[0]
  results[10] = pos9to12[1]
  results[11] = pos9to12[2]
  results[12] = pos9to12[3]

  const pos13to16 = [
    extractFinalPilotName(finals, 5, 3),
    extractFinalPilotName(finals, 5, 4),
    extractFinalPilotName(finals, 6, 3),
    extractFinalPilotName(finals, 6, 4),
  ].sort((a, b) => (qualifsPilots.indexOf(a) < qualifsPilots.indexOf(b) ? 1 : -1))
  results[13] = pos13to16[0]
  results[14] = pos13to16[1]
  results[15] = pos13to16[2]
  results[16] = pos13to16[3]
  return results
}

export default function transformResults(raw) {
  const pilots = transformPilots(raw)
  const finals = extractFinals(raw)
  const qualifs = extractQualifs(pilots)
  const finalResult = extractFinalResult(finals, qualifs)

  return {
    finals,
    qualifs,
    finalResult,
  }
}
