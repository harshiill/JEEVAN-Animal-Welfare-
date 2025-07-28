/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { useState } from 'react';
import Navbar from '@/app/_components/Navbar/Navbar';
import Footer from '@/app/_components/Footer/Footer';
import { toast } from 'sonner';
import LoadingSpinnerInside from '@/app/_components/LoadingSpinnerInside/LoadingSpinnerInside';

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

interface Comment {
  _id: string;
  content: string;
  owner: {
    name: string;
    profilePicture: string;
  };
  createdAt: string;
}

// SWR fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function QueryDetailPage() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState('');
  const [page, setPage] = useState(1);

  // Fetch query
  const {
    data: queryData,
    isLoading: queryLoading,
    error: queryError,
  } = useSWR(`/api/query/${id}`, fetcher);

  // Fetch comments
  const {
    data: commentData,
    isLoading: commentsLoading,
    mutate: refreshComments,
  } = useSWR(`/api/comment?queryId=${id}&page=${page}`, fetcher);

  const query: Query | null = queryData?.data || null;
  const comments: Comment[] = commentData?.data?.comments || [];
  const totalPages: number = commentData?.data?.totalPages || 1;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const res = await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryId: id, content: newComment }),
    });

    if (res.ok) {
      toast.success('Comment added successfully');
      setNewComment('');
      refreshComments(); // SWR revalidate
    } else {
      toast.error('Failed to add comment');
    }
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans relative flex flex-col justify-between">
      <Navbar />

      {(queryLoading || commentsLoading) && <LoadingSpinnerInside title="Comments" />}

      <div
        className={`max-w-4xl mx-auto p-6 grow transition-opacity ${
          queryLoading || commentsLoading
            ? 'opacity-20 pointer-events-none select-none'
            : 'opacity-100'
        }`}
      >
        {query && (
          <div className="bg-gray-100 p-4 rounded shadow mb-6">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={query.owner?.profilePicture || '/user.png'}
                className="w-8 h-8 rounded-full"
                alt="owner"
              />
              <p className="font-medium">{query.owner?.name}</p>
            </div>
            <h1 className="text-xl font-bold">{query.title}</h1>
            <p className="mt-2">{query.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              Posted on {new Date(query.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-2">Comments</h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="border rounded p-3 bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={comment.owner?.profilePicture || '/user.png'}
                    className="w-6 h-6 rounded-full"
                    alt="user"
                  />
                  <span className="font-medium">{comment.owner?.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Add Comment */}
        <div className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full border rounded p-2"
            rows={3}
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Comment
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
