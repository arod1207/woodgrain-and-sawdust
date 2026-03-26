import { defineType, defineField, defineArrayMember } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const cutPlan = defineType({
  name: "cutPlan",
  title: "Cut Plan",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g., "Floating Shelf Cut Plan"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly name",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Detailed description of the cut plan and finished project",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      description: "The cut plan PDF that customers will download",
      options: { accept: "application/pdf" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Preview Images",
      type: "array",
      description:
        "Preview images of the finished project and plan pages",
      of: [
        defineArrayMember({
          type: "image",
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
      validation: (rule) => rule.min(1).error("Add at least one preview image"),
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "estimatedTime",
      title: "Estimated Build Time",
      type: "string",
      description: 'e.g., "4-6 hours", "1 weekend"',
    }),
    defineField({
      name: "toolsRequired",
      title: "Tools Required",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "List of tools needed for this project",
    }),
    defineField({
      name: "materialsRequired",
      title: "Materials Required",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "List of lumber and materials needed",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on homepage",
      initialValue: false,
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok Build Video",
      type: "url",
      description: "Link to a TikTok video showing the build process",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0",
      difficulty: "difficulty",
    },
    prepare({ title, media, difficulty }) {
      return {
        title,
        subtitle: difficulty ?? "",
        media,
      };
    },
  },
});
