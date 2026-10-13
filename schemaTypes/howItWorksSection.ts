import { defineType, defineField, defineArrayMember } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons";

export const howItWorksSection = defineType({
  name: "howItWorksSection",
  title: "How It Works Section",
  type: "document",
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'Small uppercase text above the heading. e.g., "How it works"',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g., "From “I wonder if…” to a cut list in minutes"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      description: "Numbered automatically. Recommended: 3 steps.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(6),
    }),
    defineField({
      name: "ctaText",
      title: "Button Text",
      type: "string",
      description: 'e.g., "Try the Designer"',
    }),
    defineField({
      name: "ctaLink",
      title: "Button Link",
      type: "string",
      description: 'e.g., "https://designer.woodgrainandsawdust.com/new"',
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Shown beside the steps. Falls back to the built-in cut list screenshot.",
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", media: "image" },
  },
});
