"use client";

import { useEffect, useMemo, useState } from "react";

import { Download, Play } from "lucide-react";

import { VideoPlayer } from "@/app/components/video-player";
import { Button } from "@/components/ui/button";

import { AdDetails } from "./components/ad-details";
import { useProductContext } from "../../contexts/product-context";
import { LoadingScreen } from "./components/loading-screen";
import { Skeleton } from "@/components/ui/skeleton";

export function FinalVideoView() {
  const [loading, setLoading] = useState(true);

  const {
    product: { data: productInfo },
    finalVideo: { refetch, data: finalVideoData },
  } = useProductContext();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setLoading(finalVideoData === undefined);
  }, [finalVideoData]);

  const handleShare = () => {
    console.log("Sharing video...");
  };

  const adDetails = useMemo(() => {
    if (finalVideoData === undefined) return undefined;

    return {
      title: `${productInfo?.name} Video Ad`,
      duration: new Date(finalVideoData.video_details.duration * 1000)
        .toISOString()
        .slice(11, 19),
      resolution: `${finalVideoData.video_details.resolution.width} × ${finalVideoData.video_details.resolution.height}`,
      format: finalVideoData.video_details.fileFormat,
      frameRate: finalVideoData.video_details.framerate,
      // description:
      //   "A natural, authentic social media video that demonstrates the product's key benefits through personal experience. The video maintains a casual, friendly tone while effectively communicating the value proposition.",
    };
  }, [productInfo, finalVideoData]);

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

          {/* <div className="flex items-center gap-2"> */}
          {/*   <Button variant="outline" size="sm" className="text-xs gap-2"> */}
          {/*     <Download className="w-4 h-4" /> */}
          {/*     Export */}
          {/*   </Button> */}
          {/*   <Button */}
          {/*     size="sm" */}
          {/*     className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-xs gap-2" */}
          {/*   > */}
          {/*     <Play className="w-4 h-4" /> */}
          {/*     Preview */}
          {/*   </Button> */}
          {/* </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-4 order-2 lg:order-1">
            {adDetails === undefined ? (
              <Skeleton className="w-full h-[200px]" />
            ) : (
              <AdDetails details={adDetails} onShare={handleShare} />
            )}
          </div>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-background/30 rounded-lg border border-sidebar-border overflow-hidden">
              <div style={{ aspectRatio: "9/16" }}>
                {finalVideoData === undefined ? (
                  <Skeleton className="size-full" />
                ) : (
                  <VideoPlayer videoUrl={finalVideoData.video_url} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
