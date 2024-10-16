import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET() {
  try {
    const lastLossData = await prisma.lossData.findFirst({
      orderBy: {
        date: 'desc',
      },
      select: {
        date: true,
      },
    });

    if (!lastLossData) {
      return NextResponse.json({ lastDate: null });
    }

    const lastDate = lastLossData.date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    return NextResponse.json({ lastDate });
  } catch (error) {
    console.error('Error fetching last uploaded loss data:', error);
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
  }
}
