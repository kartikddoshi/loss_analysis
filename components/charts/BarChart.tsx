import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[] | undefined;
  xKey: string;
  yKey: string;
  onBarClick?: (item: string) => void;
}

export const BarChart: React.FC<BarChartProps> = ({ data, xKey, yKey, onBarClick }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const handleClick = (entry: any) => {
    if (onBarClick) {
      onBarClick(entry[xKey]);
    }
  };

  const maxValue = Math.max(...data.map(item => item[yKey] || 0));
  const minValue = Math.min(...data.map(item => item[yKey] || 0));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis domain={[minValue, maxValue]} tickFormatter={(value) => value.toFixed(2)} />
        <Tooltip formatter={(value) => value.toFixed(4)} />
        <Legend />
        <Bar dataKey={yKey} fill="#8884d8" onClick={handleClick} cursor="pointer" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};