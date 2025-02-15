"use client";

import { VideoPlayer } from "@/app/components/video-player";

import { AdDetails } from "./components/ad-details";

const adDetails = {
  title: "Boost Your Focus: Premium Wireless Headphones",
  duration: "00:30",
  resolution: "1920x1080",
  format: "MP4",
  description:
    "This ad showcases our Premium Wireless Headphones as the ultimate solution for boosting focus and productivity in various work environments. It takes the viewer through a journey from a noisy, stressful workspace to a serene, focused state achieved by using our product.",
};

export default function FinalVideoPage() {
  const handleShare = () => {
    console.log("YEYEYEY");
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Final Video Ad</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VideoPlayer videoUrl="/placeholder.mp4" />
          </div>
          <div>
            <AdDetails details={adDetails} onShare={handleShare} />
          </div>
        </div>
      </div>
    </div>
  );
}
