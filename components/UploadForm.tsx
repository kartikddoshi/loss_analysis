import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { useUploadStore } from '@/app/store/uploadStore'
import { useQueryClient } from '@tanstack/react-query'

const UploadForm: React.FC = () => {
  const { lossFile, weightFile, setLossFile, setWeightFile, handleUpload } = useUploadStore()
  const [uploadResult, setUploadResult] = useState<string | null>(null)
  const [isUploadingLoss, setIsUploadingLoss] = useState(false)
  const [isUploadingWeight, setIsUploadingWeight] = useState(false)
  const [replaceLoss, setReplaceLoss] = useState(false)
  const [replaceWeight, setReplaceWeight] = useState(false)
  const queryClient = useQueryClient()
  const [lastLossDate, setLastLossDate] = useState<string | null>(null)
  const [lastWeightItemNo, setLastWeightItemNo] = useState<string | null>(null)

  useEffect(() => {
    const fetchLastUploaded = async () => {
      try {
        const lossResponse = await fetch('/api/last-uploaded/loss')
        const weightResponse = await fetch('/api/last-uploaded/weight')
        
        if (!lossResponse.ok || !weightResponse.ok) {
          throw new Error('Failed to fetch last uploaded data')
        }

        const lossData = await lossResponse.json()
        const weightData = await weightResponse.json()

        setLastLossDate(lossData.lastDate)
        setLastWeightItemNo(weightData.lastItemNo)
      } catch (error) {
        console.error('Error fetching last uploaded data:', error)
      }
    }
    fetchLastUploaded()
  }, [])

  const onUpload = async (fileType: 'loss' | 'weight') => {
    const setIsUploading = fileType === 'loss' ? setIsUploadingLoss : setIsUploadingWeight
    setIsUploading(true)
    setUploadResult(null)
    try {
      const result = await handleUpload(fileType, fileType === 'loss' ? replaceLoss : replaceWeight)
      setUploadResult(`Successfully uploaded ${result} ${fileType} records.`)
      queryClient.invalidateQueries(['itemWiseLoss', 'karigarWiseLoss', 'monthWiseLoss', 'processWiseLoss'])
    } catch (error) {
      setUploadResult(`Error: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Loss Data</h3>
        <div className="flex items-center space-x-2 mb-2">
          <Button onClick={() => document.getElementById('lossFile')?.click()} disabled={isUploadingLoss}>
            Choose File
          </Button>
          <input
            id="lossFile"
            type="file"
            onChange={(e) => setLossFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <input
            type="checkbox"
            id="replaceLoss"
            checked={replaceLoss}
            onChange={(e) => setReplaceLoss(e.target.checked)}
          />
          <Label htmlFor="replaceLoss">Replace</Label>
          <Button onClick={() => onUpload('loss')} disabled={!lossFile || isUploadingLoss}>
            {isUploadingLoss ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        {lossFile && <p className="text-sm text-gray-600">Selected file: {lossFile.name}</p>}
        {lastLossDate && (
          <p className="text-sm text-gray-600">
            Date till last uploaded: {lastLossDate}
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Weight Data</h3>
        <div className="flex items-center space-x-2 mb-2">
          <Button onClick={() => document.getElementById('weightFile')?.click()} disabled={isUploadingWeight}>
            Choose File
          </Button>
          <input
            id="weightFile"
            type="file"
            onChange={(e) => setWeightFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <input
            type="checkbox"
            id="replaceWeight"
            checked={replaceWeight}
            onChange={(e) => setReplaceWeight(e.target.checked)}
          />
          <Label htmlFor="replaceWeight">Replace</Label>
          <Button onClick={() => onUpload('weight')} disabled={!weightFile || isUploadingWeight}>
            {isUploadingWeight ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        {weightFile && <p className="text-sm text-gray-600">Selected file: {weightFile.name}</p>}
        {lastWeightItemNo && (
          <p className="text-sm text-gray-600">
            Last uploaded Item Number: {lastWeightItemNo}
          </p>
        )}
      </div>

      {uploadResult && (
        <div className={`mt-4 p-4 rounded-md ${uploadResult.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {uploadResult}
        </div>
      )}
    </div>
  )
}

export default UploadForm
