import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function StaffPerformanceGraph({profileData}) {
  const getRandomDarkColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  const colors = profileData.staff.map(() => getRandomDarkColor());
  
  const data = {
    labels: profileData.staff.map((staff) => staff.name),
    datasets: [{
      label: 'Average Rating',
      data: profileData.staff.map((staff) => staff.rating),
      backgroundColor: colors,
      borderColor: colors,
    }],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Staff Performance',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Staff Name',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Rating',
        },
        min: 1,
        max: 5,
      },
    },
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className='text-2xl font-bold mb-4'>Staff Performance</h2>
      <div className="h-[400px]">
        <Bar options={options} data={data} />
      </div>
      <div className="mt-4 flex flex-wrap justify-center">
        {profileData.staff.map((staff, index) => (
          <div key={staff.id} className="flex items-center mr-4 mb-2">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: colors[index] }}
            ></div>
            <span>{staff.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
