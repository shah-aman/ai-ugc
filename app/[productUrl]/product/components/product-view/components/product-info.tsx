"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/ui/description-list";
import { Skeleton } from "@/components/ui/skeleton";
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
      {product.name === undefined ? (
        <Skeleton className="h-18 w-full rounded-xl" />
      ) : (
        <h1 className="text-3xl font-bold">{product.name}</h1>
      )}
      {product.description === undefined ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : (
        <p>{product.description}</p>
      )}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Technical Specifications</h2>
        {product.specs === undefined ? (
          Array(4).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full rounded-xl" />
          ))
        ) : (
          <DescriptionList>
            {product.specs.map((spec, index) => (
              <React.Fragment key={index}>
                <DescriptionTerm>{spec.label}</DescriptionTerm>
                <DescriptionDetails>{spec.value}</DescriptionDetails>
              </React.Fragment>
            ))}
          </DescriptionList>
        )}
        <ul className="space-y-2"></ul>
      </div>
      <Button className="w-full" onClick={onAddToCart}>
        <span className="text-white text-[15px] font-medium">
          Create marketing plan
        </span>
      </Button>
      {/* <button */}
      {/*   onClick={onAddToCart} */}
      {/*   className="w-full h-12 bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] rounded-[99px] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16),0px_1px_2px_0px_rgba(0,0,0,0.20)] justify-center items-center inline-flex overflow-hidden cursor-pointer hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] transition-all duration-200" */}
      {/* > */}
      {/* </button> */}
    </motion.div>
  );
}
