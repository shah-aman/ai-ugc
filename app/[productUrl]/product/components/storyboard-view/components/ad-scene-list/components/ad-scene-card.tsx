import { motion } from "framer-motion";
import { Camera, Film, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AdScene {
  id: number;
  roll_type: "A-roll" | "B-roll";
  content: string;
  description: string;
}

export function AdSceneCard({
  scene,
  index,
}: {
  scene: AdScene;
  index: number;
}) {
  return (
    <motion.div
      className="bg-background/30 rounded-lg border border-sidebar-border overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 relative">
          <div className="relative aspect-video bg-black/20">
            <div className="absolute inset-0 flex items-center justify-center">
              {scene.roll_type === "A-roll" ? (
                <Camera className="w-8 h-8 text-muted-foreground/50" />
              ) : (
                <Film className="w-8 h-8 text-muted-foreground/50" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <Badge variant={scene.roll_type === "A-roll" ? "default" : "secondary"} className="text-xs">
                {scene.roll_type}
              </Badge>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <h3 className="text-sm font-medium">Script</h3>
            </div>
            <p className="text-sm">{scene.content}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              {scene.roll_type === "A-roll" ? (
                <Camera className="w-4 h-4" />
              ) : (
                <Film className="w-4 h-4" />
              )}
              <h3 className="text-sm font-medium">Direction</h3>
            </div>
            <p className="text-sm text-muted-foreground">{scene.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
