'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/_components/Navbar/Navbar';
import { toast } from 'sonner';
import LoadingSpinnerInside from '@/app/_components/LoadingSpinnerInside/LoadingSpinnerInside';
export default function AddQueryPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert('All fields are required');

    setLoading(true);
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    setLoading(false);

    if (res.ok) {
      toast.success("Query posted successfully");
      setTitle('');
      setContent('');
      setTimeout(() => {
        router.push('/forum');
      }, 1500);
      router.push('/forum');
      
    } else {
      toast.error("Failed to post query");
    }
  };

  if(loading)
  {
    <LoadingSpinnerInside title="Query Addition"/>
  }
  return (
    <main className="min-h-screen bg-white text-[#000000] font-sans flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4">
          <h1 className="text-2xl font-bold mb-4">Add a New Query</h1>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            placeholder="Describe your issue..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded"
            rows={6}
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </main>
  );
}
