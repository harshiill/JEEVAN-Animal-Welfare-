/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";


type Task = {
  id: string;
  location: string;
  status: "resolved" | "pending";
  volunteer: string;
  date: string;
};

export default function DashboardPage() {
  const [dashboard, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (data.success) {
          setDashboardData(data.data);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const tasks: Task[] = [];

  if (dashboard?.reports?.length) {
    dashboard.reports.forEach((report: any) => {
      tasks.push({
        id: report._id,
        location: report.location.coordinates.join(", "),
        status: report.status === "resolved" ? "resolved" : "pending",
        volunteer:
          report.assignedVolunteerDetails?.[0]?.name || "Unassigned",
        date: new Date(report.createdAt).toLocaleDateString(),
      });
    });
  }

if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#00C4B4] border-dashed rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
      </div>
    </div>
  );
}


  return (
    <div className="flex min-h-screen bg-white text-[#000] font-sans">
      <main className="flex-1 px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Navbar />

        {/* Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
          <div className="bg-[#f3f5f7] rounded-xl p-6 text-center">
            <p className="text-base text-gray-600">Total Reports</p>
            <p className="text-3xl font-bold mt-1">{dashboard?.totalReports || 0}</p>
          </div>
          <div className="bg-[#f3f5f7] rounded-xl p-6 text-center">
            <p className="text-base text-gray-600">Active Volunteers</p>
            <p className="text-3xl font-bold mt-1">{dashboard?.totalVolunteers || 0}</p>
          </div>
          <div className="bg-[#f3f5f7] rounded-xl p-6 text-center">
            <p className="text-base text-gray-600">Rescued Cases</p>
            <p className="text-3xl font-bold mt-1">{dashboard?.totalRescued || 0}</p>
          </div>
          <div className="bg-[#f3f5f7] rounded-xl p-6 text-center">
            <p className="text-base text-gray-600">Total Donors</p>
            <p className="text-3xl font-bold mt-1">{dashboard?.totalDonors || 0}</p>
          </div>
          <div className="bg-[#f3f5f7] rounded-xl p-6 text-center">
            <p className="text-base text-gray-600">Total Donations</p>
            <p className="text-3xl font-bold mt-1">
              ₹{dashboard?.totalAmount?.toLocaleString("en-IN") || 0}
            </p>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-x-auto bg-white border rounded-xl">
            <table className="min-w-full text-[15px]">
              <thead className="bg-[#f9fafb] text-gray-600 text-left">
                <tr>
                  <th className="py-3 px-4 font-semibold">Task ID</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Assigned Volunteer</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 text-[#00C4B4] font-medium">#{task.id}</td>
                    <td className="py-3 px-4">{task.location}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          task.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{task.volunteer}</td>
                    <td className="py-3 px-4">{task.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
