import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const pastWeekData = [
  { day: 'Mon', tips: 45 },
  { day: 'Tue', tips: 60 },
  { day: 'Wed', tips: 55 },
  { day: 'Thu', tips: 75 },
  { day: 'Fri', tips: 90 },
  { day: 'Sat', tips: 100 },
  { day: 'Sun', tips: 85 },
]

export default function PerformanceGraph() {
  const data = {
    labels: pastWeekData.map((data) => data.day),
    datasets: [
      {
        label: 'Daily Tips',
        data: pastWeekData.map((data) => data.tips),
        borderColor: '#48CFCB',
        backgroundColor: 'rgba(72, 207, 203, 0.5)',
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance (Past 7 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Tips ($)',
        },
      },
    },
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Performance</h2>
      <Line data={data} options={options} />
    </div>
  )
}