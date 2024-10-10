import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/databaseService'

export async function GET(request: Request, { params }: { params: { analysis: string } }) {
  const { analysis } = params

  try {
    let result
    switch (analysis) {
      case 'item-wise-loss':
        result = await DatabaseService.getItemWiseLoss()
        break
      case 'karigar-wise-loss':
        result = await DatabaseService.getKarigarWiseLoss()
        break
      case 'month-wise-loss':
        result = await DatabaseService.getMonthWiseLoss()
        break
      case 'process-wise-loss':
        result = await DatabaseService.getProcessWiseLoss()
        break
      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 })
    }

    console.log(`${analysis} result:`, result) // Add this line for debugging
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in analysis API route:', error)
    return NextResponse.json({ error: 'An error occurred while fetching analysis data' }, { status: 500 })
  }
}