import transformHeats from '@/transformer/heat'

export default function transformCurrentHeat(raw) {
  if (!raw.current_heat) {
    return []
  }
  const heats = transformHeats(raw)
  const current = heats.find(heat => heat.id === raw.current_heat.current_heat)

  let next = heats.find(
    heat =>
      heat.id === raw.current_heat.current_heat + 1 && heat.classId === raw.current_heat.heat_class,
  )
  if (!next) {
    // get first heat of next class
    next = heats.find(heat => heat.classId === raw.current_heat.heat_class)
  }

  let previous = heats.find(
    heat =>
      heat.id === raw.current_heat.current_heat - 1 && heat.classId === raw.current_heat.heat_class,
  )
  if (!previous) {
    // get first heat of next class
    previous = heats.findLast(heat => heat.classId === raw.current_heat.heat_class)
  }

  const cleanHeat = heat => ({ ...heat, slots: heat.slots.filter(slot => slot.pilot_id) })
  return {
    current: cleanHeat(current),
    next: cleanHeat(next),
    previous: cleanHeat(previous),
  }
}
