import { cookies } from 'next/headers';
import { getUserBySession } from '../queries/auth';
import type { User } from '../schema';

export async function getSession(): Promise<User | null> {
  const sessionId = cookies().get('sessionId')?.value;
  if (!sessionId) return null;

  return getUserBySession(sessionId);
}

export async function getCurrentUser(): Promise<User | null> {
  return getSession();
} 