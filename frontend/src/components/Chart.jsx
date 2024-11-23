import * as React from 'react';
import { BarChart } from '@mui/x-charts';

export const Chart = () => {
  return (
    <BarChart
      series={[
        { data: [35, 44, 24, 34], color: '#4caf50', label: 'Monday' }, // Green
        { data: [51, 6, 49, 30], color: '#2196f3', label: 'Tuesday' },  // Blue
        { data: [15, 25, 30, 50], color: '#f44336', label: 'Wednesday' }, // Red
        { data: [60, 50, 15, 25], color: '#ff9800', label: 'Thursday' }, // Orange
        { data: [50, 20, 33, 15], color: '#9c27b0', label: 'Friday' }, // Purple
        { data: [40, 30, 85, 20], color: '#e91e63', label: 'Saturday' }, // Pink
        { data: [10, 40, 11, 28], color: '#00bcd4', label: 'Sunday' }, // Cyan
      ]}
      height={290}
      xAxis={[{ data: ['Week1', 'Week2', 'Week3', 'Week4'], scaleType: 'band' }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
};
