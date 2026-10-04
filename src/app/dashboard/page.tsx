'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, initializeAuth, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                TPCTS News
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card: Read Articles */}
          <Link
            href="/articles"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Read Articles</h2>
            <p className="text-gray-600">Browse latest news and updates</p>
          </Link>

          {/* Card: My Profile */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-gray-600">
                <strong>Account Status:</strong> Active
              </p>
            </div>
          </div>

          {/* Card: Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Preferences</h2>
            <p className="text-gray-600">Manage your notification and privacy settings</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Activity</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Stats</h3>
              <p className="text-4xl font-bold text-blue-600">0</p>
              <p className="text-gray-600">Articles read</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Read</h3>
              <p className="text-gray-600">No articles read yet</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
