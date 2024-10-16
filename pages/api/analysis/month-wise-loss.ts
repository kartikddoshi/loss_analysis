import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m', WeightData.date) as month,
        SUM(WeightData.pure_gold_weight) as total_pure_gold_weight,
        SUM(LossData.pure_gold_loss) as total_pure_gold_loss
      FROM 
        weight_data AS WeightData
      LEFT JOIN 
        loss_data AS LossData ON WeightData.item_no = LossData.item_no
      GROUP BY 
        strftime('%Y-%m', WeightData.date)
      ORDER BY 
        month
    `;

    const formattedResult = result.map((item: any) => ({
      month: item.month,
      total_pure_gold_weight: Number(item.total_pure_gold_weight),
      total_pure_gold_loss: Number(item.total_pure_gold_loss),
      loss_percentage: (item.total_pure_gold_loss / item.total_pure_gold_weight) * 100
    }));

    res.status(200).json(formattedResult);
  } catch (error) {
    console.error('Error in month-wise-loss API:', error);
    res.status(500).json({ error: 'Error fetching month-wise loss data' });
  }
}
