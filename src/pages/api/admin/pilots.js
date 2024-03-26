const POST = (req, res) => {
  if (!req.socket.server.client) {
    res.json({ error: 'no client' })
  }
  req.socket.server.client.emit('add_pilot')
  res.json({ success: true })
}

const DELETE = (req, res) => {
  if (!req.socket.server.client) {
    res.json({ error: 'no client' })
  }
  const body = JSON.parse(req.body)
  req.socket.server.client.emit('delete_pilot', { pilot: body.id })
  res.json({ success: true })
}

const UPDATE = (req, res) => {
  if (!req.socket.server.client) {
    res.json({ error: 'no client' })
  }
  const body = JSON.parse(req.body)
  const { id, key, value } = body
  req.socket.server.client.emit('alter_pilot', { pilot_id: id, [key]: value })
  req.socket.server.client.emit('load_data', { load_types: ['pilot_data'] })
  res.json({ success: true })
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    return POST(req, res)
  }
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
