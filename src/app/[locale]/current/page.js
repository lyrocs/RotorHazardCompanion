'use client'
import React, { useEffect, useState } from 'react'

import Pilot from '@/components/pilot'
import socketHelper from '@/helpers/socket.helper'

export default function Current() {
  const [currentHeat, setCurrentHeat] = useState(null)

  useEffect(() => {
    const socket = socketHelper()
    socket.emit('load_data', { load_types: ['currentHeat'] })
    socket.on('currentHeat', data => {
      setCurrentHeat(data)
    })

    return () => {
      socket.close()
    }
  }, [])

  return (
    <>
      <p className="text-3xl text-lime-400 mb-8">Now: {currentHeat?.current?.name}</p>
      <div className="grid grid-cols-12 gap-8">
        {currentHeat?.current?.slots.map(slot => Pilot(slot.pilotName, slot.frequency))}
      </div>
      <p className="text-3xl text-rose-600 mb-8">
        Next: {currentHeat?.next?.name || 'No more heat'}
      </p>
      <div className="grid grid-cols-12 gap-8">
        {currentHeat?.next?.slots.map(slot => Pilot(slot.pilotName, slot.frequency))}
      </div>
    </>
  )
}
