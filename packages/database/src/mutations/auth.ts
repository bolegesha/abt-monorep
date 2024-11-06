import { db } from '../db';
import { users, sessions } from '../schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';
import type { NewUser, User, LoginSchema } from '../schema';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function signUp(data: Omit<NewUser, 'id'>) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (existingUser[0]) {
    throw new AuthError('User already exists');
  }

  const hashedPassword = await hash(data.password, 10);
  
  const [user] = await db
    .insert(users)
    .values({
      id: nanoid(),
      ...data,
      password: hashedPassword,
    })
    .returning();

  if (!user) throw new AuthError('Failed to create user');

  const session = await createSession(user.id);
  if (!session) throw new AuthError('Failed to create session');

  return { user, session: session.token };
}

export async function signIn({ email, password }: LoginSchema) {
  try {
    console.log('Signing in with:', { email, password });
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthError('Invalid credentials');
    }

    const session = await createSession(user.id);
    if (!session) throw new AuthError('Failed to create session');

    console.log('Sign in result:', { user, session: session.token });
    return { user, session: session.token };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function createSession(userId: string) {
  await db
    .delete(sessions)
    .where(eq(sessions.userId, userId));

  const [session] = await db
    .insert(sessions)
    .values({
      id: nanoid(),
      userId,
      token: nanoid(32),
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
    })
    .returning();

  return session;
}

export async function signOut(token: string) {
  await db
    .delete(sessions)
    .where(eq(sessions.token, token));
}

export async function revokeAllSessions(userId: string) {
  await db
    .delete(sessions)
    .where(eq(sessions.userId, userId));
} 