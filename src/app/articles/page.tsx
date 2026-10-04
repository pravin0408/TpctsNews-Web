'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { articleService, Article } from '@/services/articleService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ArticlesPage() {
  const { user, loading: authLoading, initializeAuth } = useAuthStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articleService.getArticles();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchArticles();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              TPCTS News
            </Link>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Articles</h1>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-8">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {article.imageUrl && (
                  <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <p className="text-sm text-blue-600 font-semibold mb-2">{article.category}</p>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.summary}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{article.author}</span>
                    <span>{article.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
