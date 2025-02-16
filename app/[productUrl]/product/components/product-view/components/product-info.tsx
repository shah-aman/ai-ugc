"use client";

import React from "react";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ProductInfo as ProductInfoResponse } from "@/app/[productUrl]/product/contexts/modules/product-info";
import { Skeleton } from "@/components/ui/skeleton";

export type ProductInfoProps = {
  product?: ProductInfoResponse;
  onNextStep: () => void;
};

export function ProductInfo({ product, onNextStep }: ProductInfoProps) {
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
          {product === undefined ? (
            <Skeleton className="w-20 h-8" />
          ) : (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}
          {product === undefined ? (
            <Skeleton className="w-20 h-8" />
          ) : (
            product.inStock !== undefined &&
            (product.inStock ? (
              <Badge variant="default" className="text-xs">
                In Stock
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            ))
          )}
        </div>

        {product === undefined ? (
          <Skeleton className="h-8" />
        ) : (
          <h1 className="text-2xl font-medium">
            {product.brand} {product.name}
          </h1>
        )}

        {/* Rating and Price */}
        {product === undefined ? (
          <Skeleton className="h-20" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating?.score ?? 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating?.count.toLocaleString() ?? 0} reviews)
              </span>
            </div>
            <span className="text-2xl font-semibold text-fuchsia-500">
              {product.price}
            </span>
          </div>
        )}
      </div>

      {/* Description and Tags */}
      {product === undefined ? (
        <Skeleton className="h-20" />
      ) : (
        <div className="space-y-3">
          <p className="text-muted-foreground">{product.description}</p>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-background/50">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {product === undefined ? (
        <Skeleton className="h-[200px]" />
      ) : (
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
      )}

      {/* Specifications */}
      {product === undefined ? (
        <Skeleton className="h-[300px]" />
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-medium">Technical Specifications</h2>
          <Table>
            <TableBody>
              {Object.entries(product.specifications).map(([label, value]) => (
                <TableRow key={label}>
                  <TableCell className="text-muted-foreground font-medium py-2">
                    {label}
                  </TableCell>
                  <TableCell className="text-right py-2">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Replace Delivery Info with Target Audiences */}
      {/* TODO: Move this to the next screen */}
      {/* <div className="space-y-3"> */}
      {/*   <h2 className="text-sm font-medium">Target Audiences</h2> */}
      {/*   <div className="grid gap-3"> */}
      {/*     {product.targetAudiences.map((audience, index) => ( */}
      {/*       <div */}
      {/*         key={audience.name} */}
      {/*         className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-sidebar-border" */}
      {/*       > */}
      {/*         <div className="flex items-center justify-center w-8 h-8 rounded-full bg-fuchsia-500/10 text-fuchsia-500 shrink-0"> */}
      {/*           {index + 1} */}
      {/*         </div> */}
      {/*         <div className="space-y-1"> */}
      {/*           <p className="text-sm font-medium">{audience.name}</p> */}
      {/*           <p className="text-sm text-muted-foreground"> */}
      {/*             {audience.description} */}
      {/*           </p> */}
      {/*         </div> */}
      {/*       </div> */}
      {/*     ))} */}
      {/*   </div> */}
      {/* </div> */}

      {/* Action Button */}
      <Button
        onClick={onNextStep}
        className={cn(
          "w-full bg-fuchsia-500 text-white",
          "hover:bg-fuchsia-600",
          "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
        )}
        disabled={product === undefined}
      >
        Create marketing plan
      </Button>
    </motion.div>
  );
}
