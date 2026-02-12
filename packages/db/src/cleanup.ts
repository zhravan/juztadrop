import { db, sessions, otpTokens } from './index';
import { lt, and, sql } from 'drizzle-orm';

/**
 * Cleanup expired sessions
 * Should be run periodically (e.g., via cron job or scheduled task)
 */
export async function cleanupExpiredSessions() {
  const now = new Date();
  const result = await db
    .delete(sessions)
    .where(lt(sessions.expiresAt, now));
  
  console.log(`Cleaned up expired sessions`);
  return result;
}

/**
 * Cleanup expired and used OTP tokens
 * Should be run periodically
 */
export async function cleanupExpiredOtpTokens() {
  const now = new Date();
  const result = await db
    .delete(otpTokens)
    .where(lt(otpTokens.expiresAt, now));
  
  console.log(`Cleaned up expired OTP tokens`);
  return result;
}

/**
 * Cleanup used OTP tokens older than specified hours
 */
export async function cleanupUsedOtpTokens(olderThanHours: number = 24) {
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - olderThanHours);
  
  const result = await db
    .delete(otpTokens)
    .where(
      and(
        sql`${otpTokens.used} = true`,
        lt(otpTokens.createdAt, cutoffDate)
      )
    );
  
  console.log(`Cleaned up used OTP tokens older than ${olderThanHours} hours`);
  return result;
}

/**
 * Run all cleanup tasks
 */
export async function runCleanupTasks() {
  console.log('Starting cleanup tasks...');
  
  try {
    await cleanupExpiredSessions();
    await cleanupExpiredOtpTokens();
    await cleanupUsedOtpTokens(24);
    
    console.log('Cleanup tasks completed');
  } catch (error) {
    console.error('Cleanup tasks failed:', error);
    throw error;
  }
}

// Run cleanup if executed directly (CommonJS compatible)
if (require.main === module) {
  runCleanupTasks()
    .then(() => {
      console.log('Cleanup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Cleanup failed:', error);
      process.exit(1);
    });
}
