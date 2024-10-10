import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/databaseService'

export async function GET() {
  try {
    // Fetch all items from the database service
    const items = await DatabaseService.getItems()
    
    // Return the items as a JSON response
    return NextResponse.json(items)
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error in items API route:', error)
    
    // Return a 500 error if there's an internal server error
    return NextResponse.json({ error: 'An error occurred while fetching items' }, { status: 500 })
  }
}