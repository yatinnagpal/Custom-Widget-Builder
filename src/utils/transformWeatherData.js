export default function transformWeatherData(apiJson) {
  const hourly = apiJson.hourly || {};
  const times = hourly.time || [];
  const temps = hourly.temperature_2m || [];
  const prec = hourly.precipitation || [];

  // limit to first 24 entries (roughly one day)
  const labels = times.slice(0, 24).map(t => (typeof t === 'string' ? t.slice(11, 16) : String(t)));
  const tempData = temps.slice(0, 24);
  const precData = prec.slice(0, 24);

  const datasets = [
    {
      label: 'Temperature (°C)',
      data: tempData,
      backgroundColor: 'rgba(255,99,132,0.5)',
      borderColor: 'rgba(255,99,132,1)',
      yAxisID: 'y'
    },
    {
      label: 'Precipitation (mm)',
      data: precData,
      backgroundColor: 'rgba(54,162,235,0.5)',
      borderColor: 'rgba(54,162,235,1)',
      yAxisID: 'y1'
    }
  ];

  const avgTemp = tempData.length ? tempData.reduce((a, b) => a + b, 0) / tempData.length : 0;
  const totalPrec = precData.length ? precData.reduce((a, b) => a + b, 0) : 0;

  const pieData = {
    labels: ['Avg Temp (°C)', 'Total Precip (mm)'],
    datasets: [
      {
        data: [Number(avgTemp.toFixed(2)), Number(totalPrec.toFixed(2))],
        backgroundColor: ['rgba(255,99,132,0.7)', 'rgba(54,162,235,0.7)']
      }
    ]
  };

  return { labels, datasets, pieData };
}
