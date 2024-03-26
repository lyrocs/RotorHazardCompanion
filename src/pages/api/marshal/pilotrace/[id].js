export default (req, res) => {
  const { id } = req.query
  req.socket.server.client.emit('get_pilotrace', {
    pilotrace_id: parseInt(id),
  })
  res.end()
}
