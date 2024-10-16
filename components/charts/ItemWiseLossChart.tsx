import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getItemWiseLoss } from '@/lib/analysisQueries'

interface ItemWiseLossChartProps {
  onItemSelect: (item: string) => void
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 border border-gray-600 rounded shadow-md">
        <p className="font-bold">Item No: {label}</p>
        <p>Total Pure Gold Loss: {payload[0].payload.total_pure_gold_loss.toFixed(3)} g</p>
        <p>Pure Gold Weight: {payload[0].payload.pure_gold_weight.toFixed(3)} g</p>
        <p>Loss Percentage: {payload[0].payload.loss_percentage.toFixed(3)}%</p>
      </div>
    );
  }
  return null;
};

const ItemWiseLossChart: React.FC<ItemWiseLossChartProps> = ({ onItemSelect }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['itemWiseLoss'],
    queryFn: getItemWiseLoss
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>
  if (!data) return <div>No data available</div>

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Item-wise Loss</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="item_no" stroke="#D1D5DB" hide={true} /> {/* Hide the X-axis labels */}
          <YAxis stroke="#D1D5DB" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="loss_percentage" fill="#60A5FA" name="Loss Percentage" onClick={(data) => onItemSelect(data.item_no)} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ItemWiseLossChart
