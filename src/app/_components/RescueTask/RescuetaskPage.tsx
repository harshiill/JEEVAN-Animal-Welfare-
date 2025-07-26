/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import RescueMap from "./RescueMapWrapper";
import Navbar from "../Navbar/Navbar";
import LoadingSpinnerInside from "../LoadingSpinnerInside/LoadingSpinnerInside";

interface Report {
  _id: string;
  imageUrl: string;
  typeOfAnimal: string;
  description: string;
  status: "pending" | "in-progress" | "resolved";
  location: {
    coordinates: [number, number]; // [lng, lat]
  };
}

export default function RescuetaskPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/report-all");
      const data = await res.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const markResolved = async (id: string) => {
    const confirm = window.confirm(
      "Do you want to contribute to the gallery by uploading a rescue image?"
    );
    try {
      const res = await fetch(`/api/report/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });

      const data = await res.json();
      if (data.success) {
        fetchReports();
        if (confirm) {
          window.location.href = "/gallery/upload";
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const markDeleted = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this report?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/report/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        fetchReports();
      } else {
        alert(data.error || "Failed to delete report.");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <LoadingSpinnerInside title="Reports" />;
  }

  return (
    <main className="min-h-screen bg-white text-[#000000] font-sans">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          🐾 Active Rescue Reports
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.length === 0 && <p className="text-center">No reports available.</p>}

          {reports.map((report) => {
            const [lng, lat] = report.location.coordinates;

            return (
              <div
                key={report._id}
                className="bg-white rounded-2xl shadow-md p-4 flex flex-col border border-gray-200"
              >
                <img
                  src={report.imageUrl}
                  alt="animal"
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />

                <h2 className="text-xl font-semibold capitalize text-gray-800">
                  {report.typeOfAnimal}
                </h2>

                <p className="text-gray-600 text-sm mb-2">{report.description}</p>

                <p className="text-sm text-gray-500 mb-2">
                  📍 Location: {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>

                <a
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline mb-2"
                >
                  Open in Google Maps
                </a>

                <RescueMap lat={lat} lng={lng} />

                <span
                  className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit
                    ${
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : report.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }
                  `}
                >
                  {report.status.toUpperCase()}
                </span>

                {report.status !== "resolved" && (
                  <button
                    onClick={() => markResolved(report._id)}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm py-1.5 px-4 rounded-xl transition"
                  >
                    Mark as Resolved
                  </button>
                )}

                {/* 🗑️ Delete Button */}
                <button
                  onClick={() => markDeleted(report._id)}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 px-4 rounded-xl transition"
                >
                  Delete Report
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
