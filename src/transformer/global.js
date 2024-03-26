const extractPilots = raw => {
  if (!Object.keys(raw.rawResult || {}).length || !raw.rawPilots.length) {
    return []
  }
  const pilots = raw.rawPilots.map(pilot => {
    return {
      name: pilot.name,
      callsign: pilot.callsign,
      color: pilot.color,
      phonetic: pilot.phonetic,
      active: pilot.active,
      id: pilot.pilot_id,
      qualifs: [],
      finals: [],
    }
  })

  if (raw.rawFrequency?.length) {
    raw.rawFrequency.forEach(freq => {
      const pilot = pilots.find(p => p.id === freq.pilot_id)
      if (pilot) {
        pilot.channel = freq.channel
      }
    })
  }

  Object.keys(raw.rawResult).forEach(heatId => {
    const heat = raw.rawResult[heatId]
    const heatName = heat.displayname?.toLowerCase() || ''
    heat.rounds.forEach(round => {
      round.nodes.forEach(node => {
        const pilot = pilots.find(p => p.id === node.pilot_id)
        if (!pilot) {
          return
        }
        node.laps.forEach((lap, lapIndex) => {
          if (!lapIndex) {
            return
          }
          if (!lap.deleted) {
            const lapData = { round: round.id, time: lap.lap_time_formatted }
            if (heatName.includes('qualifier')) {
              pilot.qualifs.push(lapData)
            } else {
              pilot.finals.push(lapData)
            }
          }
        })
      })
    })
  })

  return pilots
}
const computeFinalResult = rounds => {
  const pilots = []
  rounds.forEach(round => {
    round.leaderboard.by_race_time.forEach(pilot => {
      const pilotFound = pilots.find(i => i.name === pilot.callsign)
      const point = pilot.laps !== 3 ? 5 : pilot.position
      const pilotData = {
        name: pilot.callsign,
        position: 0,
        points: [point],
      }
      if (!pilotFound) {
        pilots.push(pilotData)
      } else {
        pilotFound.points.push(point)
      }
    })
  })
  const allPoints = pilots
    .map(pilot => pilot.points.reduce((acc, value) => (acc += value)))
    .sort((a, b) => (a > b ? 1 : -1))

  pilots.forEach(pilot => {
    // check if pilot.points contains 2 times the value 1
    if (pilot.points.filter(i => i === 1).length === 2) {
      pilot.position = 1
    } else {
      const pilotPoint = pilot.points.reduce((acc, value) => (acc += value))
      pilot.position = allPoints.indexOf(pilotPoint) + 1
    }
  })
  return pilots
}

const extractFinals = raw => {
  if (!Object.keys(raw.rawResult || {}).length || !raw.rawPilots.length) {
    return []
  }
  const finals = {}
  Object.keys(raw.rawResult).forEach(heatId => {
    const heat = raw.rawResult[heatId]
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

const extractHeat = raw => {
  if (!raw.rawHeats || !raw.rawFrequency || !raw.rawPilots) {
    return []
  }
  const heats = raw.rawHeats.map(heat => {
    return {
      ...heat,
      id: heat.id,
      name: heat.displayname,
      classId: heat.class_id,
      slots: heat.slots.reduce((acc, slot) => {
        if (!slot.pilot_id) {
          return acc
        }
        const frequency = raw.rawFrequency[slot.node_index]
        const pilot = raw.rawPilots.find(p => p.pilot_id === slot.pilot_id)
        acc.push({
          frequency: frequency ? frequency.channel : null,
          pilotName: pilot ? pilot.name : null,
          ...slot,
        })
        return acc
      }, []),
    }
  })
  return heats
}

const extractCurrentHeats = (raw, heats) => {
  if (!raw.rawCurrentHeat || !heats) {
    return []
  }
  const current = heats.find(heat => heat.id === raw.rawCurrentHeat.current_heat)

  let next = heats.find(
    heat =>
      heat.id === raw.rawCurrentHeat.current_heat + 1 &&
      heat.classId === raw.rawCurrentHeat.heat_class,
  )
  if (!next) {
    // get first heat of next class
    next = heats.find(heat => heat.classId === raw.rawCurrentHeat.heat_class)
  }

  let previous = heats.find(
    heat =>
      heat.id === raw.rawCurrentHeat.current_heat - 1 &&
      heat.classId === raw.rawCurrentHeat.heat_class,
  )
  if (!previous) {
    // get first heat of next class
    previous = heats.findLast(heat => heat.classId === raw.rawCurrentHeat.heat_class)
  }
  return { current, next, previous }
}

const extractCurrentLaps = raw => {
  if (!raw || !raw.current) {
    return []
  }
  return raw.current
  // const currentLaps = raw.current.node_index.reduce((acc, node) => {
  //   if (!node.pilot) {
  //     return acc;
  //   }
  //   let progress = 0;
  //   node.laps.forEach((lap, lapIndex) => {
  //     const step = lap.splits.length
  //       ? Math.round((1 / (lap.splits.length + 1)) * 100) / 100
  //       : 1;
  //     progress = lapIndex;
  //     lap.splits.forEach((split, slitIndex) => {
  //       if (split.split_time !== "-") {
  //         const progressValue = lapIndex + (slitIndex + 1) * step;
  //         progress = Math.round(progressValue * 100) / 100;
  //       }
  //     });
  //   });
  //   acc.push({
  //     pilot: node.pilot,
  //     laps: node.laps,
  //     progress,
  //   });
  //   return acc;
  // }, []);
  // return currentLaps;
}

const extractRaceList = raw => {
  if (!raw || !raw.heats) {
    return []
  }

  const raceList = []
  Object.values(raw.heats).forEach(heat => {
    const heatData = {
      heat_id: heat.heat_id,
      displayname: heat.displayname,
      rounds: [],
    }
    Object.values(heat.rounds).forEach(round => {
      const roundData = {
        race_id: round.race_id,
        class_id: round.class_id,
        format_id: round.format_id,
        start_time: round.start_time,
        start_time_formatted: round.start_time_formatted,
        pilotraces: round.pilotraces.filter(pilotrace => {
          return pilotrace.pilot_id !== 0
        }),
      }
      heatData.rounds.push(roundData)
    })
    raceList.push(heatData)
  })

  return raceList
}

export default function transform(raw) {
  const pilots = extractPilots(raw)
  const heats = extractHeat(raw)
  const currentHeats = extractCurrentHeats(raw, heats)
  const finals = extractFinals(raw)
  const qualifs = extractQualifs(pilots)
  const finalResult = extractFinalResult(finals, qualifs)
  const currentLaps = extractCurrentLaps(raw.rawCurrentLaps)
  const raceList = extractRaceList(raw.rawRaceList)
  const stageReady = raw.rawStageReady
  const pi_time = {
    pi_time: raw.rawPiTime?.pi_time_s || 0,
    node_time: new Date().getTime(),
  }
  const race_status = raw.rawRaceStatus
  const leaderboard = raw.leaderboard
  const nodeData = raw.nodeData
  const frequencies = raw.rawFrequency || []
  const classes = raw.rawClasses

  return {
    pilots,
    finals,
    heats,
    currentHeats,
    qualifs,
    finalResult,
    currentLaps,
    stageReady,
    raceList,
    pi_time,
    race_status,
    leaderboard,
    nodeData,
    frequencies,
    classes,
  }
}
