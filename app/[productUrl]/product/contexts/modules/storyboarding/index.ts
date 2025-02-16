import { RequestBody } from "@/app/api/script/generate/route";
import { Database } from "@/supabase/types";

import { useQuery, UseQueryResult } from "@tanstack/react-query";

export type Storyboard = Database["public"]["Tables"]["scripts"]["Row"];

export type UseStoryboardQueryResult = UseQueryResult<Storyboard, Error>;

export type StoryboardParams = RequestBody;

export async function fetchStoryboard({
  customerIntent,
  productResearch,
  influencerResearch,
  productLink,
  influencerId,
}: StoryboardParams): Promise<Storyboard> {
  const response = await fetch(`/api/script/generate`, {
    method: "POST",
    body: JSON.stringify({
      customerIntent,
      productResearch,
      influencerResearch,
      productLink,
      influencerId,
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
