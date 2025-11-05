import { normalizeApiData } from '../utils/chartDataAdapter';

// Mock KPI endpoints with different data formats
const kpiEndpoints = {
  KPI1: {
    getData: async () => ({
      timePoints: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      measurements: [65, 59, 80, 81, 56, 55],
      title: 'Monthly Sales Performance'
    }),
    type: 'timeSeries'
  },
  KPI2: {
    getData: async () => ({
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      actual: [120, 150, 180, 190],
      target: [100, 140, 160, 180],
      title: 'Quarterly Revenue vs Target'
    }),
    type: 'comparison'
  },
  KPI3: {
    getData: async () => ({
      categories: ['Product A', 'Product B', 'Product C', 'Product D'],
      values: [300, 150, 100, 200],
      title: 'Product Revenue Distribution'
    }),
    type: 'distribution'
  }
};

export const getKpiData = async (kpiId) => {
  if (!kpiEndpoints[kpiId]) {
    throw new Error(`KPI ${kpiId} not found`);
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get raw data and normalize it
  const endpoint = kpiEndpoints[kpiId];
  const rawData = await endpoint.getData();
  return normalizeApiData(rawData, endpoint.type);
};
