// TypeScript types for Sanity data

export interface SanityImage {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: "inches" | "cm";
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  cost?: number;
  woodType: string;
  finish?: string;
  inStock: boolean;
  featured: boolean;
  dimensions?: ProductDimensions;
  images: SanityImage[];
  image?: SanityImage;
  category: Category;
}

export interface ProductCard {
  _id: string;
  name: string;
  slug: string;
  price: number;
  woodType: string;
  inStock: boolean;
  featured?: boolean;
  image?: SanityImage;
  category?: Category;
}
