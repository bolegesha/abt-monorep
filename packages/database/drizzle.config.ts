import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: join(__dirname, '../../.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

export default {
  schema: './src/schema/index.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config; 