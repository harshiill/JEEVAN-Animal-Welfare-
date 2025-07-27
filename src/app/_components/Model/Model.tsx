/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../Navbar/Navbar";
import Link from "next/link";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";

interface VetClinic {
  name: string;
  lat: number;
  lon: number;
}

export default function Model() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);

  const [vetClinics, setVetClinics] = useState<VetClinic[]>([]);
  const [vetLoading, setVetLoading] = useState(false);
  const [vetError, setVetError] = useState<string | null>(null);
  const [showVets, setShowVets] = useState(false);

  const handleFileSelect = (file: File) => {
    setFile(file);
    setImageUrl(URL.createObjectURL(file));
    setPrediction(null);
    setConfidence(null);
    setShowDiagnosis(false);
  };

  const handleRunDiagnosis = async () => {
    if (!file) return toast.error("Please upload an image first.");
    setLoading(true);
    setShowDiagnosis(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/predict-json", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Prediction failed.");

      setPrediction(data.prediction || "Unknown Disease");
      setConfidence(data.confidence || null);
      toast.success("Diagnosis successful!");
    } catch (error) {
      toast.error("Failed to diagnose. Please try again.");
      setPrediction("Diagnosis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFindVets = () => {
    if (!navigator.geolocation) {
      setVetError("Geolocation is not supported.");
      return;
    }

    setVetLoading(true);
    setVetClinics([]);
    setVetError(null);
    setShowVets(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const overpassUrl = `https://overpass-api.de/api/interpreter`;
          const query = `
            [out:json];
            node["amenity"="veterinary"](around:10000,${latitude},${longitude});
            out;
          `;

          const response = await fetch(overpassUrl, {
            method: "POST",
            body: query,
            headers: { "Content-Type": "text/plain" },
          });

          const data = await response.json();
          const clinics: VetClinic[] = data.elements.map((el: any) => ({
            name: el.tags.name || "Unnamed Clinic",
            lat: el.lat,
            lon: el.lon,
          }));

          setVetClinics(clinics);
        } catch (err) {
          setVetError("Failed to fetch vet clinics.");
        } finally {
          setVetLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setVetError("Unable to get your location.");
        setVetLoading(false);
      }
    );
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[480px] max-w-6xl mx-auto mt-8 rounded-2xl overflow-hidden shadow-md">
        <Image
          src="/Dog5.jpg"
          alt="Dog Hero"
          fill
          className="object-cover rounded-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/30 to-black/60 flex items-end justify-end p-10">
          <div className="text-white text-right max-w-md">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow">
              Help Us Save Lives
            </h1>
            <p className="text-base md:text-lg drop-shadow">
              Report stray or injured animals and get real-time diagnosis and vet help.
            </p>
          </div>
        </div>
      </section>

      {/* Upload */}
      <section className="border-2 border-dashed border-gray-300 rounded-2xl p-8 mx-auto my-10 text-center max-w-3xl shadow">
        <h2 className="text-lg font-semibold mb-2">Upload Image</h2>
        <p className="text-sm text-gray-700 mb-4">
          Upload an image of the animal to get a diagnosis.
        </p>

        {/* FileUpload Component */}
        <div className="mb-4">
          <FileUpload onChange={(files) => handleFileSelect(files[0])} />

        </div>

        <button
          onClick={handleRunDiagnosis}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Running Diagnosis..." : "Run Diagnosis"}
        </button>
      </section>

      {/* Diagnosis */}
      {showDiagnosis && (
        <section className="max-w-4xl mx-auto my-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Diagnosis Result</h2>
          <div className="bg-gray-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow">
            <div className="flex-1 text-left">
              {prediction ? (
                <>
                  <p className="font-semibold text-gray-800">
                    Predicted Disease:{" "}
                    <span className="text-blue-700">{prediction}</span>
                    {confidence !== null && (
                      <span className="ml-2 text-sm text-gray-600">
                        (Confidence: {(confidence * 100).toFixed(2)}%)
                      </span>
                    )}
                  </p>
                  <p className="mt-4 text-gray-700">
                    Please consult a vet for proper treatment.
                    <button
                      onClick={handleFindVets}
                      className="ml-2 text-blue-600 underline hover:text-blue-800"
                    >
                      Find Nearby Vets
                    </button>
                  </p>
                </>
              ) : (
                <p className="text-red-600">Diagnosis failed.</p>
              )}
            </div>
            <div>
              <Image
                src={imageUrl || "/diagnosis-dog.jpg"}
                alt="Diagnosis"
                width={180}
                height={180}
                className="rounded-xl object-cover"
              />
            </div>
          </div>

          {/* Vets */}
          {showVets && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Nearby Vet Clinics</h3>
              {vetLoading ? (
                <p>Locating nearby clinics...</p>
              ) : vetError ? (
                <p className="text-red-600">{vetError}</p>
              ) : vetClinics.length === 0 ? (
                <p>No vet clinics found nearby.</p>
              ) : (
                <ul className="list-disc pl-6 text-sm text-gray-800 space-y-2">
                  {vetClinics.map((clinic, idx) => (
                    <li key={idx}>
                      {clinic.name}
                      <a
                        href={`https://maps.google.com/?q=${clinic.lat},${clinic.lon}`}
                        target="_blank"
                        className="ml-2 text-blue-600 underline hover:text-blue-800"
                      >
                        View on map
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}

      {/* Mission */}
      <section className="text-center my-14 max-w-5xl mx-auto px-6">
        <h3 className="text-xl font-bold mb-3">Our Mission</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Jeevan is dedicated to rescuing and providing care for stray and injured animals.
          We leverage technology to improve animal welfare and connect communities with rescue efforts.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-6 px-8 mx-auto max-w-5xl rounded-xl text-center mb-12">
        <p className="text-gray-600 text-sm mb-1">Dogs Rescued</p>
        <p className="text-2xl font-bold text-blue-700">5,000+</p>
      </section>

      {/* CTA */}
      <div className="flex justify-center gap-4 mb-16">
        <Link
          href="/donate"
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Donate
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center py-6 border-t">
        <div className="flex justify-center gap-6 mb-3">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
        <p>© 2024 Jeevan. All rights reserved.</p>
      </footer>
    </main>
  );
}
