"use client";

import { useEffect, useState } from "react";

import { Download, Play } from "lucide-react";

import { VideoPlayer } from "@/app/components/video-player";
import { Button } from "@/components/ui/button";

import { AdDetails } from "./components/ad-details";
import { useProductContext } from "../../contexts/product-context";
import { LoadingScreen } from "./components/loading-screen";

const adDetails = {
  title: "Product Showcase Video",
  duration: "00:30",
  resolution: "1920x1080",
  format: "MP4",
  description:
    "A natural, authentic social media video that demonstrates the product's key benefits through personal experience. The video maintains a casual, friendly tone while effectively communicating the value proposition.",
};

export function FinalVideoView() {
  const [loading, setLoading] = useState(true);

  const {
    finalVideo: { refetch, data },
  } = useProductContext();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setLoading(data === undefined);
  }, [data]);

  const handleShare = () => {
    console.log("Sharing video...");
  };

  return (
    <>
      <div className="space-y-6">
        <LoadingScreen loading={loading} setLoading={setLoading} />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-medium">Final Video</h2>
            <p className="text-sm text-muted-foreground">
              Preview and share your finished video
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              size="sm"
              className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-xs gap-2"
            >
              <Play className="w-4 h-4" />
              Preview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-4 order-2 lg:order-1">
            <AdDetails details={adDetails} onShare={handleShare} />
          </div>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-background/30 rounded-lg border border-sidebar-border overflow-hidden">
              <div style={{ aspectRatio: "9/16" }}>
                <VideoPlayer videoUrl="/placeholder.mp4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
