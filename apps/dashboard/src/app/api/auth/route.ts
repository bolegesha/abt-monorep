import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { signIn } from "@repo/database";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password } = data;
    
    const { user, session } = await signIn({ email, password });
    
    // Set cookie to expire in 3 hours
    cookies().set('authToken', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 3, // 3 hours in seconds
      path: '/',
    });
    
    return Response.json({ 
      success: true,
      user,
      token: session
    });
  } catch (error) {
    console.error('Auth error:', error);
    return Response.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed' 
    }, { 
      status: 401 
    });
  }
} 