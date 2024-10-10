import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getItemDetails } from '@/lib/itemQueries'
import { FiChevronRight, FiChevronDown, FiPlus, FiMinus } from 'react-icons/fi'

interface ItemDetailsProps {
  itemNo: string
}

interface LossDetail {
  loss: number;
  pure_gold_loss: number;
  process: string;
  karigar: string;
  date: string;
  kt: number;
}

interface ItemData {
  item_no: string;
  weightData: {
    pure_gold_weight: number;
    gross_wt: number;
    net_wt: number;
    kt: number;
    date: string;
  };
  lossDetails: LossDetail[];
  totalLoss: number;
  totalPureGoldLoss: number;
  overallLossPercentage: number;
  lossByProcess: Record<string, {
    totalLoss: number;
    totalPureGoldLoss: number;
    karigars: Record<string, { loss: number; pureGoldLoss: number }>;
  }>;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ itemNo }) => {
  const { data: itemDetails, isLoading, error } = useQuery<ItemData>({
    queryKey: ['itemDetails', itemNo],
    queryFn: () => getItemDetails(itemNo),
  });

  const [expandedProcess, setExpandedProcess] = useState<string | null>(null);
  const [showLossDetails, setShowLossDetails] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading item details: {(error as Error).message}</div>;
  if (!itemDetails) return <div>No details found for this item</div>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold mb-4">Item Details: {itemNo}</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Weight Data</h3>
          <p>Pure Gold Weight: {itemDetails.weightData.pure_gold_weight.toFixed(3)} g</p>
          <p>Net Weight: {itemDetails.weightData.net_wt.toFixed(3)} g</p>
          <p>Karat: {itemDetails.weightData.kt}K</p>
          <p>Date: {new Date(itemDetails.weightData.date).toLocaleDateString()}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Loss Summary</h3>
          <p>Total Loss: {itemDetails.totalLoss.toFixed(3)} g</p>
          <p>Total Pure Gold Loss: {itemDetails.totalPureGoldLoss.toFixed(3)} g</p>
          <p>Overall Loss Percentage: {itemDetails.overallLossPercentage.toFixed(2)}%</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Loss by Process</h3>
        {Object.entries(itemDetails.lossByProcess).map(([process, data]) => (
          <div key={process} className="mb-2">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => setExpandedProcess(expandedProcess === process ? null : process)}
            >
              {expandedProcess === process ? <FiChevronDown /> : <FiChevronRight />}
              <span className="font-medium ml-2">
                {process} - {data.totalLoss.toFixed(3)}g - {data.totalPureGoldLoss.toFixed(3)}g 24K - 
                {((data.totalPureGoldLoss / itemDetails.weightData.pure_gold_weight) * 100).toFixed(2)}%
              </span>
            </div>
            {expandedProcess === process && (
              <div className="ml-6 mt-2">
                {Object.entries(data.karigars).map(([karigar, karigarData]) => (
                  <div key={karigar} className="ml-4 flex items-center">
                    <FiChevronRight />
                    <span className="ml-2">
                      {karigar}: Loss - {karigarData.loss.toFixed(3)} g, Pure Gold Loss - {karigarData.pureGoldLoss.toFixed(3)} g
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <div 
          className="flex items-center cursor-pointer mb-2" 
          onClick={() => setShowLossDetails(!showLossDetails)}
        >
          {showLossDetails ? <FiMinus /> : <FiPlus />}
          <h3 className="text-xl font-semibold ml-2">Loss Details</h3>
        </div>
        {showLossDetails && (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 dark:border-gray-600 p-2">Date</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2">Process</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2">Karigar</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2">Loss (g)</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2">Pure Gold Loss (g)</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2">Karat</th>
              </tr>
            </thead>
            <tbody>
              {itemDetails.lossDetails.map((detail, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 dark:border-gray-600 p-2">{new Date(detail.date).toLocaleDateString()}</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2">{detail.process}</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2">{detail.karigar}</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2">{detail.loss.toFixed(3)}</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2">{detail.pure_gold_loss.toFixed(3)}</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2">{detail.kt}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ItemDetails;