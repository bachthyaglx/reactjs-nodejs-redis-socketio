const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { createClient } = require('redis')
const { createAdapter } = require('@socket.io/redis-adapter')
const sensorTypes = require('./sensor-simulator/types')
const { latestData } = require('./sensor-simulator/cache')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

const pub = createClient({ url: 'redis://redis:6379' })
const sub = createClient({ url: 'redis://redis:6379' })
const redisCache = createClient({ url: 'redis://redis:6379' })

const subscriptions = {}

async function start() {
  await pub.connect()
  await sub.connect()
  await redisCache.connect()
  io.adapter(createAdapter(pub, sub))

  for (const type of sensorTypes) {
    await sub.subscribe(`sensor:${type}`, async msg => {
      const data = JSON.parse(msg)

      const enriched = {
        ...data,
        type,
        time: new Date().toISOString()
      }

      await redisCache.set(`latest:${type}`, JSON.stringify(enriched))
      latestData[type] = enriched

      for (const [socketId, types] of Object.entries(subscriptions)) {
        if (types.has(type)) {
          io.to(socketId).emit(`${type}:update`, enriched)
        }
      }
    })
  }

  io.on('connection', socket => {
    subscriptions[socket.id] = new Set()

    socket.on('subscribe', (type) => {
      if (sensorTypes.includes(type)) {
        subscriptions[socket.id].add(type)
      }
    })

    socket.on('get-latest', async (type) => {
      const raw = await redisCache.get(`latest:${type}`)
      if (raw) {
        socket.emit(`latest-${type}`, JSON.parse(raw))
      }
    })

    socket.on('disconnect', () => {
      delete subscriptions[socket.id]
    })
  })

  server.listen(4000)
}

start().catch(console.error)
