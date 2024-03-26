export default function transformLaps(raw) {
  if (!raw.current_laps?.current) {
    return []
  }
  return raw.current_laps.current
}
