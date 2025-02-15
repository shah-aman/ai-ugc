"use client";

import { useState } from "react";
import { IntermediateVideoPlayer } from "./components/intermediate-video-player";
import { SceneList } from "./components/scene-list";
import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";
import { AdScene } from "../storyboard-view/components/ad-scene-list/components/ad-scene-card";

const scenes: AdScene[] = [
  {
    id: 1,
    roll_type: "A-roll",
    content: "Okay I have to share this because",
    description: "Excited, leaning into camera with wide eyes and genuine enthusiasm, speaking in a conspiratorial tone like sharing a secret with friends",
  },
  {
    id: 2,
    roll_type: "B-roll",
    content: "it literally changed my skincare game. I was so over trying expensive moisturizers that did nothing.",
    description: "Close-up of the product being gently applied, showing its texture. Soft, natural lighting highlights the product's consistency and the clean, minimal packaging",
  },
  {
    id: 3,
    roll_type: "A-roll",
    content: "But this one? My skin is actually glowing now and it's not even expensive.",
    description: "Confident and proud expression, gesturing to face to show natural glow, genuine smile with slightly raised eyebrows",
  },
  {
    id: 4,
    roll_type: "A-roll",
    content: "You guys need to check this out!",
    description: "Enthusiastic call-to-action, friendly and encouraging expression, slight forward lean to emphasize importance",
  }
];

export function IntermediateVideoView() {
  const [currentScene, setCurrentScene] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-medium">Raw Video Preview</h2>
          <p className="text-sm text-muted-foreground">
            Review and edit your video segments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-2"
          >
            <Download className="w-4 h-4" />
            Export Raw
          </Button>
          <Button
            size="sm"
            className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-xs gap-2"
          >
            <Play className="w-4 h-4" />
            Preview All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-4 order-2 lg:order-1">
          <SceneList
            scenes={scenes}
            currentScene={currentScene}
            onSceneSelect={setCurrentScene}
          />
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2">
          <IntermediateVideoPlayer />
        </div>
      </div>
    </div>
  );
}
