import { db } from '../db';
import { users, sessions } from '../schema';
import { eq, and, gt } from 'drizzle-orm';
import type { User } from '../schema';

export async function getUserBySession(token: string): Promise<User | null> {
  const [result] = await db
    .select({
      user: users,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date())
      )
    )
    .innerJoin(users, eq(sessions.userId, users.id))
    .limit(1);

  return result?.user || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user || null;
} 