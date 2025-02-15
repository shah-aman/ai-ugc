import { ProductGallery } from "./components/product-gallery";
import { ProductInfo } from "./components/product-info";
import { useProductContext } from "../../contexts/product-context";

const productImages = [
  "https://m.media-amazon.com/images/I/61Ht6pj0JiL._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/51odl4a-jPL._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/61Lf1nNOm1L._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/61QpbJRCCXL._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/5139oFF5RUL._AC_SX695_.jpg",
];

const productData = {
  name: "New Balance Men's 608 V5 Casual Comfort Cross Trainer",
  description: "Leather upper. ABZORB midsole cushioning aids in absorbing forceful impacts. Premium PU comfort insert",
  price: "$74.99",
  rating: 4.5,
  reviews: 12890,
  category: "Athletic & Running",
  tags: ["Cross Training", "Comfort Fit", "Leather", "Athletic"],
  specs: [
    { label: "Fabric type", value: "100% Leather" },
    { label: "Care instructions", value: "Machine Wash" },
    { label: "Origin", value: "Imported" },
    { label: "Sole material", value: "Rubber" },
  ],
  features: [
    "ABZORB Cushioning",
    "Dual-density collar foam",
    "Flexible outsole",
    "Premium PU comfort insert"
  ],
  inStock: true,
  targetAudiences: [
    {
      name: "Active Adults",
      description: "Fitness enthusiasts aged 25-45 seeking comfortable training shoes"
    },
    {
      name: "Casual Athletes",
      description: "Weekend warriors who need versatile athletic footwear"
    },
    {
      name: "Comfort Seekers",
      description: "Individuals prioritizing all-day comfort in their footwear"
    }
  ],
};

export function ProductView() {
  const context = useProductContext();

  const handleAddToCart = () => console.log(context);

  return (
    <div className="grid grid-cols-5 gap-8 bg-background/30 rounded-lg border-none">
      <div className="col-span-2">
        <ProductGallery images={productImages} />
      </div>
      <div className="col-span-3">
        <ProductInfo
          product={productData}
        onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
