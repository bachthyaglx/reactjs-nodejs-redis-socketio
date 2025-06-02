const express = require('express')
const http = require('http')
const cors = require('cors')
const { createClient } = require('redis')
const { Server } = require('socket.io')
const sensorTypes = require('./sensors/types')
const { setupSocket } = require('./socket/socketHandler')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(cors())

// Load routes
for (const type of sensorTypes) {
  app.use('/api', require(`./routes/${type}`))
}

// Socket.io + Redis Pub/Sub
const pub = createClient({ url: 'redis://redis:6379' })
const sub = createClient({ url: 'redis://redis:6379' })

setupSocket(pub, sub, io).catch(console.error)

io.on('connection', socket => {
  console.log('✅ Client connected')
})

server.listen(3001, () => {
  console.log('🚀 Backend ready at http://localhost:3001')
})
