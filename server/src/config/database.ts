/**
 * Database Configuration
 *
 * PostgreSQL connection pool for the Pulse2 backend.
 * Uses environment variable DATABASE_URL for connection.
 */

import pg from 'pg';
const { Pool } = pg;

// Database configuration from environment
const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/pulse2';

// Create connection pool
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Log connection events in development
if (process.env.NODE_ENV !== 'production') {
  pool.on('connect', () => {
    console.log('[Database] Client connected');
  });

  pool.on('error', (err) => {
    console.error('[Database] Pool error:', err.message);
  });
}

/**
 * Execute a query and return all rows
 */
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV !== 'production' && duration > 100) {
      console.log(`[Database] Slow query (${duration}ms):`, text.substring(0, 100));
    }

    return result.rows as T[];
  } catch (error) {
    console.error('[Database] Query error:', error);
    throw error;
  }
}

/**
 * Execute a query and return the first row
 */
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

/**
 * Check database connection health
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('[Database] Connection check failed:', error);
    return false;
  }
}

/**
 * Get pool statistics
 */
export function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
}

/**
 * Graceful shutdown
 */
export async function closePool(): Promise<void> {
  await pool.end();
  console.log('[Database] Pool closed');
}

export default pool;
