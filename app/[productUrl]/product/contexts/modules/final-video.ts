import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { RequestBody } from "@/app/api/ad/generate/route";

export type FinalVideo = {
  success: true;
  video_url: string;
  video_details: {
    duration: number; // in Seconds
    fileFormat: string;
    framerate: number;
    resolution: {
      width: number;
      height: number;
    };
  };
};

export type UseFinalVideoQueryResult = UseQueryResult<FinalVideo, Error>;

export type FinalVideoParams = RequestBody;

export async function fetchFinalVideo(
  params: FinalVideoParams,
): Promise<FinalVideo> {
  // TODO: Add the use of params
  const response = await fetch(`/api/ad/generate`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useFinalVideo(params: FinalVideoParams) {
  const query = useQuery({
    queryKey: ["final-video"],
    queryFn: () => fetchFinalVideo(params),
    enabled: false,
  });
  return query;
}
