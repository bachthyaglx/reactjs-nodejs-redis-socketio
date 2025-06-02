// publisher.js
const { createClient } = require('redis')
const { generateValue } = require('./generator')
const sensorTypes = require('./types')

const pub = createClient({ url: 'redis://redis:6379' })

async function start() {
  await pub.connect()
  console.log('🔁 Publisher started')

  setInterval(() => {
    const now = new Date().toISOString()
    for (const type of sensorTypes) {
      const value = generateValue(type)
      pub.publish(`sensor:${type}`, JSON.stringify({ value, timestamp: now }))
    }
  }, 1000)
}

start().catch(console.error)
