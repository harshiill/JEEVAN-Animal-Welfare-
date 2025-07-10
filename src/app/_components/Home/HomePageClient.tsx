"use client";

import { useState } from "react";
import Image from "next/image";

export default function HomePageClient() {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleRunDiagnosis = async () => {
    if (!file) return;
    setLoading(true);
    setPrediction(null);
    setConfidence(null);
    setShowDiagnosis(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://dog-disease-api.onrender.com/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPrediction(data.prediction || "Unknown Disease");
      setConfidence(data.confidence || null); // if confidence is returned as decimal (e.g., 0.95)
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#000000] font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-5 mb-6">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="text-lg">🐾</span> Jeevan
        </div>

        <nav className="flex gap-6 items-center text-base font-medium">
          <a href="#">Home</a>
          <a href="#">Report</a>
          <a href="#">Rescue</a>
          <a href="#">About Us</a>
          <a href="/login" className="text-[#00C4B4] hover:underline">Login</a>
          <a href="/signup" className="text-[#00C4B4] hover:underline">Signup</a>
          <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-5 py-2 rounded-full">
            Donate
          </button>
          <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-5 py-2 rounded-full">
            Volunteer
          </button>
        </nav>
      </header>

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
            <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-black font-extrabold px-6 py-3 rounded-xl shadow-lg">
              Upload Image
            </button>
          </div>
        </div>
      </section>

      {/* Upload Section */}
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

      {/* Diagnosis Section */}
      {showDiagnosis && (
        <section className="max-w-5xl mx-auto my-20">
          <h2 className="font-bold text-2xl mb-6 text-center">Diagnosis Result</h2>
          <div className="bg-[#f9f9f9] rounded-xl px-10 py-10 flex flex-col sm:flex-row sm:justify-between items-center gap-8">
            <div className="text-lg w-full sm:w-3/4 leading-relaxed">
              {prediction ? (
                <>
                  <p className="font-semibold mb-3">
                    Predicted Disease: <span className="text-[#333]">{prediction}</span>
                    {confidence !== null && (
                      <> (Confidence: {(confidence * 100).toFixed(2)}%)</>
                    )}
                  </p>
                  <p className="text-gray-600">
                    Treatment: Please consult a vet based on the predicted condition.{" "}
                    <a className="text-[#00C4B4] underline font-medium" href="#">
                      Contact a vet
                    </a>
                  </p>
                </>
              ) : (
                <p className="text-red-600">Prediction failed or no result.</p>
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
        </section>
      )}

      {/* Our Mission */}
      <section className="text-center my-14 max-w-5xl mx-auto px-6">
        <h3 className="text-xl font-bold mb-3">Our Mission</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Jeevan is dedicated to rescuing and providing care for stray and injured animals.
          We leverage technology to improve animal welfare and connect communities with rescue efforts.
        </p>
      </section>

      {/* Dogs Rescued */}
      <section className="bg-[#f3f5f7] py-6 px-8 mx-auto max-w-5xl rounded-xl text-center mb-12">
        <p className="text-gray-600 text-sm mb-1">Dogs Rescued</p>
        <p className="text-2xl font-bold">5,000</p>
      </section>

      {/* CTA Buttons */}
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
        <div className="flex justify-center gap-4 text-xl mb-3">
          <a href="#">🐦</a>
          <a href="#">📘</a>
          <a href="#">📸</a>
        </div>
        <p>© 2024 Jeevan. All rights reserved.</p>
      </footer>
    </main>
  );
}

