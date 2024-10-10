import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, xKey, yKey }) => {
  console.log('Data received in LineChart:', data);

  if (!data || data.length === 0) {
    return <div>No data available for the chart</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={yKey} name="Total Loss" stroke="#8884d8" />
        <Line type="monotone" dataKey="loss_percentage" name="Loss Percentage" stroke="#82ca9d" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};