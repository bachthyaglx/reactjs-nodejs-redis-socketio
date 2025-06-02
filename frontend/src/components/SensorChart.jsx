import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import { socket } from '../socket'

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
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: { ticks: { autoSkip: true, maxTicksLimit: 20, display: false } },
          y: { beginAtZero: false }
        }
      }
    })

    chartInstance.current = chart

    // 1. Fetch REST API initial data
    fetch(`http://localhost:3001/api/${type}`)
      .then(res => res.json())
      .then(data => {
        if (data.value && data.timestamp) {
          const ts = new Date(data.timestamp).toLocaleTimeString()
          chart.data.labels.push(ts)
          chart.data.datasets[0].data.push(data.value)
          setValue(data.value)
          setTime(ts)
          chart.update()
        }
      })
      .catch(err => {
        console.warn(`REST API failed for ${type}`, err)
      })

    // 2. Listen realtime update from socket
    const handler = data => {
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

    socket.on(`${type}:update`, handler)
    return () => socket.off(`${type}:update`, handler)
  }, [type, label, color])

 return (
    <div className="chart-box">
      {/* Realtime data (sensor + time) */}
      <div className="label">
        {label}: <span className="value">{value}</span> {unit}
      </div>
      <div className="label">🕒 {time}</div>

      {/* Charts */}
      <canvas ref={chartRef}></canvas>

      {/* Custom legend - center */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '8px',
          gap: '8px'
        }}
      >
        <div
          style={{
            width: '20px',
            height: '10px',
            border: `3px solid ${color}`
          }}
        ></div>
        <span style={{ color: '#555', fontSize: '0.9rem' }}>{label}</span>
      </div>
    </div>
  )
}
