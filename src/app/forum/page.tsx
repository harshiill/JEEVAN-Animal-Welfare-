/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Navbar from '../_components/Navbar/Navbar';
import Footer from '../_components/Footer/Footer';

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ForumPage() {
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useSWR(`/api/query?page=${page}`, fetcher);

  const queries: Query[] = data?.data?.queries || [];
  const totalPages = data?.data?.totalPages || 1;

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

        {/* Loading Skeletons */}
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse p-4 mb-4 bg-gray-100 rounded-xl shadow"
            >
              <div className="h-5 w-3/4 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-full bg-gray-300 rounded mb-2" />
              <div className="h-4 w-2/3 bg-gray-300 rounded" />
            </div>
          ))
        ) : error ? (
          <p className="text-red-600">Failed to load queries.</p>
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
      <Footer />
    </main>
  );
}
