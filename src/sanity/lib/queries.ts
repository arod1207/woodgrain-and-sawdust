export const HERO_SECTION_QUERY = `*[_type == "heroSection" && _id == "heroSection"][0] {
  brandLabel,
  heading,
  headingAccent,
  subheading,
  ctaText,
  ctaLink,
  backgroundImage {
    asset->{
      _id,
      url
    },
    alt
  }
}`;

// Cut plan queries

export const CUT_PLANS_QUERY = `*[_type == "cutPlan" && defined(slug.current)] | order(_createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  price,
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
  price,
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
  price,
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
  price,
  "pdfUrl": pdfFile.asset->url,
  "pdfOriginalFilename": pdfFile.asset->originalFilename
}`;

export const CUT_PLAN_SLUGS_QUERY = `*[_type == "cutPlan" && defined(slug.current)]{ "slug": slug.current }`;

export const CATEGORIES_QUERY = `*[_type == "category"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description
}`;

export const CUT_PLANS_BY_CATEGORY_QUERY = `*[_type == "cutPlan" && category->slug.current == $category && defined(slug.current)] | order(_createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  price,
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

// Used by checkout API to verify price server-side
export const CUT_PLAN_BY_ID_QUERY = `*[_type == "cutPlan" && _id == $id][0] {
  _id,
  name,
  "slug": slug.current,
  price,
  "image": images[0].asset->url
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
