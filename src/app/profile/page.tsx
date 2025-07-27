/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from "react";
import Navbar from "../_components/Navbar/Navbar";
import Link from "next/link";
import LoadingSpinnerInside from "../_components/LoadingSpinnerInside/LoadingSpinnerInside";
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
  const pageSize = 5;

  const fetchProfile = async (page=1) => {
    try {
      const res = await fetch(`/api/profile?page=${page}&limit=5`);
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const paginate = (arr: Query[], page: number, size: number) => {
    const start = (page - 1) * size;
    return arr.slice(start, start + size);
  };

  const totalPages = profile ? Math.ceil(profile.queries.length / pageSize) : 1;
  const paginatedQueries = profile ? paginate(profile.queries, currentPage, pageSize) : [];

  if (loading) return <LoadingSpinnerInside title="Profile" />;
  if (!profile) return <p className="text-center p-6 text-red-500">Failed to load profile.</p>;

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">👤 Your Profile</h1>

        {/* Profile Details */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col sm:flex-row gap-6 border border-gray-200">
          <div className="flex-shrink-0">
            <img
              src={profile.profilePicture || "/default-profile.png"}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">{profile.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{profile.email}</p>
            <p className="text-sm text-gray-500 mb-4">
              Joined on {new Date(profile.createdAt).toLocaleDateString()}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm border">
                <p className="text-gray-500">Total Reports Issued</p>
                <p className="text-lg font-bold text-blue-800">{profile.totalReportsIssued}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm border">
                <p className="text-gray-500">Total Donations</p>
                <p className="text-lg font-bold text-green-800">{profile.totalDonations}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm border">
                <p className="text-gray-500">Total Amount Donated</p>
                <p className="text-lg font-bold text-green-800">₹{profile.totalAmountDonated}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm border">
                <p className="text-gray-500">Total Rescued Animals</p>
                <p className="text-lg font-bold text-purple-800">{profile.totalRescuedAnimals}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm border col-span-full">
                <p className="text-gray-500">Total Queries Posted</p>
                <p className="text-lg font-bold text-pink-800">{profile.totalQueriesPosted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Queries Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📝 Your Queries</h2>
          {profile.queries.length === 0 ? (
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
              <div className="flex justify-center gap-2 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1">{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
