'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signIn, signUp, signOut, createSession } from '../mutations/auth';
import { getUserBySession } from '../queries/auth';
import type { User, LoginSchema } from '../schema';

const setCookie = (name: string, value: string) => {
  const threeHours = new Date(Date.now() + 3 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${threeHours}; path=/`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      setCookie('authToken', data.token);
      localStorage.setItem('authToken', data.token);
      
      setUser(data.user);
      setToken(data.token);

      // Redirect based on user type
      if (data.user.user_type === 'admin') {
        router.push('/admin');
      } else if (data.user.user_type === 'worker') {
        router.push('/worker-profile');
      } else {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, userType: 'user' | 'worker') => {
    setLoading(true);
    setError(null);
    try {
      const { user, session } = await signUp({
        email,
        password,
        fullName: name,
        user_type: userType,
      });

      setCookie('authToken', session);
      localStorage.setItem('authToken', session);

      setUser(user);
      setToken(session);

      if (userType === 'worker') {
        router.push('/worker-profile');
      } else {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred during signup');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear local storage and cookies
      localStorage.removeItem('authToken');
      deleteCookie('authToken');
      
      // Clear state
      setUser(null);
      setToken(null);
      
      // Redirect to landing page (port 3000)
      window.location.href = 'http://localhost:3000';
    } catch (error) {
      console.error('Logout error:', error);
      setError('An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return false;
      }

      const user = await getUserBySession(storedToken);
      if (user) {
        setUser(user);
        setToken(storedToken);
        setLoading(false);
        return true;
      }

      localStorage.removeItem('authToken');
      setUser(null);
      setToken(null);
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Error checking session:', error);
      setUser(null);
      setToken(null);
      setLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    if (pathname !== '/auth') {
      checkSession();
    }
  }, [checkSession, pathname]);

  return { user, token, error, loading, login, signup, logout, checkSession };
} 