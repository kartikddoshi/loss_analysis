import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/databaseService'

export async function GET(request: Request, { params }: { params: { itemNo: string } }) {
  const { itemNo } = params

  try {
    // Fetch item details from the database service
    const itemDetails = await DatabaseService.getItemDetails(itemNo)

    // If no item details are found, return a 404 error
    if (!itemDetails) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Log the item details for debugging
    console.log('Sending item details:', itemDetails)
    
    // Return the item details as a JSON response
    return NextResponse.json(itemDetails)
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error in item details API:', error)
    
    // Return a 500 error if there's an internal server error
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}