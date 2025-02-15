// import Image from "next/image";

import { motion } from "framer-motion";
import { Share2 } from "lucide-react";

interface Scene {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
}

interface SceneListProps {
  scenes: Scene[];
  currentScene: number;
  onSceneSelect: (sceneIndex: number) => void;
  onExport: () => void;
}

export function SceneList({
  scenes,
  currentScene,
  onSceneSelect,
  onExport,
}: SceneListProps) {
  return (
    <motion.div
      className="bg-[#1c1c1f] p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-4">Scenes</h2>
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
        {scenes.map((scene, index) => (
          <motion.div
            key={scene.id}
            className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer ${
              index === currentScene ? "bg-[#2c2c2f]" : "hover:bg-[#2c2c2f]"
            }`}
            onClick={() => onSceneSelect(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative w-20 h-12 rounded overflow-hidden">
              <img
                src={scene.thumbnail || "/placeholder.svg"}
                alt={scene.title}
                // layout="fill"
                // objectFit="cover"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{scene.title}</h3>
              <p className="text-sm text-gray-400">{scene.duration}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <button
        onClick={onExport}
        className="w-full h-12 bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] rounded-[99px] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16),0px_1px_2px_0px_rgba(0,0,0,0.20)] justify-center items-center inline-flex overflow-hidden cursor-pointer hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] transition-all duration-200"
      >
        <Share2 className="w-5 h-5 mr-2" />
        <span className="text-white text-[15px] font-medium">
          Export Intermediate Video
        </span>
      </button>
    </motion.div>
  );
}
