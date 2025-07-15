/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from "react";
import Navbar from "../_components/Navbar/Navbar";

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
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
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

  if (loading) {
    return <p className="text-center p-6 text-gray-500">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-center p-6 text-red-500">Failed to load profile.</p>;
  }

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">👤 Your Profile</h1>

        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col sm:flex-row gap-6 border border-gray-200">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <img
              src={profile.profilePicture || "/default-profile.png"}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">{profile.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{profile.email}</p>
            <p className="text-sm text-gray-500 mb-4">Joined on {new Date(profile.createdAt).toLocaleDateString()}</p>

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
              
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
