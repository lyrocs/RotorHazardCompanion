import db from '@/lib/db';

export default (req, res) => {
    db.read();
    res.json(db.data?.racesVideo)
  }
  