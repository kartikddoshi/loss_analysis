import { prisma } from './database'
import { UploadMode } from '@/types'

const BATCH_SIZE = 100; // Adjust this value based on your needs

export const DatabaseService = {
  // Analysis queries
  getItemWiseLoss: async () => {
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

    return result.map(item => {
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
  },

  getKarigarWiseLoss: async () => {
    const weightData = await prisma.weightData.findMany({
      select: { item_no: true, pure_gold_weight: true }
    });
    const itemNos = weightData.map(item => item.item_no);
    const weightMap = new Map(weightData.map(item => [item.item_no, item.pure_gold_weight]));

    const result = await prisma.lossData.groupBy({
      by: ['karigar'],
      where: { item_no: { in: itemNos } },
      _sum: {
        loss: true,
        pure_gold_loss: true,
      },
    });

    const karigarLoss = result.map(item => ({
      karigar: item.karigar,
      total_loss: Number(item._sum.loss?.toFixed(3) || 0),
      total_pure_gold_loss: Number(item._sum.pure_gold_loss?.toFixed(3) || 0),
    }));

    const totalPureGoldWeight = Array.from(weightMap.values()).reduce((sum, weight) => sum + weight, 0);

    return karigarLoss.map(item => ({
      ...item,
      loss_percentage: Number(((item.total_pure_gold_loss / totalPureGoldWeight) * 100).toFixed(3))
    }))
    .sort((a, b) => b.loss_percentage - a.loss_percentage)
    .slice(0, 15);
  },

  getMonthWiseLoss: async () => {
    const weightData = await prisma.weightData.findMany({
      select: { item_no: true, pure_gold_weight: true, date: true }
    });
    const itemNos = weightData.map(item => item.item_no);

    const lossData = await prisma.lossData.findMany({
      where: { item_no: { in: itemNos } },
      select: { item_no: true, pure_gold_loss: true, date: true }
    });

    const monthlyData = lossData.reduce((acc, loss) => {
      const month = loss.date.toISOString().slice(0, 7); // YYYY-MM format
      if (!acc[month]) {
        acc[month] = { total_loss: 0, total_weight: 0 };
      }
      acc[month].total_loss += loss.pure_gold_loss;
      const weight = weightData.find(w => w.item_no === loss.item_no)?.pure_gold_weight || 0;
      acc[month].total_weight += weight;
      return acc;
    }, {} as Record<string, { total_loss: number, total_weight: number }>);

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      total_loss: Number(data.total_loss.toFixed(3)),
      loss_percentage: Number(((data.total_loss / data.total_weight) * 100).toFixed(3))
    })).sort((a, b) => a.month.localeCompare(b.month));
  },

  getProcessWiseLoss: async () => {
    const weightData = await prisma.weightData.findMany({
      select: { item_no: true, pure_gold_weight: true }
    });
    const itemNos = weightData.map(item => item.item_no);
    const weightMap = new Map(weightData.map(item => [item.item_no, item.pure_gold_weight]));

    const result = await prisma.lossData.groupBy({
      by: ['process'],
      where: { item_no: { in: itemNos } },
      _sum: {
        loss: true,
        pure_gold_loss: true,
      },
    });

    const totalPureGoldWeight = Array.from(weightMap.values()).reduce((sum, weight) => sum + weight, 0);

    return result.map(item => ({
      process: item.process,
      total_loss: Number(item._sum.loss?.toFixed(3) || 0),
      total_pure_gold_loss: Number(item._sum.pure_gold_loss?.toFixed(3) || 0),
      loss_percentage: Number(((item._sum.pure_gold_loss || 0) / totalPureGoldWeight * 100).toFixed(3))
    }));
  },

  // Item details
  getItemDetails: async (itemNo: string) => {
    const weightData = await prisma.weightData.findFirst({
      where: { item_no: itemNo },
      select: { 
        pure_gold_weight: true,
        gross_wt: true,
        net_wt: true,
        kt: true,
        date: true
      }
    });

    const lossData = await prisma.lossData.findMany({
      where: { item_no: itemNo },
      select: { 
        loss: true,
        pure_gold_loss: true,
        process: true,
        karigar: true,
        date: true,
        kt: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    const totalLoss = lossData.reduce((sum, loss) => sum + loss.loss, 0);
    const totalPureGoldLoss = lossData.reduce((sum, loss) => sum + loss.pure_gold_loss, 0);
    
    const overallLossPercentage = weightData && weightData.pure_gold_weight > 0
      ? (totalPureGoldLoss / weightData.pure_gold_weight) * 100
      : 0;

    const lossByProcess = lossData.reduce((acc, loss) => {
      if (!acc[loss.process]) {
        acc[loss.process] = { totalLoss: 0, totalPureGoldLoss: 0, karigars: {} };
      }
      acc[loss.process].totalLoss += loss.loss;
      acc[loss.process].totalPureGoldLoss += loss.pure_gold_loss;
      if (!acc[loss.process].karigars[loss.karigar]) {
        acc[loss.process].karigars[loss.karigar] = { loss: 0, pureGoldLoss: 0 };
      }
      acc[loss.process].karigars[loss.karigar].loss += loss.loss;
      acc[loss.process].karigars[loss.karigar].pureGoldLoss += loss.pure_gold_loss;
      return acc;
    }, {} as Record<string, { totalLoss: number, totalPureGoldLoss: number, karigars: Record<string, { loss: number, pureGoldLoss: number }> }>);

    return {
      item_no: itemNo,
      weightData: weightData ? {
        ...weightData,
        pure_gold_weight: Number(weightData.pure_gold_weight.toFixed(3)),
        gross_wt: Number(weightData.gross_wt.toFixed(3)),
        net_wt: Number(weightData.net_wt.toFixed(3)),
      } : null,
      lossDetails: lossData.map(loss => ({
        ...loss,
        loss: Number(loss.loss.toFixed(3)),
        pure_gold_loss: Number(loss.pure_gold_loss.toFixed(3)),
      })),
      totalLoss: Number(totalLoss.toFixed(3)),
      totalPureGoldLoss: Number(totalPureGoldLoss.toFixed(3)),
      overallLossPercentage: Number(overallLossPercentage.toFixed(3)),
      lossByProcess
    };
  },

  // Items list
  getItems: async () => {
    const items = await prisma.weightData.findMany({
      select: {
        item_no: true,
        pure_gold_weight: true,
      },
      orderBy: {
        item_no: 'asc',
      },
    });

    const itemsWithLoss = await Promise.all(
      items.map(async (item) => {
        const loss = await prisma.lossData.aggregate({
          where: { item_no: item.item_no },
          _sum: { pure_gold_loss: true },
        });

        return {
          item_no: item.item_no,
          total_loss: Number(loss._sum.pure_gold_loss || 0),
          pure_gold_weight: Number(item.pure_gold_weight),
        };
      })
    );

    return itemsWithLoss;
  },

  // Data upload
  uploadData: async (fileType: 'loss' | 'weight', data: any[], replace: boolean) => {
    const model = fileType === 'loss' ? prisma.lossData : prisma.weightData;

    if (replace) {
      await model.deleteMany();
    }

    let insertedCount = 0;
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      await prisma.$transaction(async (tx) => {
        for (const item of batch) {
          try {
            await tx[fileType === 'loss' ? 'lossData' : 'weightData'].create({
              data: item
            });
            insertedCount++;
          } catch (error) {
            console.error(`Error inserting item: ${item.item_no}`, error);
          }
        }
      });
    }

    return insertedCount;
  },

  // Clear database
  clearDatabase: async () => {
    await prisma.lossData.deleteMany();
    await prisma.weightData.deleteMany();
  },

  // Item process
  getItemProcess: async (itemNo: string) => {
    return prisma.lossData.groupBy({
      by: ['process'],
      where: { item_no: itemNo },
      _sum: {
        loss: true,
      },
    });
  },

  // Item karigar
  getItemKarigar: async (itemNo: string) => {
    return prisma.lossData.groupBy({
      by: ['karigar'],
      where: { item_no: itemNo },
      _sum: {
        loss: true,
      },
    });
  },

  // Add this method to the DatabaseService object
  getItemsWithLoss: async () => {
    const weightData = await prisma.weightData.findMany({
      select: {
        item_no: true,
        pure_gold_weight: true,
        date: true,
      },
    });

    const lossData = await prisma.lossData.groupBy({
      by: ['item_no'],
      _sum: {
        pure_gold_loss: true,
      },
    });

    const lossMap = new Map(lossData.map(item => [item.item_no, item._sum.pure_gold_loss || 0]));

    return weightData.map(item => {
      const totalPureGoldLoss = lossMap.get(item.item_no) || 0;
      const lossPercentage = item.pure_gold_weight > 0 
        ? (totalPureGoldLoss / item.pure_gold_weight) * 100 
        : 0;

      return {
        item_no: item.item_no,
        loss_percentage: Number(lossPercentage.toFixed(3)),
        date: item.date,
      };
    });
  },
};
