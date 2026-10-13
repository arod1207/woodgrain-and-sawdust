import { defineType, defineField } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "content", title: "Hero Content", default: true },
    { name: "seo", title: "SEO & Metadata" },
  ],
  fields: [
    defineField({
      name: "brandLabel",
      title: "Label",
      type: "string",
      description: 'Small uppercase text above the heading. e.g., "The Woodgrain & Sawdust Designer"',
      group: "content",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'Main heading first line. e.g., "Design It Your Size."',
      validation: (rule) => rule.required(),
      group: "content",
    }),
    defineField({
      name: "headingAccent",
      title: "Heading Accent",
      type: "string",
      description: 'Amber-coloured second line. e.g., "Get the Cut List."',
      group: "content",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 3,
      description: "Paragraph text below the heading",
      group: "content",
    }),
    defineField({
      name: "ctaText",
      title: "Button Text",
      type: "string",
      description: 'e.g., "Start designing — it\'s free"',
      group: "content",
    }),
    defineField({
      name: "ctaLink",
      title: "Button Link",
      type: "string",
      description: 'e.g., "https://designer.woodgrainandsawdust.com/new"',
      group: "content",
    }),
    defineField({
      name: "secondaryCtaText",
      title: "Secondary Link Text",
      type: "string",
      description: 'Text link next to the button. e.g., "See how it works"',
      group: "content",
    }),
    defineField({
      name: "secondaryCtaLink",
      title: "Secondary Link URL",
      type: "string",
      description: 'e.g., "#how-it-works" (jumps to the How It Works section)',
      group: "content",
    }),
    defineField({
      name: "footnote",
      title: "Footnote",
      type: "string",
      description: 'Small text under the buttons. e.g., "Free forever for a real project."',
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Screenshot shown beside the text. Falls back to the built-in Designer screenshot.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
        }),
      ],
      group: "content",
    }),
    // SEO fields
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: 'Browser tab / search engine title. Falls back to "Woodgrain & Sawdust | Design Your Build, Get Your Cut List"',
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
    select: { title: "heading", media: "heroImage" },
  },
});
