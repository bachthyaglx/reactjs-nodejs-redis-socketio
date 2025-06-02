const express = require('express')
const cors = require('cors')

const current = require('./routes/current')
const humidity = require('./routes/humidity')
const pressure = require('./routes/pressure')
const temperature = require('./routes/temperature')
const voltage = require('./routes/voltage')

const app = express()

// Middleware
app.use(cors())
app.use(express.json()) 

// Load REST API routes
app.use('/api', current)
app.use('/api', humidity)
app.use('/api', pressure)
app.use('/api', temperature)
app.use('/api', voltage)

// Start REST API server
app.listen(3001, () => {
  console.log('🚀 REST API running at http://localhost:3001')
})
