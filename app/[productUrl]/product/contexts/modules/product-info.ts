import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { ProductInfo as ProductInfoResponse } from "@/app/api/product-info/schema";

export type ProductInfo = ProductInfoResponse;

export type UseProductInfoQueryResult = UseQueryResult<ProductInfo, Error>;

export type ProductInfoParams = {
  productUrl: string;
};

export async function fetchProductInfo({
  productUrl,
}: ProductInfoParams): Promise<ProductInfo> {
  const response = await fetch(`/api/product-info`, {
    method: "POST",
    body: JSON.stringify({ url: productUrl }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useProductInfo(params: ProductInfoParams) {
  const query = useQuery({
    queryKey: ["product-info"],
    queryFn: () => fetchProductInfo(params),
    enabled: false,
  });
  return query;
}
