import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all audit logs
export const getAllAuditLogs = async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
    });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
