"use client";

import { ProductGallery } from "./components/product-gallery";
import { ProductInfo } from "./components/product-info";

const productImages = [
  "https://m.media-amazon.com/images/I/61Ht6pj0JiL._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/51odl4a-jPL._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/61Lf1nNOm1L._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/61QpbJRCCXL._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/5139oFF5RUL._AC_SX695_.jpg",
];

const productData = {
  name: "New Balance Men's 608 V5 Casual Comfort Cross Trainer",
  description:
    "Leather upper. ABZORB midsole cushioning aids in absorbing forceful impacts. Premium PU comfort insert",
  specs: [
    { label: "Fabric type", value: "100% Leather" },
    { label: "Care instructions", value: "Machine Wash" },
    { label: "Origin", value: "Imported" },
    { label: "Sole material", value: "Rubber" },
  ],
};

export default function ProductPage() {
  const handleAddToCart = () => console.log("HELLOOO");

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <ProductGallery images={productImages} />
          </div>
          <div className="w-full md:w-1/2">
            <ProductInfo product={productData} onAddToCart={handleAddToCart} />
          </div>
        </div>
      </div>
    </div>
  );
}
