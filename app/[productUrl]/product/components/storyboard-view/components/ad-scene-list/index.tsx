import { AdScene, AdSceneCard } from "./components/ad-scene-card";
import { AddSceneCard } from "./components/add-scene-card";

interface AdSceneListProps {
  scenes: AdScene[];
  onAddScene: () => void;
}

export function AdSceneList({ scenes, onAddScene }: AdSceneListProps) {
  return (
    <div className="space-y-8">
      {scenes.map((scene, index) => (
        <AdSceneCard key={scene.id} scene={scene} index={index} />
      ))}
      {/* <AddSceneCard onAddScene={onAddScene} /> */}
    </div>
  );
}
