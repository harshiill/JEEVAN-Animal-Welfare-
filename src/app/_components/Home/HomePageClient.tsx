/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../Navbar/Navbar";

interface VetClinic {
  name: string;
  lat: number;
  lon: number;
}

export default function HomePageClient() {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [vetLoading, setVetLoading] = useState(false);
  const [vetClinics, setVetClinics] = useState<VetClinic[]>([]);
  const [vetError, setVetError] = useState<string | null>(null);
  const [showVets, setShowVets] = useState(false);

  const handleRunDiagnosis = async () => {
    if (!file) return;
    setLoading(true);
    setPrediction(null);
    setConfidence(null);
    setShowDiagnosis(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://dog-disease-api.onrender.com/predict-json", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Unknown prediction error");

      setPrediction(data.prediction || "Unknown Disease");
      setConfidence(data.confidence || null);
    } catch (error: any) {
      console.error("Prediction error:", error);
      setPrediction("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFindVets = () => {
    if (!navigator.geolocation) {
      setVetError("Geolocation not supported.");
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
            node
              ["amenity"="veterinary"]
              (around:10000,${latitude},${longitude});
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
    <main className="min-h-screen bg-white text-[#000000] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative w-full h-[480px] max-w-5xl mx-auto mt-8 rounded-xl overflow-hidden">
        <Image
          src="/dog-hero.jpeg"
          alt="Dog Hero"
          fill
          className="object-cover object-center rounded-xl"
          priority
        />
        <div className="absolute inset-0 flex items-end justify-end p-10 bg-gradient-to-r from-transparent via-black/30 to-black/50 rounded-xl">
          <div className="text-right text-white max-w-md">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
              Help Us Save Lives
            </h1>
            <p className="text-base md:text-lg mb-6 drop-shadow">
              Report stray or injured animals and get real-time diagnosis and assistance
            </p>
          </div>
        </div>
      </section>

      {/* Upload */}
      <section className="border-2 border-dashed border-gray-300 rounded-xl p-8 mx-auto my-10 text-center max-w-5xl">
        <h2 className="font-semibold text-md mb-2">Upload Image</h2>
        <p className="text-sm mb-4 text-gray-700">
          Drag and drop or click to upload an image of the animal.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const uploadedFile = e.target.files?.[0];
            if (uploadedFile) {
              setImageUploaded(true);
              setImageUrl(URL.createObjectURL(uploadedFile));
              setFile(uploadedFile);
              setShowDiagnosis(false);
              setPrediction(null);
              setConfidence(null);
            }
          }}
          className="mb-4"
        />
        <br />
        <button
          className="bg-gray-900 text-white px-5 py-2 rounded-full font-medium disabled:opacity-50"
          onClick={handleRunDiagnosis}
          disabled={!imageUploaded || loading}
        >
          {loading ? "Running..." : "Run Diagnosis"}
        </button>
      </section>

      {/* Diagnosis */}
      {showDiagnosis && (
        <section className="max-w-5xl mx-auto my-20">
          <h2 className="font-bold text-2xl mb-6 text-center">Diagnosis Result</h2>
          <div className="bg-[#f9f9f9] rounded-xl px-10 py-10 flex flex-col sm:flex-row sm:justify-between items-center gap-8">
            <div className="text-lg w-full sm:w-3/4 leading-relaxed">
              {prediction ? (
                <>
                  <p className="font-semibold mb-3">
                    Predicted Disease: <span className="text-[#333]">{prediction}</span>
                    {confidence !== null && <> (Confidence: {(confidence * 100).toFixed(2)}%)</>}
                  </p>
                  <p className="text-gray-600">
                    Treatment: Please consult a vet based on the predicted condition.{" "}
                    <button
                      className="text-[#00C4B4] underline font-medium"
                      onClick={handleFindVets}
                    >
                      Contact a vet
                    </button>
                  </p>
                </>
              ) : (
                <p className="text-red-600">Result is loading.</p>
              )}
            </div>
            <div>
              <Image
                src={imageUrl || "/diagnosis-dog.jpg"}
                alt="Diagnosis Dog"
                width={180}
                height={180}
                className="rounded-xl object-cover"
              />
            </div>
          </div>

          {/* Vet Results */}
          {showVets && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Nearby Vet Clinics</h3>
              {vetLoading ? (
                <p>Searching for nearby clinics...</p>
              ) : vetError ? (
                <p className="text-red-600">{vetError}</p>
              ) : vetClinics.length === 0 ? (
                <p>No clinics found nearby.</p>
              ) : (
                <ul className="list-disc pl-5">
                  {vetClinics.map((clinic, idx) => (
                    <li key={idx}>
                      {clinic.name}{" "}
                      <a
                        href={`https://www.google.com/maps?q=${clinic.lat},${clinic.lon}`}
                        target="_blank"
                        className="text-blue-600 underline ml-2"
                      >
                        View on Map
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
      <section className="bg-[#f3f5f7] py-6 px-8 mx-auto max-w-5xl rounded-xl text-center mb-12">
        <p className="text-gray-600 text-sm mb-1">Dogs Rescued</p>
        <p className="text-2xl font-bold">5,000</p>
      </section>

      {/* CTA */}
      <div className="flex justify-center gap-4 mb-16">
        <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-6 py-3 rounded-full">
          Volunteer
        </button>
        <button className="border border-gray-300 px-6 py-3 rounded-full text-sm">
          Donate
        </button>
      </div>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center py-6">
        <div className="flex justify-center gap-6 mb-3">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
        <p>© 2024 Jeevan. All rights reserved.</p>
      </footer>
    </main>
  );
}
