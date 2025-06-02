const express = require('express')
const router = express.Router()
const { latestData } = require('../data/cache')

router.get('/temperature', (req, res) => {
  const data = latestData.temperature
  if (!data) return res.status(404).json({ error: 'No data yet' })
  res.json(data)
})

module.exports = router
