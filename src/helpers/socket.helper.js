import io from 'socket.io-client'

export default function socket() {
  const socket = io('http://localhost:3001', {
    path: '/api/socket',
  })
  return socket
}
