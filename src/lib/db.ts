import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const db = new Low(new JSONFile('db.json'), {
  rh: {},
  races: [],
  racesVideo: [],
  classes: [],
  pilots: [],
  currentHeat: {},
  frequencies: [],
  laps: [],
  stage: {},
  raceDetails: {},
  piTime: {},
  raceStatus: {},
  results: {},
  finals: [],
  qualifs: [],
  finalResult: [],
  config: {}
} as any)

export default db
