import { create } from 'zustand'
import { uploadData, clearDatabase } from '@/lib/api'
import { UploadStore, UploadMode } from '@/types'

export const useUploadStore = create<UploadStore>((set, get) => ({
  lossFile: null,
  weightFile: null,
  uploadMode: 'add',
  setLossFile: (file) => set({ lossFile: file }),
  setWeightFile: (file) => set({ weightFile: file }),
  setUploadMode: (mode) => set({ uploadMode: mode }),
  handleUpload: async () => {
    const { lossFile, weightFile, uploadMode } = get()
    const result = await uploadData(lossFile, weightFile, uploadMode)
    set({ lossFile: null, weightFile: null })
    return result
  },
  handleClearDatabase: async () => {
    try {
      await clearDatabase()
      set({ lossFile: null, weightFile: null })
    } catch (error) {
      console.error('Error clearing database:', error)
      throw error // Re-throw the error to be handled by the component
    }
  },
}))