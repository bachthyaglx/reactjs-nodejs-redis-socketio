const { latestData } = require('../data/cache')
const { generateValue } = require('../sensors/generator')
const sensorTypes = require('../sensors/types')

async function setupSocket(pub, sub, io) {
  await pub.connect()
  await sub.connect()

  for (const type of sensorTypes) {
    await sub.subscribe(`sensor:${type}`, msg => {
      const data = JSON.parse(msg)
      latestData[type] = data
      io.emit(`${type}:update`, data)
    })
  }

  setInterval(() => {
    const now = new Date().toISOString()
    for (const type of sensorTypes) {
      const value = generateValue(type)
      pub.publish(`sensor:${type}`, JSON.stringify({ value, timestamp: now }))
    }
  }, 1000)
}

module.exports = { setupSocket }
