"use client";

import { useState, useRef, useEffect } from "react";

import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface Scene {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
}

interface IntermediateVideoPlayerProps {
  scenes: Scene[];
  currentScene: number;
  onSceneChange: (sceneIndex: number) => void;
}

export function IntermediateVideoPlayer({
  scenes,
  currentScene,
  onSceneChange,
}: IntermediateVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = scenes[currentScene].thumbnail;
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [currentScene, scenes, isPlaying]); // Added isPlaying to dependencies

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const goToPreviousScene = () => {
    if (currentScene > 0) {
      onSceneChange(currentScene - 1);
    }
  };

  const goToNextScene = () => {
    if (currentScene < scenes.length - 1) {
      onSceneChange(currentScene + 1);
    }
  };

  return (
    <motion.div
      className="relative aspect-video bg-black rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={scenes[currentScene].thumbnail}
        onClick={togglePlay}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousScene}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Previous Scene"
              disabled={currentScene === 0}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={goToNextScene}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Next Scene"
              disabled={currentScene === scenes.length - 1}
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={restartVideo}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Restart"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white/80">
              Scene {currentScene + 1} of {scenes.length}
            </span>
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
