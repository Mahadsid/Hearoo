/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import ColorScale from "~/components/ColorScale";
import FeatureMap from "~/components/FeatureMap";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import Waveform from "~/components/Waveform";
import SampleInference from "./SamplesButton";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Prediction {
  class: string;
  confidence: number;
}

interface LayerData {
  shape: number[];
  values: number[][];
}

interface VisualizationData {
  [layerName: string]: LayerData;
}

interface WaveformData {
  values: number[];
  sample_rate: number;
  duration: number;
}

interface ApiResponse {
  predictions: Prediction[];
  visualization: VisualizationData;
  input_spectrogram: LayerData;
  waveform: WaveformData;
}

const ESC50_EMOJI_MAP: Record<string, string> = {
  dog: "🐕",
  rain: "🌧️",
  crying_baby: "👶",
  door_wood_knock: "🚪",
  helicopter: "🚁",
  rooster: "🐓",
  sea_waves: "🌊",
  sneezing: "🤧",
  mouse_click: "🖱️",
  chainsaw: "🪚",
  pig: "🐷",
  crackling_fire: "🔥",
  clapping: "👏",
  keyboard_typing: "⌨️",
  siren: "🚨",
  cow: "🐄",
  crickets: "🦗",
  breathing: "💨",
  door_wood_creaks: "🚪",
  car_horn: "📯",
  frog: "🐸",
  chirping_birds: "🐦",
  coughing: "😷",
  can_opening: "🥫",
  engine: "🚗",
  cat: "🐱",
  water_drops: "💧",
  footsteps: "👣",
  washing_machine: "🧺",
  train: "🚂",
  hen: "🐔",
  wind: "💨",
  laughing: "😂",
  vacuum_cleaner: "🧹",
  church_bells: "🔔",
  insects: "🦟",
  pouring_water: "🚰",
  brushing_teeth: "🪥",
  clock_alarm: "⏰",
  airplane: "✈️",
  sheep: "🐑",
  toilet_flush: "🚽",
  snoring: "😴",
  clock_tick: "⏱️",
  fireworks: "🎆",
  crow: "🐦‍⬛",
  thunderstorm: "⛈️",
  drinking_sipping: "🥤",
  glass_breaking: "🔨",
  hand_saw: "🪚",
};

const getEmojiForClass = (className: string): string => {
  return ESC50_EMOJI_MAP[className] || "🔈";
};

function splitLayers(visualization: VisualizationData) {
  const main: [string, LayerData][] = [];
  const internals: Record<string, [string, LayerData][]> = {};

  for (const [name, data] of Object.entries(visualization)) {
    if (!name.includes(".")) {
      main.push([name, data]);
    } else {
      const [parent] = name.split(".");
      if (parent === undefined) continue;

      if (!internals[parent]) internals[parent] = [];
      internals[parent].push([name, data]);
    }
  }

  return { main, internals };
}

export default function HomePage() {
  const [vizData, setVizData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Show toast on page load
  useEffect(() => {
    toast(
      <div>
        <p className="font-bold">⚠ ALL CREDITS ARE USED </p>
        <p className="italic">Send money to Mahad 😅💸 so he can buy cretits at <a href="https://modal.com" target="_blank" className="underline">Modal.com</a><br></br> Connect with him on <a href="https://github.com/Mahadsid" target="_blank" className="underline">GitHub</a></p>
      </div>,
      { duration: 10000 }
    );
  }, []);

  


  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setError(null);
    setVizData(null);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64String = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );

        const response = await fetch("https://all-credits-used-so-no-URL", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio_data: base64String }),
        });

        if (!response.ok) {
          throw new Error(`API error ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        setVizData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occured",
        );
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed ot read the file.");
      setIsLoading(false);
    };
  };

  const { main, internals } = vizData
    ? splitLayers(vizData?.visualization)
    : { main: [], internals: {} };

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-[100%]">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-light tracking-tight text-stone-900">
            Hearoo 🎧 — Smarter Listening, Deeper Insights
          </h1>
          <p className="text-md mb-8 text-stone-600">
          Experience the power of <span className="font-medium text-stone-800">ResNet-driven audio intelligence</span>! 
          Hearoo is a CNN-based audio classifier and visualizer trained on the 
          <span className="font-medium text-stone-800"> ESC-50 dataset</span>, recognizing 50 diverse sound categories 
          with an impressive <span className="font-medium text-green-700">81.25% accuracy</span>. 
          Watch as it transforms your WAV files into visual feature maps that bring sound to life.
          </p>
          <a href="https://mahadsid.github.io/portfolio/" className="text-stone-500 hover:text-stone-800 text-sm transition-colors duration-300" target="_blank">{new Date().getFullYear()} Certified · Created with ❤️ by <span className="font-medium">Muhammad Mahad</span>
          </a>
          <div>
            <a href="https://mahadsid.github.io/portfolio/" className="text-stone-500 hover:text-stone-800 text-sm transition-colors duration-300" target="_blank">Portfolio-Muhammad Mahad</a>
          </div>
          <p className="text-md mb-8 text-stone-600 pt-3">
          Upload a WAV file and let <span className="font-medium text-stone-800">Hearoo</span> work its magic — 
          uncover predictions powered by deep learning and explore stunning <span className="font-medium">ResNet feature maps </span> 
           that reveal how your audio comes to life.
          </p>

          <div className="flex flex-col items-center">
            <div className="relative inline-block">
              <input
                type="file"
                accept=".wav"
                id="file-upload"
                onChange={handleFileChange}
                disabled={isLoading}
                className="absolute inset-0 w-full cursor-pointer opacity-0"
              />
              <Button
                disabled={isLoading}
                className="border-stone-300"
                variant="outline"
                size="lg"
              >
                {isLoading ? "Analysing..." : "Choose File"}
              </Button>
            </div>

            {fileName && (
              <Badge
                variant="secondary"
                className="mt-4 bg-stone-200 text-stone-700"
              >
                {fileName}
              </Badge>
            )}
          </div>
        </div>

        {/* 🧩 Add this new component BELOW the file upload section */}
        <SampleInference onSampleResult={setVizData}/>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent>
              <p className="text-red-600">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {vizData && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-stone-900">
                  Top Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vizData.predictions.slice(0, 3).map((pred, i) => (
                    <div key={pred.class} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-md font-medium text-stone-700">
                          {getEmojiForClass(pred.class)}{" "}
                          <span>{pred.class.replaceAll("_", " ")}</span>
                        </div>
                        <Badge variant={i === 0 ? "default" : "secondary"}>
                          {(pred.confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={pred.confidence * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="text-stone-900">
                  <CardTitle className="text-stone-900">
                    Input Spectrogram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FeatureMap
                    data={vizData.input_spectrogram.values}
                    title={`${vizData.input_spectrogram.shape.join(" x ")}`}
                    spectrogram
                  />

                  <div className="mt-5 flex justify-end">
                    <ColorScale width={200} height={16} min={-1} max={1} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-stone-900">
                    Audio Waveform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Waveform
                    data={vizData.waveform.values}
                    title={`${vizData.waveform.duration.toFixed(2)}s * ${vizData.waveform.sample_rate}Hz`}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Feature maps */}
            <Card>
              <CardHeader>
                <CardTitle>Convolutional Layer Outputs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-6">
                  {main.map(([mainName, mainData]) => (
                    <div key={mainName} className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-medium text-stone-700">
                          {mainName}
                        </h4>
                        <FeatureMap
                          data={mainData.values}
                          title={`${mainData.shape.join(" x ")}`}
                        />
                      </div>

                      {internals[mainName] && (
                        <div className="h-80 overflow-y-auto rounded border border-stone-200 bg-stone-50 p-2">
                          <div className="space-y-2">
                            {internals[mainName]
                              .sort(([a], [b]) => a.localeCompare(b))
                              .map(([layerName, layerData]) => (
                                <FeatureMap
                                  key={layerName}
                                  data={layerData.values}
                                  title={layerName.replace(`${mainName}.`, "")}
                                  internal={true}
                                />
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <ColorScale width={200} height={16} min={-1} max={1} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      {/* --- Add this section below all content --- */}
      <section className="w-full mt-32 mb-12">
        <h2 className="text-2xl font-semibold text-center text-stone-800 mb-6">
          👀 See Hearoo in Action - Screenshots of results for Can-Opening.wav
        </h2>

        <div className="flex flex-col items-center space-y-8 px-4">
          {["sample2.PNG", "sample3.PNG"].map(
            (img, idx) => (
              <div
                key={idx}
                className="relative w-full max-w-6xl overflow-hidden rounded-2xl shadow-lg"
              >
                <Image
                  src={`/demo/${img}`}
                  alt={`Demo ${idx + 1}`}
                  width={1600}
                  height={900}
                  className="object-fit w-full h-[60vh] md:h-[70vh] lg:h-[75vh]"
                />
              </div>
            )
          )}
        </div>
      </section>
      <a href="https://mahadsid.github.io/portfolio/" className="text-stone-500 hover:text-stone-800 text-sm transition-colors duration-300" target="_blank">{new Date().getFullYear()} Certified · Created with ❤️ by <span className="font-medium">Muhammad Mahad</span>
          </a>
    </main>
  );
}
