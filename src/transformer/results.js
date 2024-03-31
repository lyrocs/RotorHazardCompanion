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

const extractHeats = raw => {
  if (!Object.keys(raw.result_data?.heats || {}).length) {
    return []
  }
  const heats = []
  Object.keys(raw.result_data.heats).forEach(heatId => {
    const heat = raw.result_data.heats[heatId]
    const heatName = heat.displayname?.toLowerCase() || ''
    const rounds = heat.rounds.map(round => {
      const nodes = round.nodes.filter(node => node.callsign)
      const date = round.start_time_formatted
      const pilots = nodes.map(node => {
        return {
          callsign: node.callsign,
          pilot_id: node.pilot_id,
          laps: node.laps.reduce((acc, value, index) => {
            if (index && !value.deleted) {
              acc.push({
                id: value.id,
                time: value.lap_time_formatted,
              })
            }
            return acc
          }, []),
        }
      })
      return {
        id: round.id,
        date,
        pilots,
      }
    })
    heats.push({
      id: heatId,
      name: heatName,
      rounds,
    })
  })

  return heats
}

const extractByPilots = raw => {
  if (!Object.keys(raw.result_data?.heats || {}).length) {
    return []
  }
  const pilots = {}
  Object.keys(raw.result_data.heats).forEach(heatId => {
    const heat = raw.result_data.heats[heatId]
    const heatName = heat.displayname?.toLowerCase() || ''
    heat.rounds.forEach(round => {
      const nodes = round.nodes.filter(node => node.callsign)
      nodes.forEach(node => {
        if (node.pilot_id && !pilots[node.pilot_id]) {
          pilots[node.pilot_id] = {
            name: node.callsign,
            laps: [],
          }
        }
        const laps = node.laps.reduce((acc, value, index) => {
          if (index && !value.deleted) {
            acc.push({
              id: value.id,
              time: value.lap_time_formatted,
              heatName,
              heatId: heat.heat_id,
              round: round.id,
            })
          }
          return acc
        }, [])
        if (laps.length) {
          pilots[node.pilot_id].laps.push(...laps)
        }
      })
    })
  })

  return pilots
}

const extractByLaps = raw => {
  if (!Object.keys(raw.result_data?.heats || {}).length) {
    return []
  }
  const pilots = {}
  const laps = []
  Object.keys(raw.result_data.heats).forEach(heatId => {
    const heat = raw.result_data.heats[heatId]
    const heatName = heat.displayname?.toLowerCase() || ''
    heat.rounds.forEach(round => {
      const nodes = round.nodes.filter(node => node.callsign && node.pilot_id)
      nodes.forEach(node => {
        node.laps.forEach((lap, index) => {
          if (lap.delete || !index) {
            return
          }
          laps.push({
            time: lap.lap_time_formatted,
            heatName,
            heatId: heat.heat_id,
            round: round.id,
            pilotId: node.pilot_id,
          })
        })
      })
    })
  })

  return laps.sort((a, b) => {
    return a.time > b.time ? 1 : -1
  })
}

export default function transformResults(raw) {
  const heats = extractHeats(raw)
  const byPilot = extractByPilots(raw)
  const byLaps = extractByLaps(raw)
  const pilots = transformPilots(raw)
  const finals = extractFinals(raw)
  const qualifs = extractQualifs(pilots)
  const finalResult = extractFinalResult(finals, qualifs)

  return {
    finals,
    qualifs,
    finalResult,
    heats,
    byPilot,
    byLaps,
  }
}
