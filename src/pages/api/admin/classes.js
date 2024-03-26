const UPDATE = (req, res) => {
  if (!req.socket.server.client) {
    res.json({ error: 'no client' })
  }
  const body = JSON.parse(req.body)
  const { id, key, value } = body
  req.socket.server.client.emit('alter_race_class', { pilot_id: id, [key]: value })
  req.socket.server.client.emit('load_data', { load_types: ['class_data'] })
  res.json({ success: true })
}

const POST = async (req, res) => {
  if (!req.socket.server.client) {
    res.json({ error: 'no client' })
  }
  req.socket.server.client.emit('add_race_class')
  req.socket.server.client.emit('load_data', { load_types: ['class_data'] })
  res.json({ success: true })
}

const ADD_HEAT = (req, res) => {
  if (!req.socket.server.client) {
    res.json({ error: 'no client' })
  }
  const body = JSON.parse(req.body)
  const { classId } = body
  req.socket.server.client.emit('add_heat', { class: classId })
  req.socket.server.client.emit('load_data', { load_types: ['heat_data'] })
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
    } else if (body.action === 'add_heat') {
      return ADD_HEAT(req, res)
    }
  }
  res.json({ error: 'not found' })
}
