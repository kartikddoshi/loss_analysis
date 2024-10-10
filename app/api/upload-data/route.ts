import { NextRequest, NextResponse } from 'next/server'
import { processLossData, processWeightData } from '@/lib/utils'
import { DatabaseService } from '@/lib/databaseService'

export async function POST(request: NextRequest) {
  try {
    // Parse the form data from the request
    const formData = await request.formData()
    const lossFile = formData.get('lossFile') as File | null
    const weightFile = formData.get('weightFile') as File | null
    const mode = formData.get('mode') as string

    // Check if any files were uploaded
    if (!lossFile && !weightFile) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    // Process the uploaded files
    const lossData = lossFile ? await processLossData(lossFile) : []
    const weightData = weightFile ? await processWeightData(weightFile) : []

    // Upload the processed data to the database
    const { lossRecordsCount, weightRecordsCount } = await DatabaseService.uploadData(lossData, weightData, mode)

    // Return a success response with the number of records uploaded
    return NextResponse.json({ 
      message: 'Data uploaded successfully',
      lossRecordsCount,
      weightRecordsCount
    })
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error in upload-data route:', error)
    
    // Return a 500 error if there's an internal server error
    return NextResponse.json({ error: 'An error occurred while processing the data' }, { status: 500 })
  }
}