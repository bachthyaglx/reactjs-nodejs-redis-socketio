import React from 'react'
import SensorChart from './components/SensorChart'
import './App.css'

export default function App() {
  const sensors = [
    { type: 'temperature', unit: '°C', label: '🌡 Temperature', color: '#f5426f' },
    { type: 'pressure', unit: 'hPa', label: '⛽ Pressure', color: '#4287f5' },
    { type: 'voltage', unit: 'V', label: '🔌 Voltage', color: '#42f59e' },
    { type: 'current', unit: 'A', label: '⚡ Current', color: '#f5a742' },
    { type: 'humidity', unit: '%', label: '💧 Humidity', color: '#8a42f5' }
  ]

  return (
    <div className="container">
      <h1>Realtime Sensor Dashboard</h1>
      <div className="grid">
        {sensors.map(sensor => (
          <SensorChart key={sensor.type} {...sensor} />
        ))}
      </div>
    </div>
  )
}
