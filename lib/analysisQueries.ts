export async function getItems() {
  try {
    const response = await fetch('/api/items-with-loss')
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    
    return data.map(item => ({
      item_no: item.item_no,
      loss_percentage: item.loss_percentage,
      date: item.date // Include the date field
    }))
  } catch (error) {
    console.error('Error fetching items:', error)
    throw error
  }
}

export const getItemWiseLoss = async (): Promise<ItemWiseLoss[]> => {
  try {
    // Fetch item-wise loss data from the API
    const response = await fetch('/api/analysis/item-wise-loss')
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API error: ${response.status} - ${errorData.error || response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching item-wise loss:', error)
    throw error
  }
}

export async function getKarigarWiseLoss() {
  try {
    // Fetch karigar-wise loss data from the API
    const response = await fetch('/api/analysis/karigar-wise-loss')
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    console.log('Karigar-wise loss data:', data) // Debugging log
    return data
  } catch (error) {
    console.error('Error fetching karigar-wise loss:', error)
    throw error
  }
}

export const getMonthWiseLoss = async () => {
  const response = await fetch('/api/analysis/month-wise-loss');
  if (!response.ok) {
    throw new Error('Failed to fetch month-wise loss data');
  }
  return response.json();
};

export async function getProcessWiseLoss() {
  try {
    // Fetch process-wise loss data from the API
    const response = await fetch('/api/analysis/process-wise-loss')
    if (!response.ok) throw new Error('Network response was not ok')
    return response.json()
  } catch (error) {
    console.error('Error fetching process-wise loss:', error)
    throw error
  }
}
