import { defineField, defineType } from "sanity";

export const communityBuild = defineType({
  name: "communityBuild",
  title: "Sawdust Stories",
  type: "document",
  fields: [
    defineField({
      name: "builderName",
      title: "Builder Name",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City, state, or country (optional)",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 3,
      description: "A short note about the build (optional)",
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt text",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "relatedPlan",
      title: "Related Plan",
      type: "reference",
      to: [{ type: "cutPlan" }],
      description: "Which plan did they build? (optional)",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show this build prominently on the gallery page",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "builderName",
      subtitle: "caption",
      media: "images.0",
    },
  },
  orderings: [
    {
      title: "Newest First",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
