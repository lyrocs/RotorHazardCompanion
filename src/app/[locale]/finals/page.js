'use client'
import Node from '@/components/node'
import React, { useEffect, useState } from 'react'
import socketHelper from '@/helpers/socket.helper'

export default function Finals() {
  const [finals, setFinals] = useState(null)

  useEffect(() => {
    const socket = socketHelper()
    socket.on('get_data', data => {
      setFinals(data.finals)
    })

    return () => {
      socket.close()
    }
  }, [])

  return (
    <>
      <div className="panel-top">
        <div className="col">
          {Node(1, finals)}
          {Node(2, finals)}
          {Node(3, finals)}
          {Node(4, finals)}
        </div>
        <div className="col">
          {Node(7, finals)}
          {Node(8, finals)}
        </div>
        <div className="col"></div>
        <div className="col">{Node(12, finals)}</div>
        <div className="col">{Node('final', finals)}</div>
      </div>
      <div className="panel-top">
        <div className="col">
          {Node(5, finals)}
          {Node(6, finals)}
        </div>
        <div className="col">
          {Node(9, finals)}
          {Node(10, finals)}
        </div>
        <div className="col">{Node(11, finals)}</div>
        <div className="col">{Node(13, finals)}</div>
      </div>
    </>
  )
}
