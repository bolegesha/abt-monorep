import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the auth cookie
    cookies().delete('authToken');
    
    return Response.json({ 
      success: true 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ 
      success: false,
      error: 'Logout failed' 
    }, { 
      status: 500 
    });
  }
} 