/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../_components/Navbar/Navbar';

interface Query {
  _id: string;
  title: string;
  content: string;
  owner: {
    name: string;
    profilePicture: string;
  };
  createdAt: string;
}

export default function ForumPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/query?page=${page}`);
      const data = await res.json();

      if (data.success && data.data?.queries) {
        setQueries(data.data.queries);
        setTotalPages(data.data.totalPages || 1);
      } else {
        setQueries([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch queries:", err);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [page]);

  return (
    <main className="min-h-screen bg-white text-[#000000] font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📚 Forum</h1>
          <Link
            href="/forum/new"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Query
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : queries.length === 0 ? (
          <p>No queries yet.</p>
        ) : (
          queries.map((query) => (
            <Link
              key={query._id}
              href={`/forum/${query._id}`}
              className="block p-4 mb-4 bg-gray-100 rounded-xl shadow hover:bg-gray-200 transition"
            >
              <h2 className="text-xl font-semibold">{query.title}</h2>
              <p className="text-gray-600 line-clamp-2">{query.content}</p>
              <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <img
                  src={query.owner?.profilePicture || '/user.png'}
                  alt="profile"
                  className="w-6 h-6 rounded-full"
                />
                {query.owner?.name} •{' '}
                {new Date(query.createdAt).toLocaleString()}
              </div>
            </Link>
          ))
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
