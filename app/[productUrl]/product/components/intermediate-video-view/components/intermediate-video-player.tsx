"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useProductContext } from "../../../contexts/product-context";

export function IntermediateVideoPlayer() {
  const { intermediateVideo, storyboard } = useProductContext();
  const { videoState, setVideoState, handleSceneChange } = intermediateVideo;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (videoState.isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [videoState.isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoState({ progress });
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const time = (value[0] / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setVideoState({ progress: value[0] });
    }
  };

  const togglePlay = () => setVideoState({ isPlaying: !videoState.isPlaying });
  const toggleMute = () => setVideoState({ isMuted: !videoState.isMuted });

  const goToPreviousScene = () => {
    if (videoState.currentScene > 0) {
      handleSceneChange(videoState.currentScene - 1);
    }
  };

  const goToNextScene = () => {
    if (videoState.currentScene < storyboard.scenes.length - 1) {
      handleSceneChange(videoState.currentScene + 1);
    }
  };

  return (
    <motion.div
      className="relative bg-background/30 rounded-lg border border-sidebar-border overflow-hidden"
      style={{ aspectRatio: '9/16' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        muted={videoState.isMuted}
      />

      {/* Scene Navigation Overlays */}
      <button
        onClick={goToPreviousScene}
        disabled={videoState.currentScene === 0}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2",
          "p-2 rounded-full bg-black/20 backdrop-blur-sm",
          "hover:bg-black/40 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNextScene}
        disabled={videoState.currentScene === storyboard.scenes.length - 1}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2",
          "p-2 rounded-full bg-black/20 backdrop-blur-sm",
          "hover:bg-black/40 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Controls Overlay */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="space-y-4">
            {/* Progress Bar */}
            <Slider
              value={[videoState.progress]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="h-1"
            />

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className={cn(
                    "p-2 rounded-full",
                    "bg-white/10 hover:bg-white/20",
                    "backdrop-blur-sm transition-colors"
                  )}
                >
                  {videoState.isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className={cn(
                    "p-2 rounded-full",
                    "bg-white/10 hover:bg-white/20",
                    "backdrop-blur-sm transition-colors"
                  )}
                >
                  {videoState.isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-white/80">
                  Scene {videoState.currentScene + 1} of {storyboard.scenes.length}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {storyboard.scenes[videoState.currentScene]?.roll_type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
