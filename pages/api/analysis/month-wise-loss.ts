import { NextApiRequest, NextApiResponse } from 'next'
import { DatabaseService } from '@/lib/databaseService'

// Helper function to convert BigInt to Number
const convertBigIntToNumber = (obj: any): any => {
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertBigIntToNumber(value)])
    );
  }
  return obj;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lossDataCheck = await DatabaseService.checkLossData();
    console.log('Loss data check result:', JSON.stringify(convertBigIntToNumber(lossDataCheck), null, 2));

    const type = req.query.type === 'percentage' ? 'percentage' : 'total';
    console.log('Fetching month-wise loss data from API...', { type });
    const result = await DatabaseService.getMonthWiseLoss(type)
    console.log('Month-wise loss API result:', JSON.stringify(convertBigIntToNumber(result), null, 2));

    if (!result || result.length === 0) {
      console.log('No data returned from the query');
      return res.status(404).json({ error: 'No data found' });
    }

    res.status(200).json(convertBigIntToNumber(result))
  } catch (error) {
    console.error('Error in month-wise-loss API:', error)
    res.status(500).json({ error: 'Error fetching month-wise loss data', details: error.message })
  }
}
