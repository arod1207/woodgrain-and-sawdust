// Product queries

export const PRODUCTS_QUERY = `*[_type == "product" && defined(slug.current)] | order(_createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  price,
  woodType,
  inStock,
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

export const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && featured == true && defined(slug.current)] | order(_createdAt desc) [0...6] {
  _id,
  name,
  "slug": slug.current,
  price,
  woodType,
  inStock,
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

export const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  price,
  woodType,
  finish,
  inStock,
  featured,
  dimensions {
    length,
    width,
    height,
    unit
  },
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
  category->{
    _id,
    name,
    "slug": slug.current
  }
}`;

export const PRODUCT_SLUGS_QUERY = `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`;

export const CATEGORIES_QUERY = `*[_type == "category"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description
}`;

export const PRODUCTS_BY_IDS_QUERY = `*[_type == "product" && _id in $ids] {
  _id,
  name,
  price,
  inStock,
  "image": images[0].asset->url
}`;

export const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && category->slug.current == $category && defined(slug.current)] | order(_createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  price,
  woodType,
  inStock,
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
