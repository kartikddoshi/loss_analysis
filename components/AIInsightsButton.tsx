import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getItemWiseLoss, getKarigarWiseLoss, getMonthWiseLoss, getProcessWiseLoss } from '@/lib/analysisQueries';

const AIInsightsButton: React.FC = () => {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: itemWiseLoss } = useQuery({ queryKey: ['itemWiseLoss'], queryFn: getItemWiseLoss });
  const { data: karigarWiseLoss } = useQuery({ queryKey: ['karigarWiseLoss'], queryFn: getKarigarWiseLoss });
  const { data: monthWiseLoss } = useQuery({ queryKey: ['monthWiseLoss'], queryFn: getMonthWiseLoss });
  const { data: processWiseLoss } = useQuery({ queryKey: ['processWiseLoss'], queryFn: getProcessWiseLoss });

  const handleGetInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/aianalytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisData: {
            itemWiseLoss,
            karigarWiseLoss,
            monthWiseLoss,
            processWiseLoss,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button onClick={handleGetInsights} disabled={isLoading}>
        {isLoading ? 'Generating Insights...' : 'Get AI Insights'}
      </Button>
      {insights && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">AI Insights:</h3>
          <p className="whitespace-pre-wrap">{insights}</p>
        </div>
      )}
    </div>
  );
};

export default AIInsightsButton;
