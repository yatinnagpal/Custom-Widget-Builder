import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export default function ChartRenderer({ type = 'line', data, options }) {
  if (!data || !data.datasets) return null;
  
  if (type === 'pie' && data.datasets?.[0]) {
    data.datasets[0].backgroundColor = [
      '#4C6EF5', // blue
      '#51CF66', // green
      '#FF6B6B', // red
      '#FAB005', // yellow
      '#BE4BDB'  // purple
    ];
  }

  const chartOptions = {
    ...options,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: true
      },
      title: {
        display: true,
        text: data.title || 'Chart'
      },
    },
  };

  if (type === 'pie') return <Pie data={data} options={chartOptions} />;
  if (type === 'bar') return <Bar data={data} options={chartOptions} />;
  return <Line data={data} options={chartOptions} />;
}
