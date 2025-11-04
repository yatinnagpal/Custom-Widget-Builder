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
  if (!data) return null;
  if (type === 'pie') return <Pie data={data} options={options} />;
  if (type === 'bar') return <Bar data={data} options={options} />;
  return <Line data={data} options={options} />;
}
