import { db } from '../db';
import { users } from '../schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import type { User, NewUser } from '../schema';

export async function createUserProfile(data: Omit<NewUser, 'id'>): Promise<User> {
  const [user] = await db
    .insert(users)
    .values({
      ...data,
      id: nanoid(),
    })
    .returning();

  if (!user) throw new Error('Failed to create user');
  return user;
}

export async function updateUser(id: string, data: Partial<Omit<NewUser, 'id'>>): Promise<User> {
  const [user] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  if (!user) throw new Error('User not found');
  return user;
} 