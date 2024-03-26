'use client'
import React, { useEffect, useState } from 'react'
import Card from '@/components/card.js'
import socketHelper from '@/helpers/socket.helper'

export default function AdminPilots() {
  const [config, setConfig] = useState({})


  useEffect(() => {
    const socket = socketHelper()
    socket.emit('load_data', { load_types: ['config'] })
    socket.on('config', data => {
      setHeats(data)
    })

    return () => {
      socket.close()
    }
  }, [])

  const updateConfig = (heatId, slotId, pilotId) => {
    fetch('/api/admin/config', {
      method: 'PUT',
      body: JSON.stringify({ action: 'update', heatId, slotId, pilotId }),
    })
  }

  const changeValue = (key, value) => {
    setConfig({ ...config, [key]: value })
  }

 
 

  return (
    <div>
      <h1>Admin Config</h1>
      <div className="flex flex-col gap-4">
      <label>Finals Format  <select className="text-black" value={config?.finalsFormat} onChange={e => changeValue('finalsFormat', e.target.value)}>
            <option value="16double">16 pilots double elimination</option>
            <option value="32double">32 pilots double elimination</option>
        </select></label>
       
        <label>Qualifs name pattern <input className="text-black" type="number" value={config?.qualifName} onChange={e => changeValue('qualifName', e.target.value)} /></label>
        
        <label>Finals name pattern         <input className="text-black" type="number" value={config?.finalName} onChange={e => changeValue('finalName', e.target.value)} />
</label>

      
      <button onClick={() => updateConfig()}>Save</button>
      </div>
    </div>
  )
}
