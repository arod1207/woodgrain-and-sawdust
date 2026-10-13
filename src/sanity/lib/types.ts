// TypeScript types for Sanity data
import type { PortableTextBlock } from "@portabletext/react";

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
  materialsRequired?: string[];
  featured: boolean;
  comingSoon?: boolean;
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
  comingSoon?: boolean;
  image?: SanityImage;
  category?: Category;
}

export interface SectionImage {
  asset: {
    _id: string;
    url: string;
    metadata?: { dimensions?: { width: number; height: number } };
  };
  alt?: string;
}

export interface HeroSection {
  brandLabel?: string;
  heading: string;
  headingAccent?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  footnote?: string;
  heroImage?: SectionImage;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesSection {
  features: Feature[];
}

export interface HowItWorksStep {
  title: string;
  description: string;
}

export interface HowItWorksSection {
  label?: string;
  heading: string;
  steps?: HowItWorksStep[];
  ctaText?: string;
  ctaLink?: string;
  image?: SectionImage;
}

export interface FeaturedPlansSection {
  label?: string;
  heading: string;
  description?: string;
  viewAllText?: string;
  viewAllLink?: string;
}

export interface CommunityBuild {
  _id: string;
  builderName: string;
  location?: string;
  caption?: string;
  featured: boolean;
  publishedAt: string;
  images: SanityImage[];
  relatedPlan?: {
    _id: string;
    name: string;
    slug: string;
  };
}

export interface Cross {
  _id: string;
  name: string;
  slug: string;
  description?: PortableTextBlock[];
  price: number;
  shippingRate?: number;
  available: boolean;
  dimensions?: string;
  woodType?: string;
  tiktokUrl?: string;
  images?: SanityImage[];
  imageUrl?: string;
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
