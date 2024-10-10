import { create } from 'zustand'
import { uploadData, clearDatabase } from '@/lib/api'
import { UploadStore } from '@/types'

export const useUploadStore = create<UploadStore>((set, get) => ({
  lossFile: null,
  weightFile: null,
  setLossFile: (file) => set({ lossFile: file }),
  setWeightFile: (file) => set({ weightFile: file }),
  handleUpload: async (fileType: 'loss' | 'weight', replace: boolean) => {
    const { lossFile, weightFile } = get()
    const file = fileType === 'loss' ? lossFile : weightFile
    if (!file) throw new Error('No file selected')
    const result = await uploadData(fileType, file, replace)
    set({ [fileType === 'loss' ? 'lossFile' : 'weightFile']: null })
    return result
  },
  handleClearDatabase: async () => {
    try {
      await clearDatabase()
      set({ lossFile: null, weightFile: null })
    } catch (error) {
      console.error('Error clearing database:', error)
      throw error
    }
  },
}))