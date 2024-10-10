import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/databaseService'

export async function GET() {
  try {
    // Fetch items with loss data from the DatabaseService
    const items = await DatabaseService.getItemsWithLoss()
    
    // Return the items as a JSON response
    return NextResponse.json(items)
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error in items-with-loss API route:', error)
    
    // Return a 500 error if there's an internal server error
    return NextResponse.json({ error: 'An error occurred while fetching items with loss' }, { status: 500 })
  }
}