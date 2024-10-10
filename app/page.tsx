'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import UploadForm from '@/components/UploadForm'
import ItemList from '@/components/ItemList'

const AnalysisCharts = dynamic(() => import('@/components/AnalysisCharts'), { ssr: false })
const ItemDetails = dynamic(() => import('@/components/ItemDetails'), { ssr: false })

const queryClient = new QueryClient()

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const handleItemSelect = (item: string) => {
    console.log('Item selected:', item);
    setSelectedItem(item);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <ItemList onItemSelect={handleItemSelect} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">Gold Loss Analysis Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Upload Data</h2>
              <UploadForm />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Item Details</h2>
              {selectedItem ? (
                <ItemDetails itemNo={selectedItem} />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Select an item to view details</p>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Analysis Charts</h2>
            <AnalysisCharts onItemSelect={setSelectedItem} />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  )
}