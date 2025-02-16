import { ConsolidatedResearch } from "@/app/api/research/product/types";

import { useQuery, UseQueryResult } from "@tanstack/react-query";

export type ProductResearch = ConsolidatedResearch;

export type UseProductResearchQueryResult = UseQueryResult<
  ProductResearch,
  Error
>;

export type ProductResearchParams = {
  productDescription: string;
};

export async function fetchProductResearch({
  productDescription,
}: ProductResearchParams): Promise<ProductResearch> {
  const response = await fetch(`/api/research/product`, {
    method: "POST",
    body: JSON.stringify({ productDescription }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useProductResearch(params: ProductResearchParams) {
  const query = useQuery({
    queryKey: ["product-description"],
    queryFn: () => fetchProductResearch(params),
    enabled: false,
  });
  return query;
}
