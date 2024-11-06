import { cookies } from 'next/headers';
import { getUserBySession } from '@repo/database';

export async function GET() {
  try {
    const authToken = cookies().get('authToken');

    if (!authToken?.value) {
      return Response.json({ authenticated: false });
    }

    const user = await getUserBySession(authToken.value);
    
    if (!user) {
      // Clear invalid cookie
      cookies().delete('authToken');
      return Response.json({ authenticated: false });
    }

    return Response.json({ 
      authenticated: true,
      user,
      token: authToken.value
    });
  } catch (error) {
    console.error('Check auth error:', error);
    // Clear cookie on error
    cookies().delete('authToken');
    return Response.json({ 
      authenticated: false,
      error: 'Authentication check failed' 
    }, { 
      status: 401 
    });
  }
} 