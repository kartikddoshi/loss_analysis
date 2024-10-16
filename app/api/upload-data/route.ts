import { NextRequest, NextResponse } from 'next/server'
import { processLossData, processWeightData } from '@/lib/utils'
import { DatabaseService } from '@/lib/databaseService'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const fileType = formData.get('fileType') as 'loss' | 'weight'
    const replace = formData.get('replace') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const processedData = fileType === 'loss' ? await processLossData(file) : await processWeightData(file)
    const recordsCount = await DatabaseService.uploadData(fileType, processedData, replace)

    return NextResponse.json({ 
      message: 'Data uploaded successfully',
      recordsCount
    })
  } catch (error) {
    console.error('Error in upload-data route:', error)
    return NextResponse.json({ error: 'An error occurred while processing the data' }, { status: 500 })
  }
}
