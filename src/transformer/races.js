export default function transformRaces(raw) {
  if (!raw.race_list?.heats) {
    return []
  }

  const raceList = []
  Object.values(raw.race_list.heats).forEach(heat => {
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
