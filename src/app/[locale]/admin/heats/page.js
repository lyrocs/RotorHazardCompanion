'use client'
import React, { useEffect, useState } from 'react'
import Card from '@/components/card.js'
import socketHelper from '@/helpers/socket.helper'

export default function AdminPilots() {
  const [heats, setHeats] = useState([])
  const [classes, setClasses] = useState([])
  const [pilots, setPilots] = useState([])
  const [frequencies, setFrequencies] = useState([])

  useEffect(() => {
    const socket = socketHelper()
    socket.emit('load_data', { load_types: ['heats', 'classes', 'pilots', 'frequencies'] })
    socket.on('heats', data => {
      setHeats(data)
    })
    socket.on('classes', data => {
      setClasses(data)
    })
    socket.on('pilots', data => {
      setPilots(data)
    })
    socket.on('frequencies', data => {
      setFrequencies(data)
    })

    return () => {
      socket.close()
    }
  }, [])

  const changeHeatPilot = (heatId, slotId, pilotId) => {
    fetch('/api/admin/heats', {
      method: 'PATCH',
      body: JSON.stringify({ action: 'update', heatId, slotId, pilotId }),
    })
  }

  const addHeat = classId => {
    fetch('/api/admin/classes', {
      method: 'PATCH',
      body: JSON.stringify({ action: 'add_heat', classId }),
    })
  }

  const addClass = () => {
    fetch('/api/admin/classes', {
      method: 'POST',
    })
  }

  const classCard = heat => {
    return (
      <ul>
        {frequencies.map((frequency, frenquencyIndex) => {
          const slot = heat.slots.find(item => item.node_index === frenquencyIndex) || {}
          return (
            <li className="flex" key={frequency.frequency}>
              <div className="bg-green-500 p-2">
                {frequency.band} {frequency.channel}
              </div>
              <div className="text-black p-2">
                <select>
                  <option value="0" selected={slot.method === 0}>
                    Pilot
                  </option>
                  <option value="1" selected={slot.method === 1}>
                    Heat
                  </option>
                  <option value="2" selected={slot.method === 2}>
                    Class
                  </option>
                </select>
              </div>
              <div className="text-black p-2">
                <select onChange={e => changeHeatPilot(heat.id, slot.id, e.target.value)}>
                  <option value="0" selected={slot.pilot_id === undefined}>
                    -None-
                  </option>
                  {pilots.map(pilot => (
                    <option value={pilot.id} selected={slot.pilot_id === pilot.id}>
                      {pilot.name}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div>
      <h1>Admin Heats</h1>
      <Card children={<>toto</>} />
      <ul className="">
        {classes?.map((classData, pilotIndex) => (
          <li>
            <h2 className="text-center text-xl m-2">{classData.name || classData.displayname}</h2>
            <ul className="flex flex-wrap gap-4">
              {heats
                .filter(heat => heat.classId === classData.id)
                .map(heat => (
                  <Card children={classCard(heat)} header={heat.name} customClass="" />
                ))}
              <li>
                <Card children={<button onClick={() => addHeat(classData.id)}>Add Heat</button>} />
              </li>
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={() => addClass()}>Add Class</button>
    </div>
  )
}
