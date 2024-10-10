import { create } from 'zustand'
import { uploadData, clearDatabase } from '@/lib/api'
import { UploadStore } from '@/types'

// Create a Zustand store for managing upload-related state
export const useUploadStore = create<UploadStore>((set, get) => ({
  // State for storing selected files
  lossFile: null,
  weightFile: null,

  // Actions for updating file state
  setLossFile: (file) => set({ lossFile: file }),
  setWeightFile: (file) => set({ weightFile: file }),

  // Action for handling file upload
  handleUpload: async (fileType: 'loss' | 'weight', replace: boolean) => {
    const { lossFile, weightFile } = get()
    const file = fileType === 'loss' ? lossFile : weightFile
    if (!file) throw new Error('No file selected')
    
    // Call the API to upload the file
    const result = await uploadData(fileType, file, replace)
    
    // Clear the file state after successful upload
    set({ [fileType === 'loss' ? 'lossFile' : 'weightFile']: null })
    return result
  },

  // Action for clearing the database
  handleClearDatabase: async () => {
    try {
      await clearDatabase()
      // Clear file states after successful database clear
      set({ lossFile: null, weightFile: null })
    } catch (error) {
      console.error('Error clearing database:', error)
      throw error
    }
  },
}))