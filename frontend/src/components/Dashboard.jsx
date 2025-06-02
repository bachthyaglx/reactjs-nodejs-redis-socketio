import React, { useState } from 'react'
import SensorChart from './SensorChart'

const sensors = [
  { type: 'temperature', unit: '°C', label: 'Temperature', color: 'red' },
  { type: 'humidity', unit: '%', label: 'Humidity', color: 'blue' },
  { type: 'pressure', unit: 'hPa', label: 'Pressure', color: 'green' },
  { type: 'voltage', unit: 'V', label: 'Voltage', color: 'orange' },
  { type: 'current', unit: 'A', label: 'Current', color: 'purple' }
]

export default function Dashboard() {
  const [visible, setVisible] = useState(() =>
    Object.fromEntries(sensors.map(({ type }) => [type, true]))
  )

  const toggleChart = (type) => {
    setVisible(prev => ({ ...prev, [type]: !prev[type] }))
  }

  return (
    <div>
      {/* Toggle buttons */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {sensors.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => toggleChart(type)}
            style={{
              padding: '6px 12px',
              background: visible[type] ? '#4caf50' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {visible[type] ? `Hide ${label}` : `Show ${label}`}
          </button>
        ))}
      </div>

      {/* Charts (only render if visible) */}
      <div className="grid grid-cols-2 gap-4">
        {sensors.map(sensor =>
          visible[sensor.type] ? (
            <SensorChart key={sensor.type} {...sensor} />
          ) : null
        )}
      </div>
    </div>
  )
}
