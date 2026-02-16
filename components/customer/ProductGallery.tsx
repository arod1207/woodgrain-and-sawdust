"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/src/sanity/lib/image";
import type { SanityImage } from "@/src/sanity/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

  if (!images || images.length === 0) {
    return (
      <Card className="flex aspect-square items-center justify-center border-cream-dark bg-cream-dark text-walnut/30">
        <ImageIcon className="h-24 w-24" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative aspect-square overflow-hidden border-cream-dark bg-cream-dark">
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
      </Card>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <Button
              key={image.asset?._id || index}
              variant="outline"
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-0 p-0 transition-all",
                index === selectedIndex
                  ? "ring-2 ring-amber ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              )}
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
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
