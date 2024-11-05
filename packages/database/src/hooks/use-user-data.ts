'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signIn, signUp, signOut, createSession } from '../mutations/auth';
import { getUserBySession } from '../queries/auth';
import type { User, LoginSchema } from '../schema';

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
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
      console.log('Attempting login...');
      const { user, session } = await signIn({ email, password });
      console.log('Login successful:', user);
      
      setCookie('authToken', session, 30);
      localStorage.setItem('authToken', session);
      
      setUser(user);
      setToken(session);

      router.refresh();
      
      const redirectPath = user.user_type === 'admin' 
        ? '/admin' 
        : user.user_type === 'worker'
          ? '/worker-profile'
          : '/profile';
      
      console.log('Redirecting to:', redirectPath);
      router.push(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
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

      setCookie('authToken', session, 30);
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
      const currentToken = token || localStorage.getItem('authToken');
      if (currentToken) {
        await signOut(currentToken);
        localStorage.removeItem('authToken');
        deleteCookie('authToken');
      }
      
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