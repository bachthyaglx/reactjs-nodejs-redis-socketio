const express = require('express')
const router = express.Router()
const { latestData } = require('../data/cache')

router.get('/current', (req, res) => {
  const data = latestData.current
  if (!data) return res.status(404).json({ error: 'No data yet' })
  res.json(data)
})

module.exports = router
