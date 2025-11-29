import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Logs an administrative action to the database.
 * @param {Object} params
 * @param {string} params.actor - The username of the admin performing the action.
 * @param {string} params.action - The type of action (CREATE, UPDATE, DELETE).
 * @param {string} params.tableName - The name of the table being modified.
 * @param {number} params.recordId - The ID of the record being modified.
 * @param {Object} [params.beforeData] - The data state before the change (for UPDATE/DELETE).
 * @param {Object} [params.afterData] - The data state after the change (for CREATE/UPDATE).
 */
export const logAdminAction = async ({ 
  actor, 
  action, 
  tableName, 
  recordId, 
  beforeData = null, 
  afterData = null 
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        actor,
        action,
        tableName,
        recordId,
        diff: {
          before: beforeData,
          after: afterData
        }
      }
    });
  } catch (error) {
    console.error('⚠️ Audit Log Error:', error);
  }
};