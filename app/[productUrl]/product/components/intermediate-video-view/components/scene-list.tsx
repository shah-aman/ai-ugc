// import Image from "next/image";

import { motion } from "framer-motion";
import { Camera, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AdScene } from "../../storyboard-view/components/ad-scene-list/components/ad-scene-card";

interface SceneListProps {
  scenes: AdScene[];
  currentScene: number;
  onSceneSelect: (sceneIndex: number) => void;
}

export function SceneList({ scenes, currentScene, onSceneSelect }: SceneListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Scene List</h2>
        <span className="text-xs text-muted-foreground">
          {scenes.length} scenes
        </span>
      </div>

      <div className="space-y-2">
        {scenes.map((scene, index) => (
          <motion.button
            key={scene.id}
            className={cn(
              "w-full flex items-start gap-3 p-3 rounded-lg text-left",
              "bg-background/30 border border-sidebar-border",
              "hover:border-fuchsia-500/50 transition-colors",
              currentScene === index && "ring-2 ring-fuchsia-500"
            )}
            onClick={() => onSceneSelect(index)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/50 shrink-0">
              {scene.roll_type === "A-roll" ? (
                <Camera className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Film className="w-4 h-4 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={scene.roll_type === "A-roll" ? "default" : "secondary"} className="text-xs">
                  {scene.roll_type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Scene {index + 1}
                </span>
              </div>
              <p className="text-sm truncate">{scene.content}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
