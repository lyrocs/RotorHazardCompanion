import db from '@/lib/db'

export async function genericImport(rawData, rhKey, key, transformer) {
  await db.read()
  db.data.rh[rhKey] = rawData
  const transformedData = transformer(db.data.rh)
  // db.data[key] = transformedData
  await db.update(({ rh }) => (rh[rhKey] = rawData))
  await db.update(data => (data[key] = transformedData))
  // await db.write()
  return transformedData
}

export async function getData() {
  await db.read()
  return db.data
}
