import { motion } from "framer-motion";
import { Clock, Film, Share2, Video, FileVideo, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdDetailsProps = {
  details: {
    title: string;
    duration: string;
    resolution: string;
    format: string;
    description: string;
  };
  onShare: () => void;
};

export function AdDetails({ details, onShare }: AdDetailsProps) {
  return (
    <div className="space-y-6">
      <motion.div
        className="space-y-4 bg-background/30 rounded-lg border border-sidebar-border p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Video Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Duration</span>
            </div>
            <p className="text-sm">{details.duration}</p>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Video className="w-4 h-4" />
              <span className="text-xs font-medium">Resolution</span>
            </div>
            <p className="text-sm">{details.resolution}</p>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileVideo className="w-4 h-4" />
              <span className="text-xs font-medium">Format</span>
            </div>
            <p className="text-sm">{details.format}</p>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Film className="w-4 h-4" />
              <span className="text-xs font-medium">Framerate</span>
            </div>
            <p className="text-sm">60 FPS</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-medium">Description</span>
          </div>
          <p className="text-sm text-muted-foreground">{details.description}</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={onShare}
          className={cn(
            "w-full bg-fuchsia-500 text-white",
            "hover:bg-fuchsia-600",
            "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
          )}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Video
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
        >
          <FileVideo className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}
