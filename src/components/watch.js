import React, { useEffect, useState, useRef } from 'react'

export default function Watch({ startedAt, status }) {
  const [time, setTime] = useState(new Date())
  const [startinAt, setStartingAt] = useState()
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (status === 'RUNNING' || status === 'STAGING') {
      intervalRef.current = setInterval(() => {
        setTime(new Date().getTime() - startedAt)
      }, 10)
    } else {
      reset()
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, startinAt, startedAt, status])

  const hours = Math.floor(time / 3600000)
  const minutes = Math.floor((time % 3600000) / 60000)
  const seconds = Math.floor((time % 60000) / 1000)
  // only show first decimal
  const milliseconds = Math.floor((time % 1000) / 100)

  const reset = () => {
    setIsRunning(false)
    setTime(0)
    setStartingAt(0)
  }

  return (
    <div className="h-full text-center flex justify-center items-center text-6xl">
      {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}:{milliseconds.toString().padStart(1, '0')}
    </div>
  )
}
