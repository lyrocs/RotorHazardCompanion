const POST = async (req, res) => {
  if (!req.socket.server.client) {
    res.json({ error: 'no client' })
  }
  const body = JSON.parse(req.body)
  if (!body.sync || !body.sync.length) {
    res.json({ error: 'no sync' })
    return
  }
  const loadTypes = []
  body.sync.forEach(table => {
    if (table === 'pilots') {
      loadTypes.push('pilot_data')
    }
    if (table === 'currentHeat') {
      loadTypes.push('current_heat')
    }
  })
  if (loadTypes.length) {
    req.socket.server.client.emit('load_data', { load_types: loadTypes })
  }
  res.json({ success: true })
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    return POST(req, res)
  }

  res.json({ error: 'not found' })
}
