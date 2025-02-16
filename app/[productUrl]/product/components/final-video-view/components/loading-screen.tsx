"use client";

import React from "react";

import { IconSquareRoundedX } from "@tabler/icons-react";

import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

const LOADING_STATES = [
  {
    text: "Idenfitying the target audience",
  },
  {
    text: "Polishing the script",
  },
  {
    text: "Optmizing the perfect voice",
  },
  {
    text: "Generating A-roll footages",
  },
  {
    text: "Generating product B-roll footage",
  },
  {
    text: "Generating general B-roll footage",
  },
  {
    text: "Merging clips",
  },
  {
    text: "Adding captions to the video",
  },
  {
    text: "Adding background music",
  },
  {
    text: "Exporting",
  },
];

export type LoadingScreenProps = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export function LoadingScreen({ loading, setLoading }: LoadingScreenProps) {
  return (
    <>
      {/* Core Loader Modal */}
      <Loader
        loadingStates={LOADING_STATES}
        loading={loading}
        duration={(5 * 60 * 1000) / LOADING_STATES.length}
        loop={false}
      />

      {loading && (
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120]"
          onClick={() => setLoading(false)}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}
    </>
  );
  return (
    <div className="w-full h-[60vh] flex items-center justify-center"></div>
  );
}
