const UPDATE = (req, res) => {
  if (!req.socket.server.client) {
    res.json({ error: 'no client' })
  }
  const body = JSON.parse(req.body)
  const { heatId, slotId, pilotId } = body
  req.socket.server.client.emit('alter_heat', { heat: heatId, slot_id: slotId, pilot: pilotId })
  req.socket.server.client.emit('load_data', { load_types: ['heat_data'] })
  res.json({ success: true })
}

export default function handler(req, res) {
  if (req.method === 'PATCH') {
    const body = JSON.parse(req.body)
    if (body.action === 'update') {
      return UPDATE(req, res)
    } else if (body.action === 'delete') {
      return DELETE(req, res)
    }
  }
  res.json({ error: 'not found' })
}
