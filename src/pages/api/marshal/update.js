export default (req, res) => {
  const data_dependencies = ['race_list']
  req.socket.server.client.emit('load_data', { load_types: data_dependencies })
  res.end()
}
