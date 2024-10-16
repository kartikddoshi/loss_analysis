import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getKarigarWiseLoss } from '@/lib/analysisQueries'

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

const KarigarWiseLossChart: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['karigarWiseLoss'],
    queryFn: getKarigarWiseLoss
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>
  if (!data) return <div>No data available</div>

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Top 15 Karigars by Loss Percentage</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="karigar" stroke="#D1D5DB" />
          <YAxis stroke="#D1D5DB" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="loss_percentage" fill="#34D399" name="Loss Percentage (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default KarigarWiseLossChart
