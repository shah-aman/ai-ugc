import { motion } from "framer-motion";

export interface AdScene {
  id: number;
  image: string;
  script: string;
  summary: string;
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
      className="bg-[#1c1c1f] p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={scene.image || "/placeholder.svg"}
              alt={`Scene ${scene.id}`}
              // layout="fill"
              // objectFit="cover"
              className="object-cover size-full"
            />
          </div>
        </div>
        <div className="w-full md:w-2/3 space-y-4">
          <h2 className="text-xl font-semibold">Scene {scene.id}</h2>
          <div>
            <h3 className="text-lg font-medium mb-2">Script:</h3>
            <p className="text-gray-300">{scene.script}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Summary:</h3>
            <p className="text-gray-300">{scene.summary}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
