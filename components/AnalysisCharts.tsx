import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getItemWiseLoss, getKarigarWiseLoss, getMonthWiseLoss, getProcessWiseLoss } from '../lib/analysisQueries'

interface AnalysisChartsProps {
  onItemSelect: (item: string) => void
}

const CustomTooltip = ({ active, payload, label, chartType }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 border border-gray-600 rounded shadow-md">
        <p className="font-bold">{label}</p>
        {chartType === 'item' && (
          <>
            <p>Total Pure Gold Loss: {payload[0].payload.total_pure_gold_loss.toFixed(3)} g</p>
            <p>Pure Gold Weight: {payload[0].payload.pure_gold_weight.toFixed(3)} g</p>
          </>
        )}
        <p>Loss Percentage: {payload[0].payload.loss_percentage.toFixed(3)}%</p>
      </div>
    );
  }
  return null;
};

const ItemWiseLossChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="item_no" stroke="#D1D5DB" />
      <YAxis stroke="#D1D5DB" />
      <Tooltip content={<CustomTooltip chartType="item" />} />
      <Legend />
      <Bar dataKey="loss_percentage" fill="#60A5FA" name="Loss Percentage" />
    </BarChart>
  </ResponsiveContainer>
);

const KarigarWiseLossChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="karigar" stroke="#D1D5DB" />
      <YAxis stroke="#D1D5DB" />
      <Tooltip content={<CustomTooltip chartType="karigar" />} />
      <Legend />
      <Bar dataKey="loss_percentage" fill="#34D399" name="Loss Percentage (%)" />
    </BarChart>
  </ResponsiveContainer>
);

const MonthWiseLossChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="month" stroke="#D1D5DB" />
      <YAxis stroke="#D1D5DB" />
      <Tooltip content={<CustomTooltip chartType="month" />} />
      <Legend />
      <Bar dataKey="loss_percentage" fill="#F59E0B" name="Loss Percentage (%)" />
    </BarChart>
  </ResponsiveContainer>
);

const ProcessWiseLossChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="process" stroke="#D1D5DB" />
      <YAxis stroke="#D1D5DB" />
      <Tooltip content={<CustomTooltip chartType="process" />} />
      <Legend />
      <Bar dataKey="loss_percentage" fill="#EC4899" name="Loss Percentage (%)" />
    </BarChart>
  </ResponsiveContainer>
);

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ onItemSelect }) => {
  const { data: itemWiseLoss, isLoading: itemLoading, error: itemError } = useQuery({
    queryKey: ['itemWiseLoss'],
    queryFn: getItemWiseLoss
  })

  const { data: karigarWiseLoss, isLoading: karigarLoading, error: karigarError } = useQuery({
    queryKey: ['karigarWiseLoss'],
    queryFn: getKarigarWiseLoss
  })

  const { data: monthWiseLoss, isLoading: monthLoading, error: monthError } = useQuery({
    queryKey: ['monthWiseLoss'],
    queryFn: getMonthWiseLoss
  })

  const { data: processWiseLoss, isLoading: processLoading, error: processError } = useQuery({
    queryKey: ['processWiseLoss'],
    queryFn: getProcessWiseLoss
  })

  if (itemLoading || karigarLoading || monthLoading || processLoading) {
    return <div>Loading...</div>
  }

  const errors = [itemError, karigarError, monthError, processError].filter(Boolean)
  if (errors.length > 0) {
    console.error('Error fetching data:', errors)
    return <div>Error loading data: {errors.map(e => e?.message).join(', ')}</div>
  }

  if (!itemWiseLoss || !karigarWiseLoss || !monthWiseLoss || !processWiseLoss) {
    return <div>No data available. Please check if data is being fetched correctly.</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analysis Charts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Item-wise Loss</h3>
          <ItemWiseLossChart data={itemWiseLoss} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Top 15 Karigars by Loss Percentage</h3>
          <KarigarWiseLossChart data={karigarWiseLoss} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Month-wise Loss</h3>
          <MonthWiseLossChart data={monthWiseLoss} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Process-wise Loss</h3>
          <ProcessWiseLossChart data={processWiseLoss} />
        </div>
      </div>
    </div>
  )
}

export default AnalysisCharts