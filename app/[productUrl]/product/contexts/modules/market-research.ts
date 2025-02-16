import { ConsolidatedResearch } from "@/app/api/research/product/types";

import { useQuery, UseQueryResult } from "@tanstack/react-query";

export type MarketResearch = {
  productResearch: ConsolidatedResearch;
  influencers: {
    name: string;
    avatar: string;
    followers: string;
    engagement: string;
    socialMedia: {
      [key: string]: string;
    };
    tags: string[];
  }[];
};

export type UseMarketResearchQueryResult = UseQueryResult<
  MarketResearch,
  Error
>;

export type MarketResearchParams = {
  productDescription: string;
};

export async function fetchProductResearch({
  productDescription,
}: MarketResearchParams): Promise<MarketResearch> {
  const response = await fetch(`/api/research/product`, {
    method: "POST",
    body: JSON.stringify({ productDescription }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const productResearch = await response.json();
  return {
    productResearch,
    influencers: {} as any,
  };
}

export function useMarketResearch(params: MarketResearchParams) {
  const query = useQuery({
    queryKey: ["product-description"],
    queryFn: () => fetchProductResearch(params),
    enabled: false,
  });
  return query;
}
