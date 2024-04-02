'use client'
import React, { useEffect, useState } from 'react'
import socketHelper from '@/helpers/socket.helper'

export default function Laps() {
  const [pilots, setPilots] = useState(null)
  const [results, setResults] = useState(null)

  useEffect(() => {
    const socket = socketHelper()
    socket.emit('load_data', { load_types: ['pilots', 'results'] })
    socket.on('pilots', data => {
      setPilots(data)
    })
    socket.on('results', data => {
      setResults(data)
    })

    return () => {
      socket.close()
    }
  }, [])

  const table = pilots?.map(pilot => (
    <div className=" col-span-4 md:col-span-3 col-span-12">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
              <tbody>
                <tr className="border-b dark:border-neutral-500 bg-sky-400 text-neutral-800">
                  <td
                    colspan="2"
                    className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500 font-semibold"
                  >
                    {pilot.name}
                  </td>
                </tr>
                {results?.byPilot[pilot.id]?.laps?.map(lap => (
                  <tr className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4">
                      {lap.heatName} - {lap.round}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{lap.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ))

  const laps = (
    <div className=" col-span-4 md:col-span-3 col-span-12">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
              <tbody>
                {results?.byLaps?.map(lap => (
                  <tr className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4">
                      {pilots.find(pilot => pilot.id === lap.pilotId)?.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {lap.heatName}-{lap.round}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{lap.rank}</td>
                    <td className="whitespace-nowrap px-6 py-4">{lap.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-12 gap-card-gap table-main gap-4">{table}</div>
      <div className="flex justify-center">{laps}</div>
    </>
  )
}
