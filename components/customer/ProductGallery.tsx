"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/src/sanity/lib/image";
import type { SanityImage } from "@/src/sanity/lib/types";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: SanityImage[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-cream-dark bg-cream-dark text-walnut/30">
        <ImageIcon className="h-24 w-24" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image — natural aspect ratio, no fill */}
      <div className="overflow-hidden rounded-lg border-2 border-cream-dark bg-cream-dark">
        {selectedImage?.asset && (
          <Image
            src={urlFor(selectedImage).width(1200).auto("format").url()}
            alt={selectedImage.alt || `${productName} - Image ${selectedIndex + 1}`}
            width={selectedImage.asset.metadata?.dimensions?.width ?? 1200}
            height={selectedImage.asset.metadata?.dimensions?.height ?? 900}
            className="block w-full h-auto"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            placeholder={selectedImage.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={selectedImage.asset.metadata?.lqip}
          />
        )}
      </div>

      {/* Thumbnails — cropped to square */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <Button
              key={image.asset?._id || index}
              variant="outline"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "shrink-0 h-20 w-20 overflow-hidden rounded-lg border-0 p-0 transition-all",
                index === selectedIndex
                  ? "ring-2 ring-amber ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={index === selectedIndex ? "true" : undefined}
            >
              {image.asset && (
                <Image
                  src={urlFor(image).width(100).height(100).fit("crop").auto("format").url()}
                  alt={image.alt || `${productName} thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                  sizes="80px"
                />
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
