export default function transformPilots(raw) {
  if (!Object.keys(raw.result_data || {}).length || !raw.pilot_data.length) {
    return []
  }
  const pilots = raw.pilot_data.map(pilot => {
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

  if (raw.frequency_data?.length) {
    raw.frequency_data.forEach(freq => {
      const pilot = pilots.find(p => p.id === freq.pilot_id)
      if (pilot) {
        pilot.channel = freq.channel
      }
    })
  }
  const resultKeys = Object.keys(raw.result_data) || []
  resultKeys.forEach(heatId => {
    const heat = raw.result_data[heatId]
    const heatName = heat.displayname?.toLowerCase() || ''
    const rounds = heat.rounds || []
    rounds.forEach(round => {
      const nodes = round.nodes || []
      nodes.forEach(node => {
        const pilot = pilots.find(p => p.id === node.pilot_id)
        if (!pilot) {
          return
        }
        const laps = node.laps || []
        laps.forEach((lap, lapIndex) => {
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
