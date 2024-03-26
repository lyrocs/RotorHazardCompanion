export default (req, res) => {
  const { status } = req.query
  switch (status) {
    case 'start':
      req.socket.server.client.emit('stage_race')
      break
    case 'stop':
      req.socket.server.client.emit('stop_race')
      break
    case 'save':
      req.socket.server.client.emit('save_laps')
      break
    case 'discard':
      req.socket.server.client.emit('discard_laps')
      break
  }
  res.end()
}
