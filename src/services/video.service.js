import db from '@/lib/db'
import OBSWebSocket from 'obs-websocket-js';

export async function startRace() {
  try {
    await db.read() 
    const obs = new OBSWebSocket();
    await obs.connect('ws://127.0.0.1:4455', 'super-sekret');
    await obs.call('StartRecord');
    await obs.disconnect();
  
    const currentHeat = db.data.currentHeat?.current || {}
    const raceStatus = db.data.raceStatus
    const staging  = raceStatus.pi_starts_at_s - raceStatus.pi_staging_at_s
    db.data.racesVideo.push({
      start_time: new Date(),
      end_time: null,
      videoPath: '',
      heatName: currentHeat?.name || '',
      heatId: raceStatus?.race_heat_id || '',
      round: raceStatus?.next_round || '',
      staging,
    })
    await db.write()
  } catch (error) {

  }
}

export async function stopRace() {
  try {
    await db.read()
    const obs = new OBSWebSocket();
    await obs.connect('ws://127.0.0.1:4455', 'super-sekret');
    const reponse = await obs.call('StopRecord');
    await obs.disconnect();
    const {racesVideo} = db.data
    const fileName = reponse.outputPath || '';
    racesVideo[racesVideo.length - 1].end_time = new Date()
    racesVideo[racesVideo.length - 1].videoPath = fileName
    await db.update(({racesVideo}) => racesVideo)
  } catch (error) {

  }
}
