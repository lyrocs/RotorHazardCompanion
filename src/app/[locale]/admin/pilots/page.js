'use client'
import React, { useEffect, useState } from 'react'
import socketHelper from '@/helpers/socket.helper'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function AdminPilots() {
  const { status: sessionStatus } = useSession()
  if (!['loading', 'authenticated'].includes(sessionStatus)) {
    redirect('/api/auth/signin?callbackUrl=/run')
  }
  const [pilots, setPilots] = useState([])

  useEffect(() => {
    fetch('/api/admin/rh', {
      method: 'POST',
      body: JSON.stringify({ sync: ['pilots'] }),
    })
    const socket = socketHelper()
    socket.emit('load_data', { load_types: ['pilots'] })
    socket.on('pilots', data => {
      setPilots(data)
    })
    return () => {
      socket.close()
    }
  }, [])

  const addPilot = () => {
    fetch('/api/admin/pilots', {
      method: 'POST',
    })
  }
  const deletePilot = id => {
    fetch('/api/admin/pilots', {
      method: 'PATCH',
      body: JSON.stringify({ id, action: 'delete' }),
    })
  }
  const updatePilot = (id, key, value) => {
    fetch('/api/admin/pilots', {
      method: 'PATCH',
      body: JSON.stringify({ id, action: 'update', key, value }),
    })
  }
  const onChange = (index, field, value) => {
    const updatedPilots = [...pilots]
    updatedPilots[index][field] = value
    setPilots(updatedPilots)
  }

  return (
    <div>
      <h1>Admin Pilots</h1>
      <ul>
        {pilots?.map((pilot, pilotIndex) => (
          <li key={pilot.id}>
            <input
              className="appearance-none block w-full  text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              value={pilot.name}
              onChange={e => onChange(pilotIndex, 'name', e.target.value)}
              onBlur={e => updatePilot(pilot.id, 'name', e.target.value)}
            ></input>
            <input
              className="appearance-none block w-full  text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              value={pilot.callsign}
              onChange={e => onChange(pilotIndex, 'callsign', e.target.value)}
              onBlur={e => updatePilot(pilot.id, 'callsign', e.target.value)}
            ></input>
            <button onClick={() => deletePilot(pilot.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addPilot()}>Add pilot</button>
    </div>
  )
}
