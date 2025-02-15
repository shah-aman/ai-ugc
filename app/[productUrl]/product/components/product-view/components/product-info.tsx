"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export type ProductInfoProps = {
  product: {
    name: string;
    description: string;
    price: string;
    rating: number;
    reviews: number;
    category: string;
    tags: string[];
    specs: { label: string; value: string }[];
    features: string[];
    inStock: boolean;
    targetAudiences: {
      name: string;
      description: string;
    }[];
  };
  onAddToCart: () => void;
};

export function ProductInfo({ product, onAddToCart }: ProductInfoProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          {product.inStock ? (
            <Badge variant="default" className="text-xs">In Stock</Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
          )}
        </div>
        <h1 className="text-2xl font-medium">{product.name}</h1>

        {/* Rating and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews.toLocaleString()} reviews)
            </span>
          </div>
          <span className="text-2xl font-semibold text-fuchsia-500">
            {product.price}
          </span>
        </div>
      </div>

      {/* Description and Tags */}
      <div className="space-y-3">
        <p className="text-muted-foreground">{product.description}</p>
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-background/50"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium">Key Features</h2>
        <ul className="grid grid-cols-2 gap-2">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Specifications */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium">Technical Specifications</h2>
        <Table>
          <TableBody>
            {product.specs.map((spec) => (
              <TableRow key={spec.label}>
                <TableCell className="text-muted-foreground font-medium py-2">
                  {spec.label}
                </TableCell>
                <TableCell className="text-right py-2">
                  {spec.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Replace Delivery Info with Target Audiences */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium">Target Audiences</h2>
        <div className="grid gap-3">
          {product.targetAudiences.map((audience, index) => (
            <div
              key={audience.name}
              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-sidebar-border"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-fuchsia-500/10 text-fuchsia-500 shrink-0">
                {index + 1}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{audience.name}</p>
                <p className="text-sm text-muted-foreground">{audience.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={onAddToCart}
        className={cn(
          "w-full bg-fuchsia-500 text-white",
          "hover:bg-fuchsia-600",
          "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
        )}
      >
        Create marketing plan
      </Button>
    </motion.div>
  );
}
