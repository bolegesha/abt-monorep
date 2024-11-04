'use client';

import { useUserData } from '@repo/database';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useUserData();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user?.fullName || user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Welcome to your dashboard!</h2>
              <p className="mt-2">Your account type: {user?.user_type}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 