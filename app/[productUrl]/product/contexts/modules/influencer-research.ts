import { useQuery, UseQueryResult } from "@tanstack/react-query";

export type InfluencerResearch = {
  name: string;
  avatar: string;
  followers: string;
  engagement: string;
  socialMedia: {
    [key: string]: string;
  };
  tags: string[];
}[];

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
