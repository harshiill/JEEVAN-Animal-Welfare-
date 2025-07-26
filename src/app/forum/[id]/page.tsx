/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/_components/Navbar/Navbar";
import { toast } from "sonner";
import LoadingSpinnerInside from "@/app/_components/LoadingSpinnerInside/LoadingSpinnerInside";

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

export default function QueryDetailPage() {
  const { id } = useParams();
  const [query, setQuery] = useState<Query | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchQuery = async () => {
    try {
      const res = await fetch(`/api/query/${id}`);
      const data = await res.json();
      if (data.success) setQuery(data.data);
    } catch (err) {
      console.error("Failed to fetch query:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comment?queryId=${id}&page=${page}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data.comments);
        setTotalPages(data.data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const res = await fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryId: id, content: newComment }),
    });

    if (res.ok) { 
      toast.success("Comment added successfully");
      setNewComment("");
      fetchComments();
     
    } else {
      toast.error("Failed to add comment");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchQuery(), fetchComments()]).finally(() =>
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchComments().finally(() => setLoading(false));
  }, [page]);

  return (
    <main className="min-h-screen bg-white text-black font-sans relative">
      <Navbar />
      {loading && <LoadingSpinnerInside title="Comments" />}

      <div
        className={`max-w-4xl mx-auto p-6 transition-opacity ${
          loading ? "opacity-20 pointer-events-none select-none" : "opacity-100"
        }`}
      >
        {query && (
          <div className="bg-gray-100 p-4 rounded shadow mb-6">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={query.owner?.profilePicture || "/user.png"}
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
              <div
                key={comment._id}
                className="border rounded p-3 bg-gray-50"
              >
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={comment.owner?.profilePicture || "/user.png"}
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

          {/* Pagination Controls */}
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
    </main>
  );
}
