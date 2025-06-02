import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import { socket } from '../utils/socket'

type SensorChartProps = {
  type: string;
  unit: string;
  label: string;
  color: string;
};

export default function SensorChart({ type, unit, label, color }: SensorChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart<"line", number[], string> | null>(null)
  const [value, setValue] = useState('--')
  const [time, setTime] = useState('--')

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [] as string[],
        datasets: [{ label, data: [] as number[], borderColor: color, backgroundColor: 'transparent' }]
      },
      options: {
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { display: false } },
          y: { beginAtZero: false }
        }
      }
    });
    chartInstance.current = chart;

    socket.emit('subscribe', type)
    socket.emit('get-latest', type)

    const handleUpdate = (data: { timestamp: string | number | Date; value: number | React.SetStateAction<string>; }) => {
      const ts = new Date(data.timestamp).toLocaleTimeString()
      if (chart.data.labels && chart.data.datasets[0].data) {
        chart.data.labels.push(ts)
        if (typeof data.value === 'number') {
          chart.data.datasets[0].data.push(data.value)
        } else if (!isNaN(Number(data.value))) {
          chart.data.datasets[0].data.push(Number(data.value))
        } else {
          chart.data.datasets[0].data.push(0) // fallback value
        }
        if (chart.data.labels.length > 20) {
          chart.data.labels.shift()
          chart.data.datasets[0].data.shift()
        }
        chart.update()
      }
      setValue(String(data.value))
      setTime(ts)
    }

    const handleLatest = (data: any) => handleUpdate(data)

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
