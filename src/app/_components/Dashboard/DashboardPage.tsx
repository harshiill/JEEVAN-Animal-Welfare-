"use client";

import { useState } from "react";

type Task = {
  id: string;
  location: string;
  status: "In Progress" | "Completed" | "Pending";
  volunteer: string;
  date: string;
};

export default function DashboardPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const tasks: Task[] = [
    { id: "12345", location: "City Center Park", status: "In Progress", volunteer: "Ethan Carter", date: "2024-07-26" },
    { id: "12346", location: "Residential Area", status: "Completed", volunteer: "Olivia Bennett", date: "2024-07-25" },
    { id: "12347", location: "Rural Outskirts", status: "Pending", volunteer: "Noah Thompson", date: "2024-07-24" },
    { id: "12348", location: "Industrial Zone", status: "In Progress", volunteer: "Sophia Davis", date: "2024-07-23" },
    { id: "12349", location: "Coastal Region", status: "Completed", volunteer: "Liam Wilson", date: "2024-07-22" },
  ];

  return (
    <div className="flex min-h-screen bg-white text-[#000] font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarExpanded ? "w-64" : "w-20"
        } transition-all duration-300 p-4 border-r bg-white hidden md:flex flex-col gap-6 text-[15px]`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            {sidebarExpanded && (
              <div>
                <h2 className="text-xl font-bold">Jeevan</h2>
                <p className="text-[12px] text-[#00C4B4]">Rescue & Reporting</p>
              </div>
            )}
          </div>
          <button
            className="text-sm text-gray-500 hover:text-black"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
          >
            {sidebarExpanded ? "«" : "»"}
          </button>
        </div>

        <nav className="flex flex-col gap-2 font-medium">
          <a className="bg-[#f0fdfc] text-[#00C4B4] px-4 py-2 rounded-lg flex items-center gap-3" href="#">
            🏠 {sidebarExpanded && "Dashboard"}
          </a>
          <a className="hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-3" href="#">
            🏢 {sidebarExpanded && "Shelters"}
          </a>
          <a className="hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-3" href="#">
            👥 {sidebarExpanded && "Volunteers"}
          </a>
          <a className="hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-3" href="#">
            🆘 {sidebarExpanded && "Rescue Tasks"}
          </a>
          <a className="hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-3" href="#">
            🧠 {sidebarExpanded && "AI Usage"}
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#f3f5f7] rounded-xl p-6 text-center">
            <p className="text-base text-gray-600">Total Shelters</p>
            <p className="text-3xl font-bold mt-1">125</p>
          </div>
          <div className="bg-[#f3f5f7] rounded-xl p-6 text-center">
            <p className="text-base text-gray-600">Active Volunteers</p>
            <p className="text-3xl font-bold mt-1">350</p>
          </div>
          <div className="bg-[#f3f5f7] rounded-xl p-6 text-center">
            <p className="text-base text-gray-600">Ongoing Rescue Tasks</p>
            <p className="text-3xl font-bold mt-1">15</p>
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
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full
                        ${task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}>
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
