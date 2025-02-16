import { useEffect } from "react";

import { ProductGallery } from "./components/product-gallery";
import { ProductInfo } from "./components/product-info";
import { useProductContext } from "../../contexts/product-context";

export type ProductViewProps = {
  onNextStep: () => void;
};

export function ProductView({ onNextStep }: ProductViewProps) {
  const {
    product: { refetch, data },
  } = useProductContext();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="grid grid-cols-5 gap-8 bg-background/30 rounded-lg border-none">
      <div className="col-span-2">
        <ProductGallery images={data?.top3ImageUrls} />
      </div>
      <div className="col-span-3">
        <ProductInfo product={data} onNextStep={onNextStep} />
      </div>
    </div>
  );
}
