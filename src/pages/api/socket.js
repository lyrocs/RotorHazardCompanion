import io from 'socket.io-client'
import { Server } from 'socket.io'

import { genericImport, getData } from '@/services/rh.service'
import transformPilots from '@/transformer/pilots'
import transformHeats from '@/transformer/heat'
import transformCurrentHeat from '@/transformer/current-heat'
import transformLaps from '@/transformer/laps'
import transformRaces from '@/transformer/races'
import transformResults from '@/transformer/results'
import transformPiTime from '@/transformer/pi-time'

import { startRace, stopRace } from '../../services/video.service'

export default (req, res) => {
  if (res.socket.server.client) {
    console.log('Socket RH is already running ')
  } else {
    console.log('Socket is initializing')

    const server = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: { origin: '*' },
    }).listen(3001)

    server.on('connection', socket => {
      console.log('Socket connected', socket.id)
      socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id)
      })
      socket.on('load_data', async data => {
        const loadTypes = data?.load_types || []

        if (loadTypes.length) {
          const dbData = await getData()
          loadTypes.forEach(key => {
            if (dbData[key]) {
              socket.emit(key, dbData[key])
            }
          })
          if (loadTypes.includes('races')) {
            socket.emit('race_list')
          }
        }
      })
    })
    res.socket.server.io = server

    const socket = io(process.env.RH_URL, {})

    socket.on('connect', () => {
      const data_dependencies = [
        'all_languages',
        'language',
        'result_data',
        'pilot_data',
        'current_heat',
        'frequency_data',
        'current_laps',
        'race_list',
        'get_pi_time',
        'race_status',
        'leaderboard',
        'class_data',
        'heat_data',
      ]
      socket.emit('load_data', { load_types: data_dependencies })
      socket.emit('get_pi_time')
      setInterval(() => {
        socket.emit('get_pi_time')
      }, 1000)
    })

    socket.on('heat_data', async data => {
      const heatData = await genericImport(data.heats, 'heat_data', 'heats', transformHeats)
      server?.emit('heats', heatData)
    })
    socket.on('class_data', async data => {
      const classData = await genericImport(
        data.classes,
        'class_data',
        'classes',
        item => item.class_data,
      )
      server?.emit('classes', classData)
    })
    socket.on('pilot_data', async data => {
      const pilotsData = await genericImport(data.pilots, 'pilot_data', 'pilots', transformPilots)
      server?.emit('pilots', pilotsData)
    })
    socket.on('current_heat', async data => {
      const heatData = await genericImport(
        data,
        'current_heat',
        'currentHeat',
        transformCurrentHeat,
      )
      server?.emit('currentHeat', heatData)
    })
    socket.on('frequency_data', async data => {
      const frequenciesData = await genericImport(
        data.fdata,
        'frequency_data',
        'frequencies',
        item => item.frequency_data,
      )
      server?.emit('frequencies', frequenciesData)
    })
    socket.on('current_laps', async data => {
      const lapsData = await genericImport(data, 'current_laps', 'laps', transformLaps)
      server?.emit('laps', lapsData)
    })
    socket.on('stage_ready', async data => {
      const stageData = await genericImport(data, 'stage_ready', 'stage', item => item.stage_ready)
      server?.emit('stage', stageData)
      server?.emit('start_race')
      startRace()
    })
    socket.on('stop_timer', async data => {
      stopRace()
      server?.emit('stop_race')
    })
    socket.on('race_list', async data => {
      const racesData = await genericImport(data, 'race_list', 'races', transformRaces)
      server?.emit('races', racesData)
    })
    socket.on('race_details', async data => {
      const raceDetailsData = await genericImport(
        data,
        'race_details',
        'raceDetails',
        item => item.race_details,
      )
      server?.emit('raceDetails', raceDetailsData)
    })
    socket.on('pi_time', async data => {
      const piTimeData = await genericImport(data, 'pi_time', 'piTime', transformPiTime)
      server?.emit('piTime', piTimeData)
    })
    socket.on('race_status', async data => {
      const raceStatusData = await genericImport(
        data,
        'race_status',
        'raceStatus',
        item => item.race_status,
      )
      server?.emit('raceStatus', raceStatusData)
    })
    socket.on('leaderboard', async data => {
      const leaderboardData = await genericImport(
        data,
        'leaderboard',
        'leaderboard',
        item => item.leaderboard,
      )
      server?.emit('leaderboard', leaderboardData)
    })
    socket.on('node_data', async data => {
      const nodeData = await genericImport(data, 'node_data', 'nodeData', item => item.node_data)
      server?.emit('nodeData', nodeData)
    })
    socket.on('heartbeat', async data => {
      server?.emit('heartbeat', data)
    })
    socket.on('result_data', async data => {
      const resultsData = await genericImport(data, 'result_data', 'results', transformResults)
      server?.emit('results', resultsData)
    })

    res.socket.server.client = socket
  }
  res.end()
}
