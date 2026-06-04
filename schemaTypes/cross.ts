import { defineField, defineType, defineArrayMember } from "sanity";

export const cross = defineType({
  name: "cross",
  title: "Shop — Custom Crosses",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Cross Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Underline", value: "underline" },
              { title: "Italic", value: "em" },
            ],
          },
          lists: [],
        }),
      ],
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "shippingRate",
      title: "Shipping Rate (USD)",
      type: "number",
      description:
        "Flat rate shipping cost. Set to 0 to offer local pickup only.",
      validation: (Rule) => Rule.min(0).error("Shipping rate cannot be negative"),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt Text" }),
          ],
        },
      ],
    }),
    defineField({
      name: "available",
      title: "Available for Purchase",
      type: "boolean",
      initialValue: true,
      description: "Uncheck once sold to hide the buy button.",
    }),
    defineField({
      name: "dimensions",
      title: 'Dimensions (e.g. 12" × 8")',
      type: "string",
    }),
    defineField({
      name: "woodType",
      title: "Wood Type",
      type: "string",
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok Build Video URL",
      type: "url",
      description: "Link to the TikTok video of this cross being built.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "images.0" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle != null ? `$${subtitle}` : "No price set",
        media,
      };
    },
  },
});
