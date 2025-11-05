// Chart colors
const chartColors = [
  '#4C6EF5', // blue
  '#51CF66', // green
  '#FF6B6B', // red
  '#FAB005', // yellow
  '#BE4BDB'  // purple
];

/**
 * Converts time series data (e.g., monthly sales) to chart format
 * Example input: { timePoints: ['Jan', 'Feb'], measurements: [100, 200] }
 */
function formatTimeSeriesData(data) {
  const { timePoints, measurements, title = 'Time Series' } = data;

  return {
    labels: timePoints,
    datasets: [{
      label: 'Value',
      data: measurements,
      backgroundColor: chartColors[0],
      borderColor: chartColors[0]
    }],
    title
  };
}

/**
 * Converts distribution data (e.g., sales by product) to chart format
 * Example input: { categories: ['Product A', 'Product B'], values: [300, 400] }
 */
function formatDistributionData(data) {
  const { categories, values, title = 'Distribution' } = data;

  return {
    labels: categories,
    datasets: [{
      label: title,
      data: values,
      backgroundColor: chartColors
    }],
    title
  };
}

/**
 * Converts comparison data (e.g., target vs actual) to chart format
 * Example input: { categories: ['Q1', 'Q2'], actual: [100, 200], target: [90, 180] }
 */
function formatComparisonData(data) {
  const { categories, actual, target, title = 'Comparison' } = data;

  return {
    labels: categories,
    datasets: [
      {
        label: 'Actual',
        data: actual,
        backgroundColor: chartColors[0],
        borderColor: chartColors[0]
      },
      {
        label: 'Target',
        data: target,
        backgroundColor: chartColors[1],
        borderColor: chartColors[1]
      }
    ],
    title
  };
}

/**
 * Main function to convert API data to chart format
 */
export function normalizeApiData(apiData, type) {
  switch (type) {
    case 'timeSeries':
      return formatTimeSeriesData(apiData);
    case 'distribution':
      return formatDistributionData(apiData);
    case 'comparison':
      return formatComparisonData(apiData);
    default:
      throw new Error(`Unsupported data type: ${type}`);
  }
}