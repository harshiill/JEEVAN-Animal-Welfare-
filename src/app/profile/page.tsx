/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Navbar from '../_components/Navbar/Navbar';
import Link from 'next/link';
import LoadingSpinnerInside from '../_components/LoadingSpinnerInside/LoadingSpinnerInside';
import Footer from '../_components/Footer/Footer';

interface Query {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Profile {
  name: string;
  email: string;
  createdAt: string;
  profilePicture?: string;
  totalReportsIssued: number;
  totalDonations: number;
  totalAmountDonated: number;
  totalRescuedAnimals: number;
  availabilityRadius?: number;
  totalQueriesPosted: number;
  queries: Query[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedQueries, setPaginatedQueries] = useState<Query[]>([]);
  const pageSize = 5;

  const fetchProfile = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/profile?page=${page}&limit=${pageSize}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
        setPaginatedQueries(data.data.queries || []);
      } else {
        setProfile(null);
        setPaginatedQueries([]);
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(currentPage);
  }, [currentPage]);

  const totalPages = profile ? Math.ceil(profile.totalQueriesPosted / pageSize) : 1;

  if (loading) return <LoadingSpinnerInside title="Profile" />;
  if (!profile)
    return <p className="text-center p-6 text-red-500">Failed to load profile.</p>;

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">👤 Your Profile</h1>

        {/* Profile Info */}
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col sm:flex-row gap-6 border border-gray-200">
          <img
            src={profile.profilePicture || '/profile-user.png'}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
            <p className="text-sm text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500 mb-4">
              Joined on {new Date(profile.createdAt).toLocaleDateString()}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Total Reports Issued', value: profile.totalReportsIssued, color: 'text-blue-800' },
                { label: 'Total Donations', value: profile.totalDonations, color: 'text-green-800' },
                { label: 'Total Amount Donated', value: `₹${profile.totalAmountDonated}`, color: 'text-green-800' },
                { label: 'Total Rescued Animals', value: profile.totalRescuedAnimals, color: 'text-purple-800' },
                { label: 'Total Queries Posted', value: profile.totalQueriesPosted, color: 'text-pink-800' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 shadow-sm border col-span-full sm:col-span-1">
                  <p className="text-gray-500">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Queries Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📝 Your Queries</h2>

          {paginatedQueries.length === 0 ? (
            <p className="text-gray-600">You haven&#39;t posted any queries yet.</p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedQueries.map((query) => (
                  <Link
                    key={query._id}
                    href={`/forum/${query._id}`}
                    className="block bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{query.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{query.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Posted on {new Date(query.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
