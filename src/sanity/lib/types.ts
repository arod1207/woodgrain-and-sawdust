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

export interface CutPlan {
  _id: string;
  name: string;
  slug: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime?: string;
  toolsRequired?: string[];
  materialsRequired?: string[];
  featured: boolean;
  images: SanityImage[];
  image?: SanityImage;
  category: Category;
  tiktokUrl?: string;
}

export interface CutPlanCard {
  _id: string;
  name: string;
  slug: string;
  difficulty: string;
  featured?: boolean;
  image?: SanityImage;
  category?: Category;
}

export interface HeroSection {
  brandLabel?: string;
  heading: string;
  headingAccent?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: {
    asset: { _id: string; url: string };
    alt?: string;
  };
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutSection {
  heading: string;
  subheading?: string;
  body: string;
  image?: SanityImage;
  stats?: AboutStat[];
}
