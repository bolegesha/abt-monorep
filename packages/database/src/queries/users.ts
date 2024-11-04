import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../schema';
import type { User } from '../schema';

export async function getUsers(): Promise<User[]> {
  return db.select().from(users);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0];
} 