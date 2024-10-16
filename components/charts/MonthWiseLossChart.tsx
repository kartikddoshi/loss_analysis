import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getMonthWiseLoss } from '@/lib/analysisQueries'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 border border-gray-600 rounded shadow-md">
        <p className="font-bold">{label}</p>
        <p>Loss Percentage: {payload[0].payload.loss_percentage.toFixed(3)}%</p>
      </div>
    );
  }
  return null;
};

const MonthWiseLossChart: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['monthWiseLoss'],
    queryFn: getMonthWiseLoss
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>
  if (!data) return <div>No data available</div>

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Month-wise Loss</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#D1D5DB" />
          <YAxis stroke="#D1D5DB" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="loss_percentage" stroke="#F59E0B" name="Loss Percentage (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthWiseLossChart
