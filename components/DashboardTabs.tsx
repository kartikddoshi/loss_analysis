import React, { useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line } from 'recharts';

interface DashboardTabsProps {
  itemWiseLoss: any[];
  karigarWiseLoss: any[];
  monthWiseLoss: any[];
  processWiseLoss: any[];
  onItemClick: (item: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  itemWiseLoss,
  karigarWiseLoss,
  monthWiseLoss,
  processWiseLoss,
  onItemClick
}) => {
  // Filter items with loss percentage above 5%
  const filteredItemWiseLoss = useMemo(() => {
    return itemWiseLoss.filter(item => item.loss_percentage > 5);
  }, [itemWiseLoss]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-gray-900 p-2 border border-gray-300 rounded shadow-md">
          <p>{`Item: ${payload[0].payload.item_no}`}</p>
          <p>{`Loss: ${payload[0].value.toFixed(2)}%`}</p>
          <p>{`Pure Gold Loss: ${payload[0].payload.total_pure_gold_loss.toFixed(3)} g`}</p>
          <p>{`Pure Gold Weight: ${payload[0].payload.pure_gold_weight.toFixed(3)} g`}</p>
        </div>
      );
    }
    return null;
  };

  console.log('Filtered Item-wise loss data:', filteredItemWiseLoss);

  const processColors = useMemo(() => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'];
    const processSet = new Set(monthWiseLoss.map(item => item.process));
    const colorMap = {};
    Array.from(processSet).forEach((process, index) => {
      colorMap[process] = colors[index % colors.length];
    });
    return colorMap;
  }, [monthWiseLoss]);

  const formattedMonthWiseLoss = useMemo(() => {
    const monthMap = {};
    monthWiseLoss.forEach(item => {
      if (!monthMap[item.month]) {
        monthMap[item.month] = { month: item.month };
      }
      monthMap[item.month][item.process] = item.loss_percentage;
    });
    return Object.values(monthMap);
  }, [monthWiseLoss]);

  return (
    <Tabs defaultValue="item-wise" className="w-full">
      <TabsList>
        <TabsTrigger value="item-wise">Item-wise Loss</TabsTrigger>
        <TabsTrigger value="karigar-wise">Karigar-wise Loss</TabsTrigger>
        <TabsTrigger value="month-wise">Month-wise Loss</TabsTrigger>
        <TabsTrigger value="process-wise">Process-wise Loss</TabsTrigger>
      </TabsList>
      <TabsContent value="item-wise">
        {filteredItemWiseLoss.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredItemWiseLoss}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="item_no" tick={false} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="loss_percentage" fill="#8884d8" name="Loss Percentage (%)" onClick={(data) => onItemClick(data.item_no)} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div>No items with loss percentage above 5%</div>
        )}
      </TabsContent>
      <TabsContent value="karigar-wise">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart width={600} height={300} data={karigarWiseLoss}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="karigar" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_loss" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="month-wise">
        {formattedMonthWiseLoss && formattedMonthWiseLoss.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedMonthWiseLoss}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(processColors).map(process => (
                <Line
                  key={process}
                  type="monotone"
                  dataKey={process}
                  name={`${process} Loss %`}
                  stroke={processColors[process]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div>No month-wise loss data available</div>
        )}
      </TabsContent>
      <TabsContent value="process-wise">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart width={600} height={300} data={processWiseLoss}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="process" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_loss" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;