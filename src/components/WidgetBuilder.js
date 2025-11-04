import React, { useState } from 'react';
import ChartRenderer from './ChartRenderer';
import transformWeatherData from '../utils/transformWeatherData';

export default function WidgetBuilder() {
  const [chartType, setChartType] = useState('line');
  const [lat, setLat] = useState('40.71');
  const [lon, setLon] = useState('-74.01');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const start = now.toISOString().slice(0, 10);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
        lat
      )}&longitude=${encodeURIComponent(
        lon
      )}&hourly=temperature_2m,precipitation&start_date=${start}&end_date=${tomorrow}&timezone=UTC`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch weather data');
      const json = await res.json();
      const transformed = transformWeatherData(json);
      setData(transformed);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const chartData =
    chartType === 'pie' ? data && data.pieData : data && { labels: data.labels, datasets: data.datasets };

  const options =
    chartType === 'line'
      ? {
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          scales: {
            y: { type: 'linear', position: 'left', title: { display: true, text: 'Temperature (°C)' } },
            y1: {
              type: 'linear',
              position: 'right',
              grid: { drawOnChartArea: false },
              title: { display: true, text: 'Precipitation (mm)' }
            }
          }
        }
      : { responsive: true };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h3>Custom Widget Builder</h3>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
        <label>
          Chart:
          <select value={chartType} onChange={e => setChartType(e.target.value)} style={{ marginLeft: 6 }}>
            <option value="line">Line (Temperature + Precip)</option>
            <option value="bar">Bar (Temperature + Precip)</option>
            <option value="pie">Pie (Avg Temp vs Total Precip)</option>
          </select>
        </label>
        <label>
          Latitude:
          <input value={lat} onChange={e => setLat(e.target.value)} style={{ marginLeft: 6, width: 110 }} />
        </label>
        <label>
          Longitude:
          <input value={lon} onChange={e => setLon(e.target.value)} style={{ marginLeft: 6, width: 110 }} />
        </label>
        <button onClick={fetchData} disabled={loading} style={{ marginLeft: 10 }}>
          {loading ? 'Loading...' : 'Fetch & Render'}
        </button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {chartData ? (
        <ChartRenderer type={chartType} data={chartData} options={options} />
      ) : (
        <div>Click "Fetch & Render" to load data.</div>
      )}
    </div>
  );
}
