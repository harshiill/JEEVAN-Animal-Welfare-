/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

function Page() {
  const [form, setForm] = useState({
    username: '',
    code: '',
  });
    const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/verify-code', form);
      setSuccess(res.data.message);
        setForm({ username: '', code: '' }); // Reset form on success
        alert('Verification successful! You can now log in.');
        router.push('/login');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Verify Code</h1>
          <p className="text-center text-gray-600 mb-4">
            Please enter the verification code sent to your email.
          </p>

          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4] mb-4"
              required
            />
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="Enter verification code"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4] mb-4"
              required
            />

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

            <button
              type="submit"
              className="w-full bg-[#00C4B4] hover:bg-[#00a89d] text-white font-semibold py-2 rounded-md transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
