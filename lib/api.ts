import { UploadMode } from '@/types';
import { prisma } from './database';
import axios from 'axios';

export const uploadData = async (fileType: 'loss' | 'weight', file: File, replace: boolean): Promise<number> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', fileType);
  formData.append('replace', replace.toString());

  const response = await fetch('/api/upload-data', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload data');
  }

  const result = await response.json();
  return result.recordsCount;
}

export const clearDatabase = async (): Promise<void> => {
  try {
    const response = await fetch('/api/clear-database', {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to clear database');
    }

    const result = await response.json();
    console.log(result.message); // Log the success message
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error; // Re-throw the error to be handled by the component
  }
}

export const getItems = async () => {
  try {
    const response = await axios.get('/api/items')
    return response.data
  } catch (error) {
    console.error('Error fetching items:', error)
    throw error
  }
}

export const getItemDetails = async (itemNo: string) => {
  const response = await fetch(`/api/item-details/${itemNo}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
