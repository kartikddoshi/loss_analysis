import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMonthWiseLoss } from '@/lib/analysisQueries'

const CustomTooltip = ({ active, payload, label, chartType }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 border border-gray-600 rounded shadow-md">
        <p className="font-bold">{label}</p>
        <p>{chartType === 'total' ? 'Total Loss' : 'Loss Percentage'}: {payload[0].value.toFixed(3)} {chartType === 'total' ? 'g' : '%'}</p>
        {chartType === 'percentage' && (
          <>
            <p>Total Loss: {payload[0].payload.total_loss.toFixed(3)} g</p>
            <p>Total Weight: {payload[0].payload.total_weight.toFixed(3)} g</p>
          </>
        )}
      </div>
    );
  }
  return null;
};

const MonthWiseLossChart: React.FC = () => {
  const [chartType, setChartType] = useState('total')

  const { data, isLoading, error } = useQuery({
    queryKey: ['monthWiseLoss', chartType],
    queryFn: () => getMonthWiseLoss(chartType)
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>
  if (!data || data.length === 0) return <div>No data available</div>

  const formatData = (data) => {
    return data.map(item => ({
      month: new Date(item.month).toLocaleDateString('default', { month: 'short', year: 'numeric' }),
      value: chartType === 'total' ? item.total_loss : item.percentage_loss,
      total_loss: item.total_loss,
      total_weight: item.total_weight,
      percentage_loss: item.percentage_loss
    }));
  };

  const formattedData = formatData(data);
  console.log('Formatted data:', formattedData);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Month-wise Loss</h2>
      <div className="mb-4">
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger>
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="total">Total Loss</SelectItem>
            <SelectItem value="percentage">Percentage Loss</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#D1D5DB" />
          <YAxis stroke="#D1D5DB" domain={[0, 'auto']} />
          <Tooltip content={<CustomTooltip chartType={chartType} />} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#F59E0B" name={chartType === 'total' ? 'Total Loss (g)' : 'Loss Percentage (%)'} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthWiseLossChart
