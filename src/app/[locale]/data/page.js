'use client'

import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite'
import React, { useEffect, useState } from 'react'
import 'react-json-view-lite/dist/index.css'
import socketHelper from '@/helpers/socket.helper'

export default function Data() {
  const [json, setJson] = useState(null)
  const [json2, setJson2] = useState(null)
  const [heats, setHeats] = useState(null)
  const [classes, setClasses] = useState(null)
  const [pilots, setPilots] = useState(null)
  const [currentHeat, setCurrentHeat] = useState(null)
  const [frequencies, setFrequencies] = useState(null)
  const [laps, setLaps] = useState(null)
  const [stage, setStage] = useState(null)
  const [races, setRaces] = useState(null)
  const [raceDetails, setRaceDetails] = useState(null)
  const [piTime, setPiTime] = useState(null)
  const [raceStatus, setRaceStatus] = useState(null)
  const [leaderboard, setLeaderboard] = useState(null)
  const [nodeData, setNodeData] = useState(null)
  const [heartbeat, setHeartbeat] = useState(null)
  const [results, setResults] = useState(null)
  const [racesVideo, setRacesVideo] = useState(null)
  const [config, setConfig] = useState(null)
  

  useEffect(() => {
    const socket = socketHelper()
    socket.emit('load_data', {
      load_types: [
        'heats',
        'classes',
        'pilots',
        'currentHeat',
        'frequencies',
        'laps',
        'stage',
        'races',
        'raceDetails',
        'piTime',
        'raceStatus',
        'leaderboard',
        'nodeData',
        'heartbeat',
        'results',
        "racesVideo",
        "config"
      ],
    })

    socket.on('get_data', data => {
      setJson(data)
    })
    socket.on('get_race_details', data => {
      setJson2(data)
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
    socket.on('currentHeat', data => {
      setCurrentHeat(data)
    })
    socket.on('frequencies', data => {
      setFrequencies(data)
    })
    socket.on('laps', data => {
      setLaps(data)
    })
    socket.on('stage', data => {
      setStage(data)
    })
    socket.on('races', data => {
      setRaces(data)
    })
    socket.on('raceDetails', data => {
      setRaceDetails(data)
    })
    socket.on('piTime', data => {
      setPiTime(data)
    })
    socket.on('raceStatus', data => {
      setRaceStatus(data)
    })
    socket.on('leaderboard', data => {
      setLeaderboard(data)
    })
    socket.on('nodeData', data => {
      setNodeData(data)
    })
    socket.on('heartbeat', data => {
      setHeartbeat(data)
    })
    socket.on('results', data => {
      setResults(data)
    })
    socket.on('racesVideo', data => {
      setRacesVideo(data)
    })
    socket.on('config', data => {
      setConfig(data)
    })
    

    return () => {
      socket.close()
    }
  }, [])

  return (
    <>
      <div className="text-white">
        <JsonView data={json} style={defaultStyles} />
        <JsonView data={json2} style={defaultStyles} />
        <span>Heats</span>
        <JsonView data={heats} style={defaultStyles} />
        <span>Classes</span>
        <JsonView data={classes} style={defaultStyles} />
        <span>Pilots</span>
        <JsonView data={pilots} style={defaultStyles} />
        <span>Current Heat</span>
        <JsonView data={currentHeat} style={defaultStyles} />
        <span>Frequencies</span>
        <JsonView data={frequencies} style={defaultStyles} />
        <span>Laps</span>
        <JsonView data={laps} style={defaultStyles} />
        <span>Stage</span>
        <JsonView data={stage} style={defaultStyles} />
        <span>Races</span>
        <JsonView data={races} style={defaultStyles} />
        <span>Race Details</span>
        <JsonView data={raceDetails} style={defaultStyles} />
        <span>Pi Time</span>
        <JsonView data={piTime} style={defaultStyles} />
        <span>Race Status</span>
        <JsonView data={raceStatus} style={defaultStyles} />
        <span>Leaderboard</span>
        <JsonView data={leaderboard} style={defaultStyles} />
        <span>Node Data</span>
        <JsonView data={nodeData} style={defaultStyles} />
        <span>Heartbeat</span>
        <JsonView data={heartbeat} style={defaultStyles} />
        <span>Results</span>
        <JsonView data={results} style={defaultStyles} />
        <span>Race videos</span>
        <JsonView data={racesVideo} style={defaultStyles} />
        <span>Config</span>
        <JsonView data={config} style={defaultStyles} />
      </div>
    </>
  )
}
