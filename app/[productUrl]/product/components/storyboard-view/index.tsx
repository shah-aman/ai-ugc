"use client";

import { useEffect } from "react";

import { Download, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AdSceneList } from "./components/ad-scene-list";
import { useProductContext } from "../../contexts/product-context";
import { Skeleton } from "@/components/ui/skeleton";

export type StoryboardViewProps = {
  onNextStep: () => void;
};

export function StoryboardView({ onNextStep }: StoryboardViewProps) {
  const {
    storyboard: { refetch, data },
  } = useProductContext();

  useEffect(() => {
    console.log(data);
    refetch();
  }, [refetch]);

  const handleAddScene = () => {
    console.log("Adding new scene");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-medium">Video Storyboard</h2>
          <p className="text-sm text-muted-foreground">
            Plan your video sequence with A-roll and B-roll segments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/*
            <Button variant="outline" size="sm" className="text-xs gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          */}
          <Button
            size="sm"
            className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-xs gap-2"
            disabled={data === undefined}
            onClick={onNextStep}
          >
            <Play className="w-4 h-4" />
            Generate
          </Button>
        </div>
      </div>

      {data === undefined ? (
        <Skeleton className="w-full h-[500px]" />
      ) : (
        <div className="rounded-lg">
          <AdSceneList
            scenes={data.structured_script!.map((scene, index) => ({
              id: index,
              roll_type: scene.roll_type,
              content: scene.content,
              description: scene.content,
            }))}
            onAddScene={handleAddScene}
          />
        </div>
      )}
    </div>
  );
}
