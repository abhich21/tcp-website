import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Run all queries in parallel for better performance
    const [portfolioTotal, portfolioActive, portfolioArchived, messageCount, auditCount] = await Promise.all([
      prisma.portfolioItem.count(),
      prisma.portfolioItem.count({ where: { isDeleted: false } }),
      prisma.portfolioItem.count({ where: { isDeleted: true } }),
      prisma.contactMessage.count(),
      prisma.auditLog.count(),
    ]);

    res.json({
      portfolioTotal,
      portfolioActive,
      portfolioArchived,
      messageCount,
      auditCount,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
