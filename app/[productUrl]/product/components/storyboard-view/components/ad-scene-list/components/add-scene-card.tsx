import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export type AddSceneCardProps = { onAddScene: () => void };

export function AddSceneCard({ onAddScene }: AddSceneCardProps) {
  return (
    <motion.button
      className="w-full bg-background/30 rounded-lg border border-dashed border-sidebar-border p-6 hover:border-fuchsia-500/50 hover:bg-background/50 transition-colors"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onAddScene}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
          <Plus className="w-4 h-4" />
        </div>
        <span className="text-sm">Add New Scene</span>
      </div>
    </motion.button>
  );
}
