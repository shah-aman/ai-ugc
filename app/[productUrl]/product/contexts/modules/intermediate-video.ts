import { useQuery, UseQueryResult } from "@tanstack/react-query";

export type VideoState = {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  currentScene: number;
};

export type IntermediateVideo = {
  videoState: VideoState;
  setVideoState: (updates: Partial<VideoState>) => void;
  handleSceneChange: (sceneIndex: number) => void;
};

export type UseIntermediateVideoQueryResult = UseQueryResult<
  IntermediateVideo,
  Error
>;

export type IntermediateVideoParams = {
  avatarId: string;
  voiceId: string;
  script: string;
};

export async function fetchIntermediateVideo(
  params: IntermediateVideoParams,
): Promise<IntermediateVideo> {
  // TODO: Add the use of params
  const response = await fetch(`/api/heygen/create`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useIntermediateVideo(params: IntermediateVideoParams) {
  const query = useQuery({
    queryKey: ["intermediate-video"],
    queryFn: () => fetchIntermediateVideo(params),
    enabled: false,
  });
  return query;
}
