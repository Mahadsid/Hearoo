"use client";
import React, { useState } from "react";

interface SampleInferenceProps {
  onSampleResult: (data: any) => void; // send result to parent page
}

const sampleFiles = [
  { name: "Can Opening", file: "/samples/canopen.wav" },
  { name: "Chirping Birds", file: "/samples/chirpingbirds.wav" },
  { name: "Clapping", file: "/samples/clapping.wav" },
  { name: "Knocking", file: "/samples/knock.wav" },
  { name: "Thunderstorm", file: "/samples/thunderstorm.wav" },
];

export default function SampleInference({ onSampleResult }: SampleInferenceProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  }

  const handleSampleClick = async (filePath: string, name: string) => {
    try {
      setLoading(name);
      setSelectedSample(name);
      setError(null);

      const response = await fetch(filePath);
      if (!response.ok) throw new Error("Failed to fetch sample file");

      const arrayBuffer = await response.arrayBuffer();
      const base64String = arrayBufferToBase64(arrayBuffer);

      const res = await fetch(
        "https://all-credits-used-so-no-URL",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio_data: base64String }),
        }
      );

      if (!res.ok) throw new Error(`API error: ${res.statusText}`);

      const data = await res.json();
      onSampleResult(data); // ✅ send to parent to visualize
    } catch (err: any) {
      console.error("Error processing sample:", err);
      setError(err.message || "Something went wrong while analyzing sample");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 space-y-4">
      <p className="text-md text-stone-600">Or try a sample audio file 🎵</p>

      <div className="flex flex-wrap justify-center gap-3">
        {sampleFiles.map((sample) => (
          <button
            key={sample.file}
            onClick={() => handleSampleClick(sample.file, sample.name)}
            disabled={loading === sample.name}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              loading === sample.name
                ? "bg-stone-400 text-white cursor-not-allowed"
                : "bg-stone-800 hover:bg-stone-700 text-white"
            }`}
          >
            {loading === sample.name ? "Analyzing..." : sample.name}
          </button>
        ))}
      </div>

      {/* ✅ Show selected sample name like uploaded file */}
      {selectedSample && (
        <span className="mt-3 inline-block rounded-md bg-stone-200 px-3 py-1 text-sm text-stone-700">
          🎧 Selected Sample: <span className="font-medium">{selectedSample}</span>
        </span>
      )}

      {error && (
        <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
          Error: {error}
        </p>
      )}

      <p className="text-sm text-stone-600 pt-3">
        You can download more audio samples from the{" "}
        <a
          href="https://github.com/karoldvl/ESC-50"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-800 font-medium underline hover:text-stone-600"
        >
          ESC-50 dataset
        </a>.
      </p>
    </div>
  );
}
