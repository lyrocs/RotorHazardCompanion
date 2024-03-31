'use client'
import React, { useEffect, useState } from 'react'
import { SmoothieChart, TimeSeries } from 'smoothie'
import socketHelper from '@/helpers/socket.helper'
import fetchApi from '@/helpers/api.helper.js'
import ReactPlayer from 'react-player'
// import io from 'socket.io-client'

// const history_values = [
//   52, 52, 76, 76, 52, 52, 63, 63, 61, 61, 77, 77, 68, 68, 83, 83, 71, 71, 72, 72, 60, 60, 62, 62,
//   61, 61, 69, 69, 62, 62, 72, 72, 70, 70, 71, 71, 68, 68, 73, 73, 57, 57, 67, 67, 57, 57, 81, 81,
//   77, 77, 78, 78, 61, 61, 67, 67, 66, 66, 79, 79, 77, 77, 81, 81, 78, 78, 79, 79, 73, 73, 75, 75,
//   66, 66, 72, 72, 63, 63, 70, 70,
// ]
// const history_times = [
//   513.3466114969999, 530.3190891439999, 531.09858232, 531.398385366, 531.9994343045, 542.3064343045,
//   542.307401823, 542.4604382575001, 542.4853605725, 542.61133423, 542.6793532945, 542.8086737205,
//   542.9216917945, 542.96954935, 543.0967262385, 543.2287262385, 543.355446285, 543.366446285,
//   543.3673928129999, 543.385392813, 543.5397843869999, 543.5737843869999, 543.5876457475,
//   543.6376457475001, 543.6381725345, 543.6421725345, 543.7548479885, 543.832587303, 543.9744449515,
//   544.109774081, 544.2757942565, 544.3945394415, 544.640504914, 544.645504914, 544.646542673,
//   544.6725426730001, 544.7145342655001, 544.7885342655001, 544.8305995895, 544.8645995895,
//   545.045521099, 545.1122679135, 545.2386905709999, 545.3386905709999, 545.4396099505001,
//   545.477555969, 545.6975068485, 545.768657043, 545.9493094595, 546.0143094595, 545.9805917835,
//   546.097650802, 546.3169442650001, 546.3466149960001, 546.5219395055, 546.6569395055,
//   546.657642626, 546.7456390425001, 546.9689113754999, 546.9969113755, 547.00867557, 547.09567557,
//   547.11762007, 547.1926200700001, 547.2164003104999, 547.2324003104999, 547.2336734215,
//   547.2766734215, 547.4039896249999, 547.4119896249999, 547.4716908290001, 547.5527966805,
//   548.106762449, 548.2647426799999, 548.3077226985, 548.4821541704999, 549.6618020129999,
//   549.8878588449999, 550.9039415115, 551.378667558,
// ]

export default function Marshal() {
  const [playing, setPlaying] = useState(false)
  const [currentPilotRace, setCurrentPilotRace] = useState(true)
  const [activeVideoName, setActiveVideoName] = useState('')
  const [activeRace, setActiveRace] = useState({})
  const [races, setRaces] = useState(null)
  const [racesVideo, setRacesVideo] = useState(null)
  const [raceList, setRaceList] = useState(null)
  const [raceDetail, setRaceDetail] = useState(null)
  const [selectedRound, setSelectedRound] = useState(null)
  const canvas = React.useRef(null)
  const player = React.useRef(null)

  useEffect(() => {
    fetchApi('/api/race').then(data => {
      setRaces(data)
    })
  }, [])

  useEffect(() => {
    const socket = socketHelper()

    socket.emit('load_data', { load_types: ['races', 'raceDetails', 'racesVideo'] })

    socket.on('races', data => {
      setRaceList(data)
    })

    socket.on('raceDetails', data => {
      setRaceDetail(data)
    })

    socket.on('stop_race', data => {
      fetchApi('/api/race').then(data => {
        setRaces(data)
      })
      socket.emit('load_data', { load_types: ['racesVideo'] })
    })

    socket.on('start_race', data => {
      fetchApi('/api/race').then(data => {
        setRaces(data)
      })
    })

    socket.on('racesVideo', data => {
      setRacesVideo(data)
    })

    return () => {
      socket.close()
    }
  }, [])

  const renderChart = () => {
    if (!raceDetail) {
      return
    }
    let history_times = raceDetail.history_times || []
    let history_values = raceDetail.history_values || []
    history_times = [history_times[0] - (activeRace.staging || 0), ...history_times]
    history_values = [0, ...history_values]

    const chart = new SmoothieChart({
      responsive: true,
      grid: {
        strokeStyle: 'rgba(255,255,255,0.25)',
        // millisPerLine:1, // Smoothie thinks the timestamps are in seconds
        sharpLines: true,
        verticalSections: 0,
        borderVisible: false,
      },
      labels: {
        precision: 0,
      },
      scaleSmoothing: 1,
    })
    const series = new TimeSeries()

    history_values.forEach((value, index) => {
      series.append(history_times[index], history_values[index])
    })

    chart.addTimeSeries(series, {
      lineWidth: 2,
      strokeStyle: '#00ff00',
      fillStyle: 'rgb(0, 60, 0)',
    })
    chart.streamTo(canvas.current, 1)

    chart.stop()
    var graphWidth = 1

    var startTime = history_times[0]
    var endTime = history_times[history_times.length - 1]
    var duration = endTime - startTime
    var span = duration / graphWidth

    // todo replace 800 by canvas el width
    chart.options.millisPerPixel = span / 800
    chart.options.minValue = Math.min.apply(null, history_values) - 5
    chart.options.maxValue = Math.max.apply(null, history_values) + 5
    chart.options.horizontalLines = [
      { color: 'hsl(8.2, 86.5%, 53.7%)', lineWidth: 1.7, value: raceDetail?.enter_at || 0 }, // red
      { color: 'hsl(25, 85%, 55%)', lineWidth: 1.7, value: raceDetail?.exit_at || 0 }, // orange
    ]

    chart.render(canvas.current, endTime)
  }

  useEffect(() => {
    renderChart()
  }, [raceDetail])

  const fetchPilotRace = async function (pilotrace_id) {
    const { heatId, roundIndex } = selectedRound
    console.log('fetchPilotRace', pilotrace_id, heatId, roundIndex)
    setCurrentPilotRace(pilotrace_id)
    await fetchApi('/api/marshal/pilotrace/' + pilotrace_id, { method: 'POST' })
    const currentRaceVideo = racesVideo.find(
      raceVideo => raceVideo.heatId === heatId && raceVideo.round === roundIndex,
    )
    console.log('fec pilote', currentRaceVideo, races, heatId, roundIndex)
    if (currentRaceVideo) {
      setActiveVideoName(currentRaceVideo.videoPath)
      setActiveRace(currentRaceVideo)
    }
  }

  const mouseUp = function (evt) {
    var x = (evt.pageX - evt.target.offsetLeft) / evt.target.offsetWidth

    renderChart()
    let context = canvas.current.getContext('2d')
    context.strokeStyle = '#ffffff'
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(canvas.current.clientWidth * x, 0)
    context.lineTo(canvas.current.clientWidth * x, 100)
    context.stroke()
    context.save()
    player.current.seekTo(x)
    setPlaying(true)
  }

  const onProgress = function (e) {
    renderChart()
    let context = canvas.current.getContext('2d')
    context.strokeStyle = '#ffffff'
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(canvas.current.clientWidth * e.played, 0)
    context.lineTo(canvas.current.clientWidth * e.played, 100)
    context.stroke()
    context.save()
  }

  const hasReccord = (heatId, round) => {
    return racesVideo?.find(raceVideo => raceVideo.heatId === heatId && raceVideo.round === round)
      ? '🎥'
      : ''
  }

  const raceListTable = (
    <div className="flex justify-center  p-8">
      <table className="table-auto pt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Heat name</th>
            <th className="px-4 py-2">Rounds</th>
          </tr>
        </thead>
        <tbody>
          {raceList &&
            raceList.map(race => (
              <tr>
                <td>{race.displayname}</td>
                {race.rounds.map((round, roundIndex) => (
                  <td>
                    <button
                      className={
                        selectedRound?.race_id === round.race_id
                          ? 'bg-green-800 text-white px-4 py-2 rounded'
                          : 'bg-gray-500 text-white px-4 py-2 rounded'
                      }
                      onClick={() =>
                        setSelectedRound({
                          heatId: race.heat_id,
                          roundIndex: roundIndex + 1,
                          ...round,
                        })
                      }
                    >
                      Round {roundIndex + 1} {hasReccord(race.heat_id, roundIndex + 1)}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )

  const roundTable = selectedRound && (
    <div className="flex justify-center  p-8">
      <table className="table-auto pt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Pilot #1</th>
            <th className="px-4 py-2">Pilot #2</th>
            <th className="px-4 py-2">Pilot #3</th>
            <th className="px-4 py-2">Pilot #4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {selectedRound.pilotraces.map(pilot => (
              <td>
                <button
                  className={
                    currentPilotRace === pilot.pilotrace_id
                      ? 'bg-green-800 text-white px-4 py-2 rounded'
                      : 'bg-gray-500 text-white px-4 py-2 rounded'
                  }
                  onClick={() => fetchPilotRace(pilot.pilotrace_id)}
                >
                  {pilot.callsign}
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )

  return (
    <>
      <div className="flex flex-col justify-center gap-8 p-8">
        {raceListTable}
        <button
          className="bmb-4 bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => fetchApi('/api/marshal/update')}
        >
          Refresh
        </button>
        {roundTable}
        <div className="w-full flex justify-center">
          <div className="">
            <canvas
              ref={canvas}
              id="smoothie-chart"
              style={{ width: '800px', height: '200px' }}
              onMouseUp={mouseUp}
            ></canvas>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <ReactPlayer
            ref={player}
            url={`${process.env.NEXT_PUBLIC_API_URL}/api/marshal/video?filename=${activeVideoName}`}
            width="1000px"
            height="500px"
            onProgress={onProgress}
            playing={playing}
            controls
          />
        </div>
      </div>
    </>
  )
}
