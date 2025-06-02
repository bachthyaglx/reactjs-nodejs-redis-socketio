import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import { socket } from '../utils/socket'

export default function SensorChart({ type, unit, label, color }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [value, setValue] = useState('--')
  const [time, setTime] = useState('--')

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{ label, data: [], borderColor: color, backgroundColor: 'transparent' }]
      },
      options: {
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { display: false } },
          y: { beginAtZero: false }
        }
      }
    })
    chartInstance.current = chart

    socket.emit('subscribe', type)
    socket.emit('get-latest', type)

    const handleUpdate = data => {
      const ts = new Date(data.timestamp).toLocaleTimeString()
      chart.data.labels.push(ts)
      chart.data.datasets[0].data.push(data.value)
      if (chart.data.labels.length > 20) {
        chart.data.labels.shift()
        chart.data.datasets[0].data.shift()
      }
      chart.update()
      setValue(data.value)
      setTime(ts)
    }

    const handleLatest = data => handleUpdate(data)

    socket.on(`${type}:update`, handleUpdate)
    socket.on(`latest-${type}`, handleLatest)

    return () => {
      socket.emit('unsubscribe', type) // 👈 gửi khi unmount
      socket.off(`${type}:update`, handleUpdate)
      socket.off(`latest-${type}`, handleLatest)
      chart.destroy()
    }
  }, [type, label, color])

  return (
    <div className="chart-box">
      <div className="label">{label}: <span className="value">{value}</span> {unit}</div>
      <div className="label">🕒 {time}</div>
      <canvas ref={chartRef}></canvas>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
        <div style={{ width: '20px', height: '10px', border: `3px solid ${color}` }}></div>
        <span style={{ marginLeft: '8px', color: '#555' }}>{label}</span>
      </div>
    </div>
  )
}
