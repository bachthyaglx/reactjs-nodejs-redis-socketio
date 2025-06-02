const express = require('express')
const router = express.Router()
const { latestData } = require('../data/cache')

router.get('/pressure', (req, res) => {
  const data = latestData.pressure
  if (!data) return res.status(404).json({ error: 'No data yet' })
  res.json(data)
})

module.exports = router
