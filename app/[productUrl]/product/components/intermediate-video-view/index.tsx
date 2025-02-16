"use client";

import { useEffect, useState } from "react";

import { Download, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { IntermediateVideoPlayer } from "./components/intermediate-video-player";
import { SceneList } from "./components/scene-list";
import { useProductContext } from "../../contexts/product-context";

export function IntermediateVideoView() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const {
    storyboard: { data },
  } = useProductContext();

  useEffect(() => {
    console.log(data);
  }, [data]);

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
          <Button variant="outline" size="sm" className="text-xs gap-2">
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

      {data === undefined ? (
        <Skeleton className="w-full h-[500px]" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-4 order-2 lg:order-1">
            <SceneList
              // scenes={
              //   data?.script.map((scene, index) => ({
              //     id: index,
              //     roll_type: scene.roll_type,
              //     content: scene.content,
              //     description: scene.description,
              //   })) ?? []
              // }

              scenes={[]}
              currentScene={currentSceneIndex}
              onSceneSelect={setCurrentSceneIndex}
            />
          </div>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <IntermediateVideoPlayer />
          </div>
        </div>
      )}
    </div>
  );
}
