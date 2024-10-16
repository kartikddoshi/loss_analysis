import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required query parameters' });
    }

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

    // Fetch weight data for the specified month
    const weightData = await prisma.weightData.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    // Get all item numbers from the weight data
    const itemNumbers = weightData.map(item => item.item_no);

    // Fetch loss data for these item numbers
    const lossData = await prisma.lossData.findMany({
      where: {
        item_no: {
          in: itemNumbers,
        },
      },
    });

    // Combine weight and loss data
    const result = weightData.map(weightItem => ({
      weightData: weightItem,
      lossData: lossData.filter(lossItem => lossItem.item_no === weightItem.item_no),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in month-details API:', error);
    res.status(500).json({ error: 'Error fetching month details' });
  }
}
