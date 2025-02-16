import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { Database } from "@/supabase/types";

export type InfluencerResearch =
  Database["public"]["Tables"]["influencers"]["Row"][];

export type UseInfluencerResearchQueryResult = UseQueryResult<
  InfluencerResearch,
  Error
>;

export type InfluencerResearchParams = {
  productDescription: string;
};

export async function fetchProductResearch(): Promise<InfluencerResearch> {
  const response = await fetch(`/api/research/influencers`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useInfluencerResearch() {
  const query = useQuery({
    queryKey: ["influencer-description"],
    queryFn: () => fetchProductResearch(),
    enabled: true,
  });
  return query;
}
