"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/src/sanity/lib/image";
import type { SanityImage } from "@/src/sanity/lib/types";

interface ProductGalleryProps {
  images: SanityImage[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedIndex(index);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-cream-dark text-walnut/30">
        <svg
          className="h-24 w-24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-dark">
        {selectedImage?.asset && (
          <Image
            src={urlFor(selectedImage).width(800).height(800).url()}
            alt={selectedImage.alt || `${productName} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            placeholder={selectedImage.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={selectedImage.asset.metadata?.lqip}
          />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.asset?._id || index}
              onClick={() => handleThumbnailClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                index === selectedIndex
                  ? "ring-2 ring-amber ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              tabIndex={0}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={index === selectedIndex ? "true" : undefined}
            >
              {image.asset && (
                <Image
                  src={urlFor(image).width(100).height(100).url()}
                  alt={image.alt || `${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
