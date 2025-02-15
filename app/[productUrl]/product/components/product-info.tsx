"use client";

import { motion } from "framer-motion";

export type ProductInfoProps = {
  product: {
    name: string;
    description: string;
    specs: { label: string; value: string }[];
  };
  onAddToCart: () => void;
};

export function ProductInfo({ product, onAddToCart }: ProductInfoProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-gray-400">{product.description}</p>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Technical Specifications</h2>
        <ul className="space-y-2">
          {product.specs.map((spec, index) => (
            <li key={index} className="flex justify-between">
              <span className="text-gray-400">{spec.label}</span>
              <span>{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onAddToCart}
        className="w-full h-12 bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] rounded-[99px] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16),0px_1px_2px_0px_rgba(0,0,0,0.20)] justify-center items-center inline-flex overflow-hidden cursor-pointer hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] transition-all duration-200"
      >
        <span className="text-white text-[15px] font-medium">Add to Cart</span>
      </button>
    </motion.div>
  );
}
