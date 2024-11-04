'use client';

import { useState } from 'react';
import { useUserData } from '@repo/database';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(
  () => import('@/components/interactive-map'),
  { ssr: false }
);

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, error: authError, loading } = useUserData();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (isLogin) {
        await login(email, password);
        toast.success('Successfully signed in!');
      } else {
        const name = formData.get('name') as string;
        const userType = formData.get('user_type') as 'user' | 'worker';
        await signup(email, password, name, userType);
        toast.success('Account created successfully!');
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <>
      {isSubmitting ? (
        <div>Processing...</div>
      ) : (
        <div className="flex flex-col md:flex-row h-screen bg-[#F5F5F7]">
          <div className="md:w-3/5 h-1/3 md:h-full">
            <InteractiveMap />
          </div>

          <div className="md:w-2/5 p-8 flex flex-col justify-center h-2/3 md:h-full overflow-y-auto">
            <div className="max-w-lg w-full mx-auto space-y-10">
              <div>
                <h2 className="text-4xl font-semibold text-[#1D1D1F] text-center mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-center text-[#86868B] text-lg">
                  {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
                </p>
              </div>

              {error && (
                <div className="bg-[#FFF0F0] text-[#FF3B30] p-4 rounded-xl text-center" role="alert">
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-8">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-[#1D1D1F] text-sm font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        disabled={isSubmitting}
                        className="mt-1 w-full px-4 py-4 bg-white border border-[#D1D1D6] rounded-xl focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-colors text-lg"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user_type" className="text-[#1D1D1F] text-sm font-medium">
                        Account Type
                      </Label>
                      <select
                        id="user_type"
                        name="user_type"
                        required
                        disabled={isSubmitting}
                        className="mt-1 w-full px-4 py-4 bg-white border border-[#D1D1D6] rounded-xl focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-colors text-lg"
                      >
                        <option value="user">User</option>
                        <option value="worker">Worker</option>
                      </select>
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="email-address" className="text-[#1D1D1F] text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    className="mt-1 w-full px-4 py-4 bg-white border border-[#D1D1D6] rounded-xl focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-colors text-lg"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-[#1D1D1F] text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    disabled={isSubmitting}
                    className="mt-1 w-full px-4 py-4 bg-white border border-[#D1D1D6] rounded-xl focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-colors text-lg"
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00358E] text-white py-4 px-6 rounded-xl text-lg font-medium hover:bg-[#0077ED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  onClick={toggleAuthMode}
                  variant="link"
                  disabled={isSubmitting}
                  className="text-[#00358E] hover:text-[#0077ED] text-lg"
                >
                  {isLogin ? 'Create a new account' : 'Already have an account? Sign in'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}