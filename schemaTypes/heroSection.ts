import { defineType, defineField } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "leftPanel", title: "Brand Panel (Left)", default: true },
    { name: "rightPanel", title: "Hero Content (Right)" },
    { name: "seo", title: "SEO & Metadata" },
  ],
  fields: [
    // Left panel (brand panel) fields
    defineField({
      name: "brandNameLine1",
      title: "Brand Name Line 1",
      type: "string",
      description: 'First line of the brand name on the left panel. e.g., "Woodgrain"',
      group: "leftPanel",
    }),
    defineField({
      name: "brandNameConnector",
      title: "Brand Name Connector",
      type: "string",
      description: 'Connector symbol between lines (displayed in amber). e.g., "&"',
      group: "leftPanel",
    }),
    defineField({
      name: "brandNameLine2",
      title: "Brand Name Line 2",
      type: "string",
      description: 'Second line of the brand name. e.g., "Sawdust"',
      group: "leftPanel",
    }),
    defineField({
      name: "establishedText",
      title: "Established Text",
      type: "string",
      description: 'Small text below the brand name. e.g., "Est. 2024"',
      group: "leftPanel",
    }),
    // Right panel (hero content) fields
    defineField({
      name: "brandLabel",
      title: "Brand Label",
      type: "string",
      description: 'Small uppercase text above the heading. e.g., "Woodgrain and Sawdust"',
      group: "rightPanel",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'Main heading first line. e.g., "From the Workshop"',
      validation: (rule) => rule.required(),
      group: "rightPanel",
    }),
    defineField({
      name: "headingAccent",
      title: "Heading Accent",
      type: "string",
      description: 'Amber-coloured second line. e.g., "to Your Home."',
      group: "rightPanel",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 3,
      description: "Paragraph text below the heading",
      group: "rightPanel",
    }),
    defineField({
      name: "ctaText",
      title: "Button Text",
      type: "string",
      description: 'e.g., "Browse Collection"',
      group: "rightPanel",
    }),
    defineField({
      name: "ctaLink",
      title: "Button Link",
      type: "string",
      description: 'e.g., "/products"',
      group: "rightPanel",
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
      group: "rightPanel",
    }),
    // SEO fields
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: 'Browser tab / search engine title. Falls back to "Woodgrain & Sawdust | Woodworking Cut Plans"',
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description: "Meta description for search engines",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "heading", media: "backgroundImage" },
  },
});
