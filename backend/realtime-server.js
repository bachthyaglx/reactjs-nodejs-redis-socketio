const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { createClient } = require('redis')
const { createAdapter } = require('@socket.io/redis-adapter')
const sensorTypes = require('./sensors/types')
const { latestData } = require('./data/cache')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

const pub = createClient({ url: 'redis://redis:6379' });
const sub = createClient({ url: 'redis://redis:6379' });

async function start() {
  await pub.connect()
  await sub.connect()
  io.adapter(createAdapter(pub, sub))

  for (const type of sensorTypes) {
    await sub.subscribe(`sensor:${type}`, msg => {
      const data = JSON.parse(msg)
      latestData[type] = data
      io.emit(`${type}:update`, data)
    })
  }

  io.on('connection', socket => {
    console.log('✅ Client connected:', socket.id)
  })

  server.listen(4000, () => {
    console.log('🚀 Realtime server ready at http://localhost:4000')
  })
}

start().catch(console.error)
