import { DatabaseService } from './databaseService'

export async function getItemDetails(itemNo: string) {
  try {
    // Fetch item details from the API
    const response = await fetch(`/api/item-details/${itemNo}`)
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch item details')
    }
    
    // Parse the JSON response
    const data = await response.json()
    
    // Log the raw item details for debugging
    console.log('Raw item details:', data)
    
    // Return the parsed data
    return data
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error fetching item details:', error)
    
    // Re-throw the error to be handled by the caller
    throw error
  }
}
