'use client'
import React, { useEffect, useState } from 'react'
import Card from '@/components/card.js'
import socketHelper from '@/helpers/socket.helper'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function AdminPilots() {
  const { status: sessionStatus } = useSession()
  if (!['loading', 'authenticated'].includes(sessionStatus)) {
    redirect('/api/auth/signin?callbackUrl=/run')
  }
  const [heats, setHeats] = useState([])
  const [classes, setClasses] = useState([])
  const [pilots, setPilots] = useState([])
  const [frequencies, setFrequencies] = useState([])
  const [results, setResults] = useState(null)

  useEffect(() => {
    fetch('/api/admin/rh', {
      method: 'POST',
      body: JSON.stringify({ sync: ['pilots', 'heats', 'classes'] }),
    })
    const socket = socketHelper()
    socket.emit('load_data', {
      load_types: ['heats', 'classes', 'pilots', 'frequencies', 'results'],
    })
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
    socket.on('results', data => {
      setResults(data)
    })

    return () => {
      socket.close()
    }
  }, [])

  const changeHeatPilot = (heatId, slotId, pilotId) => {
    fetch('/api/admin/heats', {
      method: 'PATCH',
      body: JSON.stringify({ action: 'update', heatId, slotId, pilotId, method: 0 }),
    })
  }

  const pilotList = (
    <ul>
      {results?.byLaps
        .filter(lap => lap.rank === 3)
        .slice(0, 16)
        .map((lap, index) => {
          return (
            <li>
              {index + 1} - {pilots.find(pilot => pilot.id === lap.pilotId)?.name} - {lap.time}
            </li>
          )
        })}
    </ul>
  )

  const generateFinals = () => {
    const pilotPositions = {
      1: [16, 1, 8, 9],
      2: [13, 4, 5, 12],
      3: [14, 3, 6, 10],
      4: [15, 2, 7, 11],
    }
    console.log('generateFinals', results)

    const sortedPilotsLap = results?.byLaps.filter(lap => lap.rank === 3).slice(0, 16)
    sortedPilotsLap.forEach((pilotLap, index) => {
      const raceNumber = Object.keys(pilotPositions).find(key => {
        const positions = pilotPositions[key]
        return positions.includes(index + 1)
      })
      console.log('raceNumber', raceNumber)
      const slotIndex = pilotPositions[raceNumber].findIndex(item => item === index + 1)
      console.log('slotIndex', slotIndex)
      const heat = heats.find(heat => heat.name === `Race ${raceNumber}`)
      console.log('heat', heat)

      const slot = heat?.slots[slotIndex]
      console.log('changeHeatPilot', heat.id, slot.id, pilotLap.pilotId)
      if (heat?.id !== undefined && slot?.id !== undefined && pilotLap.pilotId !== undefined) {
        setTimeout(() => {
          changeHeatPilot(heat.id, slot.id, pilotLap.pilotId)
        }, 100 * index)
      }
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
      <h1>Heats configurator</h1>
      <button className="bg-blue-500 rounded p-2 my-4" onClick={() => generateFinals()}>
        Populate Finals
      </button>
      {pilotList}
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
