import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import ChartRenderer from './ChartRenderer';
import { DraggableKPI, DraggableChartType, DroppableWrapper } from './DraggableItems';
import { getKpiData } from '../services/kpiService';
// Removed unused import
import './WidgetStyles.css';

const availableChartTypes = [
  { type: 'line', label: 'Line Chart' },
  { type: 'bar', label: 'Bar Chart' },
  { type: 'pie', label: 'Pie Chart' }
];

const availableKpis = [
  { id: 'KPI1', type: 'Sales' },
  { id: 'KPI2', type: 'Revenue' },
  { id: 'KPI3', type: 'Distribution' }
];

export default function WidgetBuilder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canvasItems, setCanvasItems] = useState([]);
  const [charts, setCharts] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // Handle dropping in canvas area
    if (over.id === 'canvas') {
      const itemId = active.id;
      const isKpi = itemId.startsWith('kpi-');
      
      const newItem = {
        id: isKpi ? itemId.replace('kpi-', '') : itemId.replace('chart-', ''),
        type: isKpi ? 'kpi' : 'chart',
        // Store the actual chart type if it's a chart
        chartType: !isKpi ? itemId.replace('chart-', '') : undefined
      };

      setCanvasItems(prev => [...prev, newItem]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = [];
      const kpis = canvasItems.filter(item => item.type === 'kpi');
      const chartTypes = canvasItems.filter(item => item.type === 'chart');

      // Generate a chart for each KPI, using available chart types
      for (let i = 0; i < kpis.length; i++) {
        const kpi = kpis[i];
        const chartType = chartTypes[i] || chartTypes[0];
        if (!chartType) continue;

        const kpiData = await getKpiData(kpi.id);
        
        // Use the stored chart type from the dropped item
        const chartTypeConfig = availableChartTypes.find(t => t.type === chartType.chartType) || availableChartTypes[0];

        results.push({
          id: `${kpi.id}-${chartType.id}`,
          type: chartTypeConfig.type, // This ensures we pass the correct chart type
          data: kpiData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                display: true // Always show legend for better visibility
              },
              title: {
                display: true,
                text: kpiData.title || `${kpi.id} Chart`
              }
            }
          }
        });
      }

      setCharts(results);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="widget-builder">
        <div className="widget-panels">
          {/* KPIs Panel */}
          <div className="panel">
            <h3>API List</h3>
            <DroppableWrapper id="kpis">
              {availableKpis.map((kpi, index) => (
                <DraggableKPI key={kpi.id} kpi={kpi} index={index} />
              ))}
            </DroppableWrapper>
          </div>

          {/* Chart Types Panel */}
          <div className="panel">
            <h3>UI Widgets List</h3>
            <DroppableWrapper id="charts">
              {availableChartTypes.map((chart, index) => (
                <DraggableChartType key={chart.type} chart={chart} index={index} />
              ))}
            </DroppableWrapper>
          </div>

          {/* Canvas Area */}
          <div className="panel canvas-panel">
            <h3>Canvas for Dashboard</h3>
            <DroppableWrapper id="canvas">
              {canvasItems.map((item, index) => (
                item.type === 'kpi' ? (
                  <DraggableKPI 
                    key={item.id} 
                    kpi={{ id: item.id, type: 'canvas-item' }} 
                    index={index}
                  />
                ) : (
                  <DraggableChartType
                    key={item.id}
                    chart={{ type: item.id, label: 'Chart' }}
                    index={index}
                  />
                )
              ))}
            </DroppableWrapper>
            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={loading || canvasItems.length === 0}
            >
              {loading ? 'Generating...' : 'Generate Dynamic Layout'}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Generated Charts */}
        {charts.length > 0 && (
          <div className="canvas-grid">
            {charts.map(chart => (
              <div key={chart.id} className="chart-container">
                <ChartRenderer
                  type={chart.type}
                  data={chart.data}
                  options={chart.options}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </DndContext>
  );
}