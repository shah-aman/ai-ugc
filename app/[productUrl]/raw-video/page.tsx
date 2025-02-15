"use client";

import { useState } from "react";

import { IntermediateVideoPlayer } from "./components/intermediate-video-player";
import { SceneList } from "./components/scene-list";

const scenes = [
  {
    id: 1,
    title: "City Street at Dawn",
    duration: "0:05",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Stressed Office Worker",
    duration: "0:04",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Putting on Headphones",
    duration: "0:03",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Transition to Serene Workspace",
    duration: "0:06",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Various Professionals Using Headphones",
    duration: "0:08",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Final Shot with Call-to-Action",
    duration: "0:04",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
];

export default function IntermediateVideoPage() {
  const [currentScene, setCurrentScene] = useState(0);

  const handleExport = () => {
    console.log("HEHEHHE");
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Intermediate Video Preview</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <IntermediateVideoPlayer
              scenes={scenes}
              currentScene={currentScene}
              onSceneChange={setCurrentScene}
            />
          </div>
          <div>
            <SceneList
              scenes={scenes}
              currentScene={currentScene}
              onSceneSelect={setCurrentScene}
              onExport={handleExport}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
