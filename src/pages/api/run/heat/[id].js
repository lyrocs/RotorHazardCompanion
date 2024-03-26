export default (req, res) => {
  const { id } = req.query
  req.socket.server.client.emit('set_current_heat', { heat: id })
  res.end()
}
