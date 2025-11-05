import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import './WidgetStyles.css';

export const DraggableKPI = ({ kpi, index }) => {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `kpi-${kpi.id}`,
    data: { type: 'kpi', ...kpi }
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  return (
    <div 
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="draggable-item kpi-item"
      style={style}
    >
      <div className="kpi-content">
        <span className="kpi-title">{kpi.id}</span>
        <span className="kpi-type">{kpi.type}</span>
      </div>
    </div>
  );
};

export const DraggableChartType = ({ chart, index }) => {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `chart-${chart.type}`,
    data: { type: 'chart', ...chart }
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  return (
    <div 
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="draggable-item chart-type-item"
      style={style}
    >
      {chart.label}
    </div>
  );
};

export const DroppableWrapper = ({ children, id }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id
  });

  return (
    <div 
      ref={setNodeRef}
      className={`droppable-area ${isOver ? 'drop-active' : ''}`}
    >
      {children}
    </div>
  );
};