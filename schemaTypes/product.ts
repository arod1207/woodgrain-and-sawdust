import { defineType, defineField, defineArrayMember } from "sanity";
import { PackageIcon } from "@sanity/icons";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g., "Walnut Coffee Table"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly name",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Detailed description of the product",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: "Selling price in USD",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "cost",
      title: "Cost",
      type: "number",
      description: "Material + labor cost (admin only)",
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative Text",
              type: "string",
              description: "Important for SEO and accessibility",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).error("Add at least one image"),
    }),
    defineField({
      name: "woodType",
      title: "Wood Type",
      type: "string",
      description: 'e.g., "Walnut", "Oak", "Maple"',
      options: {
        list: [
          { title: "Walnut", value: "walnut" },
          { title: "Oak", value: "oak" },
          { title: "Maple", value: "maple" },
          { title: "Cherry", value: "cherry" },
          { title: "Pine", value: "pine" },
          { title: "Cedar", value: "cedar" },
          { title: "Mahogany", value: "mahogany" },
          { title: "Ash", value: "ash" },
          { title: "Mixed", value: "mixed" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "object",
      fields: [
        defineField({
          name: "length",
          title: "Length",
          type: "number",
          validation: (rule) => rule.positive(),
        }),
        defineField({
          name: "width",
          title: "Width",
          type: "number",
          validation: (rule) => rule.positive(),
        }),
        defineField({
          name: "height",
          title: "Height",
          type: "number",
          validation: (rule) => rule.positive(),
        }),
        defineField({
          name: "unit",
          title: "Unit",
          type: "string",
          options: {
            list: [
              { title: "Inches", value: "inches" },
              { title: "Centimeters", value: "cm" },
            ],
            layout: "radio",
          },
          initialValue: "inches",
        }),
      ],
    }),
    defineField({
      name: "finish",
      title: "Finish",
      type: "string",
      description: 'e.g., "Oil finish", "Polyurethane"',
      options: {
        list: [
          { title: "Natural Oil", value: "natural-oil" },
          { title: "Polyurethane", value: "polyurethane" },
          { title: "Lacquer", value: "lacquer" },
          { title: "Wax", value: "wax" },
          { title: "Unfinished", value: "unfinished" },
        ],
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on homepage",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0",
      price: "price",
      woodType: "woodType",
    },
    prepare({ title, media, price, woodType }) {
      return {
        title,
        subtitle: `$${price} • ${woodType}`,
        media,
      };
    },
  },
});
