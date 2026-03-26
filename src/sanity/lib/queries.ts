export const HERO_SECTION_QUERY = `*[_type == "heroSection" && _id == "heroSection"][0] {
  brandNameLine1,
  brandNameConnector,
  brandNameLine2,
  establishedText,
  brandLabel,
  heading,
  headingAccent,
  subheading,
  ctaText,
  ctaLink,
  seoTitle,
  seoDescription,
  backgroundImage {
    asset->{
      _id,
      url
    },
    alt
  }
}`;

export const FEATURES_SECTION_QUERY = `*[_type == "featuresSection" && _id == "featuresSection"][0] {
  features[] {
    icon,
    title,
    description
  }
}`;

export const FEATURED_PLANS_SECTION_QUERY = `*[_type == "featuredPlansSection" && _id == "featuredPlansSection"][0] {
  heading,
  viewAllText,
  viewAllLink,
  emptyStateHeading,
  emptyStateText
}`;

// Cut plan queries

export const CUT_PLANS_QUERY = `*[_type == "cutPlan" && defined(slug.current)] | order(_createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  difficulty,
  featured,
  "image": images[0] {
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions { width, height }
      }
    },
    alt
  },
  category->{
    _id,
    name,
    "slug": slug.current
  }
}`;

export const FEATURED_CUT_PLANS_QUERY = `*[_type == "cutPlan" && featured == true && defined(slug.current)] | order(_createdAt desc) [0...6] {
  _id,
  name,
  "slug": slug.current,
  difficulty,
  "image": images[0] {
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions { width, height }
      }
    },
    alt
  }
}`;

export const CUT_PLAN_QUERY = `*[_type == "cutPlan" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  difficulty,
  estimatedTime,
  toolsRequired,
  materialsRequired,
  featured,
  images[] {
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions { width, height }
      }
    },
    alt,
    hotspot,
    crop
  },
  tiktokUrl,
  category->{
    _id,
    name,
    "slug": slug.current
  }
}`;

// Server-only: fetches the PDF URL for the download API route
export const CUT_PLAN_PDF_QUERY = `*[_type == "cutPlan" && _id == $id][0] {
  _id,
  name,
  "pdfUrl": pdfFile.asset->url,
  "pdfOriginalFilename": pdfFile.asset->originalFilename
}`;

export const CUT_PLAN_SLUGS_QUERY = `*[_type == "cutPlan" && defined(slug.current)]{ "slug": slug.current }`;

export const CATEGORIES_QUERY = `*[_type == "category" && isVisible == true] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description
}`;

export const CUT_PLANS_BY_CATEGORY_QUERY = `*[_type == "cutPlan" && category->slug.current == $category && defined(slug.current)] | order(_createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  difficulty,
  featured,
  "image": images[0] {
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions { width, height }
      }
    },
    alt
  },
  category->{
    _id,
    name,
    "slug": slug.current
  }
}`;

export const ABOUT_SECTION_QUERY = `*[_type == "aboutSection" && _id == "aboutSection"][0] {
  heading,
  subheading,
  body,
  image {
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions { width, height }
      }
    },
    alt,
    hotspot,
    crop
  },
  stats[] { value, label }
}`;
