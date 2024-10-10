import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/databaseService'

export async function GET(request: Request, { params }: { params: { itemNo: string } }) {
  const { itemNo } = params

  try {
    // Fetch process-wise data for the specified item
    const result = await DatabaseService.getItemProcess(itemNo)
    
    // Return the result as a JSON response
    return NextResponse.json(result)
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error in item process API route:', error)
    
    // Return a 500 error if there's an internal server error
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}