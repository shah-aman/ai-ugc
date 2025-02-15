"use client";

import { useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";

export type ProductGalleryProps = {
  images: string[];
};

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <motion.div
        className="relative aspect-square rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={images[selectedImage] || "/placeholder.svg"}
          alt={`Product image ${selectedImage + 1}`}
          // fill
          className="object-cover size-full"
        />
      </motion.div>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative w-20 h-20 rounded-md overflow-hidden ${
              index === selectedImage ? "ring-2 ring-[#7c5aff]" : ""
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              // fill
              className="object-cover size-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
