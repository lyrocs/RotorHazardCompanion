'use client'
import React, { useEffect, useState } from 'react'

import Card from '@/components/card.js'

import socketHelper from '@/helpers/socket.helper'

export default function Current() {
  const [currentHeat, setCurrentHeat] = useState(null)

  useEffect(() => {
    fetch('/api/admin/rh', {
      method: 'POST',
      body: JSON.stringify({ sync: ['currentHeat'] }),
    })
    const socket = socketHelper()
    socket.emit('load_data', { load_types: ['currentHeat'] })
    socket.on('currentHeat', data => {
      setCurrentHeat(data)
    })

    return () => {
      socket.close()
    }
  }, [])

  const pilotCard = (name, channel) => {
    return (
      <div key={name} className="col-span-6 md:col-span-3">
        <Card
          children={
            <div className="flex flex-col md:flex-col  items-center md:flex-row text-center">
              <p className="mb-0 mb-10 text-3xl text-clip overflow-hidden w-full">{name}</p>
              <p className="mb-0 mt-5 channel">R{channel}</p>
            </div>
          }
        />
      </div>
    )
  }

  return (
    <>
      <p className="text-3xl  m-6 text-center">Now : {currentHeat?.current?.name}</p>
      <div className="grid grid-cols-12 gap-8">
        {currentHeat?.current?.slots.map(slot => {
          return pilotCard(slot.pilotName, slot.frequency)
        })}
      </div>
      <p className="text-3xl m-6 text-center">Next : {currentHeat?.next?.name || 'No more heat'}</p>
      <div className="grid grid-cols-12 gap-8">
        {currentHeat?.next?.slots.map(slot => {
          return pilotCard(slot.pilotName, slot.frequency)
        })}
      </div>
    </>
  )
}
