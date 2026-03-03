import { defineType, defineField } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "brandLabel",
      title: "Brand Label",
      type: "string",
      description: 'Small uppercase text above the heading. e.g., "Woodgrain and Sawdust"',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'Main heading first line. e.g., "From the Workshop"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headingAccent",
      title: "Heading Accent",
      type: "string",
      description: 'Amber-coloured second line. e.g., "to Your Home."',
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 3,
      description: "Paragraph text below the heading",
    }),
    defineField({
      name: "ctaText",
      title: "Button Text",
      type: "string",
      description: 'e.g., "Browse Collection"',
    }),
    defineField({
      name: "ctaLink",
      title: "Button Link",
      type: "string",
      description: 'e.g., "/products"',
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      description: "Displayed at low opacity behind the hero text",
      options: { hotspot: true },
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
    select: { title: "heading", media: "backgroundImage" },
  },
});
