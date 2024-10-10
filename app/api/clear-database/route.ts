import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/databaseService'

export async function POST() {
  try {
    // Clear the database using the DatabaseService
    await DatabaseService.clearDatabase()
    
    // Return a success message
    return NextResponse.json({ message: 'Database cleared successfully' })
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error clearing database:', error)
    
    // Return a 500 error if there's an internal server error
    return NextResponse.json({ error: 'An error occurred while clearing the database' }, { status: 500 })
  }
}