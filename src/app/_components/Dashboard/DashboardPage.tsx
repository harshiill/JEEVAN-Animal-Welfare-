/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import LoadingSpinnerInside from "../LoadingSpinnerInside/LoadingSpinnerInside";
import Footer from "../Footer/Footer";

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
        volunteer: report.assignedVolunteerDetails?.[0]?.name || "Unassigned",
        date: new Date(report.createdAt).toLocaleDateString(),
      });
    });
  }

  if (loading) {
    return <LoadingSpinnerInside title="Dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f9f9f9] to-[#f1f5f9] text-[#111] font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-10 text-center">
  🐾 Jeevan Animal Welfare Dashboard
</h1>



        {/* Stats Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {[
            { label: "Total Reports", value: dashboard?.totalReports },
            { label: "Active Volunteers", value: dashboard?.totalVolunteers },
            { label: "Rescued Cases", value: dashboard?.totalRescued },
            { label: "Total Donors", value: dashboard?.totalDonors },
            {
              label: "Total Donations",
              value: `₹${dashboard?.totalAmount?.toLocaleString("en-IN") || 0}`,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md hover:shadow-lg rounded-2xl p-6 text-center transition-all duration-200"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-3xl font-semibold text-[#00C4B4] mt-2">{item.value ?? 0}</p>
            </div>
          ))}
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">📌 Recent Activity</h2>
          <div className="overflow-x-auto bg-white border border-gray-200 shadow-sm rounded-2xl">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f1f5f9] text-gray-600 text-left">
                <tr>
                  <th className="py-3 px-4 font-medium">Task ID</th>
                  <th className="py-3 px-4 font-medium">Location</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Volunteer</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 text-blue-600 font-medium whitespace-nowrap">
                        #{task.id.slice(-6)}
                      </td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No recent reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
