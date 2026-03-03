import { defineType, defineField, defineArrayMember } from "sanity";
import { InfoOutlineIcon } from "@sanity/icons";

export const aboutSection = defineType({
  name: "aboutSection",
  title: "About Section",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g., "The Story Behind the Sawdust"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "string",
      description: "Short tagline displayed above the heading",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 6,
      description: "Main about text. Use line breaks to separate paragraphs.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Workshop Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
          description: "Describe the image for accessibility",
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      description: "Highlight numbers displayed below the text (e.g. 15+ Years, 500+ Pieces)",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: 'e.g., "15+"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'e.g., "Years of Experience"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: { title: "heading", media: "image" },
  },
});
