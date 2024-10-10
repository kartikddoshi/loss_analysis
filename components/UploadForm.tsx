import React, { useState } from 'react'
import { useUploadStore } from '@/store/uploadStore'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQueryClient } from '@tanstack/react-query'

const UploadForm: React.FC = () => {
  const { lossFile, weightFile, uploadMode, setLossFile, setWeightFile, setUploadMode, handleUpload, handleClearDatabase } = useUploadStore()
  const [uploadResult, setUploadResult] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()

  const onUpload = async () => {
    setIsUploading(true)
    setUploadResult(null)
    try {
      const result = await handleUpload()
      setUploadResult(`Successfully uploaded ${result.lossRecordsCount} loss records and ${result.weightRecordsCount} weight records.`)
      // Refresh the data in the charts
      queryClient.invalidateQueries(['itemWiseLoss', 'karigarWiseLoss', 'monthWiseLoss', 'processWiseLoss'])
    } catch (error) {
      setUploadResult(`Error: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="lossFile">Loss Data File</Label>
        <input
          id="lossFile"
          type="file"
          onChange={(e) => setLossFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div>
        <Label htmlFor="weightFile">Weight Data File</Label>
        <input
          id="weightFile"
          type="file"
          onChange={(e) => setWeightFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div>
        <Label htmlFor="uploadMode">Upload Mode</Label>
        <Select onValueChange={(value: 'add' | 'replace') => setUploadMode(value)} value={uploadMode}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select upload mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="add">Add</SelectItem>
            <SelectItem value="replace">Replace</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onUpload} disabled={(!lossFile && !weightFile) || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
      <Button onClick={handleClearDatabase} variant="destructive" disabled={isUploading}>Clear Database</Button>
      {uploadResult && (
        <div className={`mt-4 p-4 rounded-md ${uploadResult.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {uploadResult}
        </div>
      )}
    </div>
  )
}

export default UploadForm