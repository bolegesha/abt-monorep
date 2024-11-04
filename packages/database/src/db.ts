import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Enable connection pooling
neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL);
// @ts-ignore - Known type issue with neon-http
export const db = drizzle(sql, { schema });

export type Database = typeof db;