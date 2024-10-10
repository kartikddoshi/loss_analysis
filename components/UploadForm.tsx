import React, { useState } from 'react'
import { useUploadStore } from '@/store/uploadStore'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useQueryClient } from '@tanstack/react-query'

const UploadForm: React.FC = () => {
  const { lossFile, weightFile, setLossFile, setWeightFile, handleUpload, handleClearDatabase } = useUploadStore()
  const [uploadResult, setUploadResult] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [replaceLoss, setReplaceLoss] = useState(false)
  const [replaceWeight, setReplaceWeight] = useState(false)
  const queryClient = useQueryClient()

  const onUpload = async (fileType: 'loss' | 'weight') => {
    setIsUploading(true)
    setUploadResult(null)
    try {
      const result = await handleUpload(fileType, fileType === 'loss' ? replaceLoss : replaceWeight)
      setUploadResult(`Successfully uploaded ${result.recordsCount} ${fileType} records.`)
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
          <Button onClick={() => document.getElementById('lossFile')?.click()} disabled={isUploading}>
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
          <Button onClick={() => onUpload('loss')} disabled={!lossFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        {lossFile && <p className="text-sm text-gray-600">Selected file: {lossFile.name}</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Weight Data</h3>
        <div className="flex items-center space-x-2 mb-2">
          <Button onClick={() => document.getElementById('weightFile')?.click()} disabled={isUploading}>
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
          <Button onClick={() => onUpload('weight')} disabled={!weightFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        {weightFile && <p className="text-sm text-gray-600">Selected file: {weightFile.name}</p>}
      </div>

      <Button onClick={handleClearDatabase} variant="destructive" disabled={isUploading}>Clear All Data</Button>

      {uploadResult && (
        <div className={`mt-4 p-4 rounded-md ${uploadResult.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {uploadResult}
        </div>
      )}
    </div>
  )
}

export default UploadForm