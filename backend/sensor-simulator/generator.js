function generateValue(type) {
  switch (type) {
    case 'temperature': return +(20 + Math.random() * 10).toFixed(2)
    case 'pressure': return +(1000 + Math.random() * 50).toFixed(2)
    case 'voltage': return +(220 + Math.random() * 5).toFixed(1)
    case 'current': return +(5 + Math.random()).toFixed(2)
    case 'humidity': return +(40 + Math.random() * 20).toFixed(2)
    default: return +(Math.random() * 100).toFixed(2)
  }
}

module.exports = { generateValue }
