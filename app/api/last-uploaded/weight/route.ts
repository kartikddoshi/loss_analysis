import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET() {
  try {
    const lastWeightData = await prisma.weightData.findFirst({
      orderBy: {
        date: 'desc',
      },
      select: {
        item_no: true,
        date: true,
      },
    });

    if (!lastWeightData) {
      return NextResponse.json({ lastItemNo: null, lastDate: null });
    }

    return NextResponse.json({
      lastItemNo: lastWeightData.item_no,
      lastDate: lastWeightData.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
    });
  } catch (error) {
    console.error('Error fetching last uploaded weight data:', error);
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
  }
}
