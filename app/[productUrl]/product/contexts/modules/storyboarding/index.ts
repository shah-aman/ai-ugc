import { ExtractStructuredScriptSchema } from "@/app/api/script/generate/schemas";

import { useQuery, UseQueryResult } from "@tanstack/react-query";

export type Storyboard = ExtractStructuredScriptSchema;

export type UseStoryboardQueryResult = UseQueryResult<Storyboard, Error>;

export type StoryboardParams = {
  customerIntent: string;
  productResearch: string;
  influencerResearch: string;
};

export async function fetchStoryboard({
  customerIntent,
  productResearch,
  influencerResearch,
}: StoryboardParams): Promise<Storyboard> {
  const response = await fetch(`/api/script/generate`, {
    method: "POST",
    body: JSON.stringify({
      customerIntent,
      productResearch,
      influencerResearch,
    }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useStoryboard(params: StoryboardParams) {
  const query = useQuery({
    queryKey: ["storyboard"],
    queryFn: () => fetchStoryboard(params),
    enabled: false,
  });
  return query;
}
