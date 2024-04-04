export default function transformHeat(raw) {
  if (!raw.heat_data || !raw.frequency_data || !raw.pilot_data) {
    return []
  }
  const heats = raw.heat_data.map(heat => {
    return {
      ...heat,
      id: heat.id,
      name: heat.displayname,
      classId: heat.class_id,
      slots: heat.slots.reduce((acc, slot) => {
        if (!slot.pilot_id) {
          acc.push({
            ...slot,
          })
          return acc
        }
        const frequency = raw.frequency_data[slot.node_index]
        const pilot = raw.pilot_data.find(p => p.pilot_id === slot.pilot_id)
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
