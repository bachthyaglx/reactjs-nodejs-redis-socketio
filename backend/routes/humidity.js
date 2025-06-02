const express = require('express')
const router = express.Router()
const { createClient } = require('redis')

const redisClient = createClient({ url: 'redis://redis:6379' })
redisClient.connect()

router.get('/humidity', async (req, res) => {
  const raw = await redisClient.get('latest:humidity')
  if (!raw) return res.status(404).json({ error: 'No data yet' })

  res.json(JSON.parse(raw))
})

module.exports = router
