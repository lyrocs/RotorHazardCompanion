'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import io from 'socket.io-client'
import ReactPlayer from 'react-player'
import fetchApi from '@/helpers/api.helper.js'
import socketHelper from '@/helpers/socket.helper'
import NodeCard from './nodeCard.js'
import Card from '@/components/card.js'
import Button from '@/components/button.js'
import Table from '@/components/table.js'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
const Watch = dynamic(() => import('@/components/watch.js'), { ssr: false })

export default function Current() {
  const { status: sessionStatus } = useSession()
  if (!['loading', 'authenticated'].includes(sessionStatus)) {
    redirect('/api/auth/signin?callbackUrl=/run')
  }
  const [status, setStatus] = useState(null)
  const [chartData, setChartData] = useState({ values: [], times: [] })
  const [chartTimes, setChartTimes] = useState([])
  const [startedAt, setStartedAt] = useState(0)
  // const [currentHeat, setCurrentHeat] = useState(null)
  const [stage, setStage] = useState({})
  const [piTime, setPiTime] = useState({})
  const [heats, setHeats] = useState([])
  const [raceStatus, setRaceStatus] = useState({})
  const [laps, setLaps] = useState({})
  const [frequencies, setFrequencies] = useState([])

  const [pilotTable, setPilotTable] = useState({})

  const STATUS_RUNNING = 1
  const STATUS_STOPPED = 2
  const STATUS_STAGING = 3

  useEffect(() => {
    if (!stage?.pi_starts_at_s || !piTime.pi_time) {
      return
    }
    const piStartsAt = stage.pi_starts_at_s * 1000
    const piTimeSecond = piTime.pi_time * 1000
    const node_time = piTime.node_time
    const diff = piTimeSecond - piStartsAt
    let time = node_time - diff
    time = Math.floor(time)
    setStartedAt(time)
  }, [stage, piTime])

  useEffect(() => {
    const currentHeat = heats.find(heat => heat.id == raceStatus?.race_heat_id)
    const currentHeatBody =
      currentHeat?.slots?.map((pilot, index) => [pilot.pilotName, '', '', '']) || []
    const currentLapsBody =
      laps.node_index
        ?.map(node => [node.pilot?.name, node?.laps.length, '', ''])
        .filter(item => !!item[0]) || []
    const pilotTableHeaders = ['Pilot', 'Laps', 'Fastest Lap', 'Best 3']
    const pilotTableBody = laps.node_index?.length ? currentLapsBody : currentHeatBody

    setPilotTable({
      headers: pilotTableHeaders,
      body: pilotTableBody,
    })
  }, [heats, raceStatus])

  useEffect(() => {
    const socket = socketHelper()
    socket.emit('load_data', {
      load_types: ['stage', 'piTime', 'raceStatus', 'heats', 'laps', 'frequencies'],
    })

    socket.on('stage', data => {
      setStage(data)
    })
    socket.on('piTime', data => {
      setPiTime(data)
    })
    socket.on('heats', data => {
      setHeats(data)
    })
    socket.on('laps', data => {
      setLaps(data)
    })
    socket.on('frequencies', data => {
      setFrequencies(data)
    })

    socket.on('raceStatus', race_status => {
      setRaceStatus(race_status)
      switch (race_status?.race_status) {
        case STATUS_RUNNING:
          setStatus('RUNNING')
          break
        case STATUS_STOPPED:
          setStatus('STOPPED')
          break
        case STATUS_STAGING:
          setStatus('STAGING')
          break
        default:
          setStatus('WAITING')
          break
      }
    })

    socket.on('heartbeat', data => {
      // data contains value like {node_peak_rsssi: [3,5,2,1,7,4,7,8]}
      // chartData should contain an history of node_peark_rssi with a current timestamp value like {values: [[0,0,0,0,0,0,0,0],[...]], times: [new Date(), ....]}
      // chartData.times.push(Date.now())
      // chartData.values.push(data.node_peak_rssi)
      // setChartTimes(prevChartTimes => [...prevChartTimes, Date.now()].splice(-10))
      // setChartTimes([...chartTimes, new Date()])
      // if (chartData.values.length > 10) {
      //   chartData.times.shift()
      //   chartData.values.shift()
      // }
      setChartData(prevChartData => ({
        times: [...prevChartData.times, Date.now()].splice(-10),
        values: [...prevChartData.values, data.current_rssi].splice(-10),
      }))
    })

    return () => {
      socket.close()
    }
  }, [])

  const changeHeat = e => {
    fetchApi(`/api/run/heat/${e.target.value}`, {
      method: 'POST',
    })
  }
  const heatSelect = (
    <div className="text-dark">
      <select
        className="border-2 rounded border-red-500 px-3 py-1"
        value={raceStatus?.race_heat_id}
        onChange={changeHeat}
      >
        <option key="0" value="0">
          Practice mode
        </option>
        {heats.map(heat => (
          <option key={heat.id} value={heat.id}>
            {heat.name}
          </option>
        ))}
      </select>
    </div>
  )

  const startRace = () => {
    fetchApi('/api/run/race/start', {
      method: 'POST',
    })
  }

  const stopRace = () => {
    fetchApi('/api/run/race/stop', {
      method: 'POST',
    })
  }

  const saveLaps = () => {
    fetchApi('/api/run/race/save', {
      method: 'POST',
    })
  }

  const discardLaps = () => {
    fetchApi('/api/run/race/discard', {
      method: 'POST',
    })
  }

  const startAndStop = (
    <div className="h-full flex gap-4 items-center justify-center">
      <Button
        onClick={startRace}
        children={'Start'}
        type={['RUNNING', 'STAGING'].includes(status) ? 'disable' : 'success'}
      />
      <Button
        onClick={stopRace}
        children={'Stop'}
        type={['RUNNING', 'STAGING'].includes(status) ? 'danger' : 'disable'}
      />
      <Button
        onClick={saveLaps}
        children={'Save'}
        type={status === 'STOPPED' ? 'danger' : 'disable'}
      />
      <Button
        onClick={discardLaps}
        children={'Discard'}
        type={status === 'STOPPED' ? 'danger' : 'disable'}
      />
    </div>
  )

  // const currentHeatBody =
  //   currentHeat?.slots?.map((pilot, index) => [pilot.pilotName, '', '', '']) || []
  // const currentLapsBody =
  //   laps.node_index
  //     ?.map(node => [node.pilot?.name, node?.laps.length, '', ''])
  //     .filter(item => !!item[0]) || []
  // const pilotTableHeaders = ['Pilot', 'Laps', 'Fastest Lap', 'Best 3']
  // const pilotTableBody = laps.node_index?.length ? currentLapsBody : currentHeatBody

  return (
    <div>
      <div className="flex items-stretch gap-4">
        <div className="w-1/4">
          <Card children={startAndStop} />
        </div>
        <div className="w-1/2">
          <Card children={<Watch startedAt={startedAt} status={status} />} />
        </div>
        <div className="w-1/4">
          <Card children={heatSelect} />
        </div>
      </div>
      <div className="my-4">
        <Card
          children={<Table headers={pilotTable.headers || []} body={pilotTable.body || []} />}
        />
      </div>

      <div className="w-full flex gap-4">
        <NodeCard
          chartData={chartData}
          chartTimes={chartTimes}
          chartIndex={0}
          frequencies={frequencies}
          currentLaps={laps}
        />
        <NodeCard
          chartData={chartData}
          chartTimes={chartTimes}
          chartIndex={1}
          frequencies={frequencies}
          currentLaps={laps}
        />
        <NodeCard
          chartData={chartData}
          chartTimes={chartTimes}
          chartIndex={2}
          frequencies={frequencies}
          currentLaps={laps}
        />
        <NodeCard
          chartData={chartData}
          chartTimes={chartTimes}
          chartIndex={3}
          frequencies={frequencies}
          currentLaps={laps}
        />
      </div>
    </div>
  )
}
