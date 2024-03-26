export default function transformPiTime(raw) {
  return {
    pi_time: raw.pi_time?.pi_time_s || 0,
    node_time: new Date().getTime(),
  }
}
