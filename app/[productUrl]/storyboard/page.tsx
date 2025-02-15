"use client";

import { AdSceneList } from "./components/ad-scene-list";

const adScenes = [
  {
    id: 1,
    image: "https://m.media-amazon.com/images/I/61Ht6pj0JiL._AC_SX695_.jpg",
    script: "Fade in: A bustling city street at dawn, people rushing to work.",
    summary:
      "Sets the scene and creates relatability with the target audience's daily routine.",
  },
  {
    id: 2,
    image: "https://m.media-amazon.com/images/I/61Ht6pj0JiL._AC_SX695_.jpg",
    script:
      "Close-up: A stressed office worker, surrounded by papers and a ticking clock.",
    summary:
      "Highlights the problem of stress and time pressure in modern work environments.",
  },
  {
    id: 3,
    image: "https://m.media-amazon.com/images/I/61Ht6pj0JiL._AC_SX695_.jpg",
    script: "Pan to: The worker puts on our noise-cancelling headphones.",
    summary: "Introduces the product as a solution to the problem.",
  },
  {
    id: 4,
    image: "https://m.media-amazon.com/images/I/61Ht6pj0JiL._AC_SX695_.jpg",
    script:
      "Transition: The noisy office fades away, replaced by a serene, focused workspace.",
    summary:
      "Demonstrates the immediate effect and benefit of using the product.",
  },
  {
    id: 5,
    image: "https://m.media-amazon.com/images/I/61Ht6pj0JiL._AC_SX695_.jpg",
    script:
      "Montage: Various professionals using the headphones in different settings - office, cafe, train.",
    summary:
      "Shows the versatility of the product and its applicability to various situations.",
  },
  {
    id: 6,
    image: "https://m.media-amazon.com/images/I/61Ht6pj0JiL._AC_SX695_.jpg",
    script:
      "Final shot: Smiling professionals, productivity graphs, product close-up. Voiceover: 'Boost your focus, boost your productivity.'",
    summary: "Reinforces the main benefit and presents a clear call-to-action.",
  },
];

export default function VideoAdPage() {
  const handleAddScene = () => {
    console.log("HELLO");
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Video Ad Storyboard</h1>
        <AdSceneList scenes={adScenes} onAddScene={handleAddScene} />
      </div>
    </div>
  );
}
