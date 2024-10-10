import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function GET() {
  try {
    console.log('Starting item-wise loss data fetch...');

    const result = await prisma.lossData.groupBy({
      by: ['item_no'],
      _sum: {
        pure_gold_loss: true,
      },
      orderBy: {
        _sum: {
          pure_gold_loss: 'desc',
        },
      },
    });

    const weightData = await prisma.weightData.findMany({
      select: {
        item_no: true,
        pure_gold_weight: true,
      },
    });

    const weightMap = new Map(weightData.map(item => [item.item_no, item.pure_gold_weight]));

    const processedResult = result.map(item => {
      const pureGoldWeight = weightMap.get(item.item_no) || 0;
      const totalPureGoldLoss = item._sum.pure_gold_loss || 0;
      const lossPercentage = pureGoldWeight > 0 ? (totalPureGoldLoss / pureGoldWeight) * 100 : 0;

      return {
        item_no: item.item_no,
        total_pure_gold_loss: Number(totalPureGoldLoss.toFixed(3)),
        pure_gold_weight: Number(pureGoldWeight.toFixed(3)),
        loss_percentage: Number(lossPercentage.toFixed(3)),
      };
    });

    //console.log('Processed result:', JSON.stringify(processedResult, null, 2));

    return NextResponse.json(processedResult);
  } catch (error) {
    console.error('Error in item-wise loss API route:', error);
    let errorMessage = 'An error occurred while fetching item-wise loss data';
    let errorDetails = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    }

    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 }
    )
  }
}