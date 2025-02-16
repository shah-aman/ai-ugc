import { useQuery, UseQueryResult } from "@tanstack/react-query";

export type FinalVideo = {
  details: {
    title: string;
    duration: string;
    resolution: string;
    format: string;
    description: string;
  };
};

export type UseFinalVideoQueryResult = UseQueryResult<FinalVideo, Error>;

export type FinalVideoParams = {
  avatarId: string;
  voiceId: string;
  script: string;
};

export async function fetchFinalVideo(
  _params: FinalVideoParams,
): Promise<FinalVideo> {
  // TODO: Add the use of params
  const response = await fetch(`/api/heygen/create`, {
    method: "POST",
    body: JSON.stringify({
      avatarId: "113eece852cd4d0eb70cfdfa612dd04b",
      voiceId: "26b2064088674c80b1e5fc5ab1a068eb",
      script:
        "Hey guys, I recently discovered this amazing fitness app, and I can't believe how much it has changed my workouts! It's called FitBuddy, and it has personalized workout plans that really fit my schedule. Before using it, I struggled to stay consistent and felt so lost with my routines. Now, I have fun challenges and can track my progress easily, which keeps me motivated! If you're looking for something to supercharge your fitness journey, you need to check it out!",
    }),
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
