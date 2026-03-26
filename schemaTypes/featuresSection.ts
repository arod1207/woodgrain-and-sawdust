import { defineType, defineField, defineArrayMember } from "sanity";
import { InlineIcon } from "@sanity/icons";

export const featuresSection = defineType({
  name: "featuresSection",
  title: "Features Section",
  type: "document",
  icon: InlineIcon,
  fields: [
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      description:
        "Feature cards displayed in the strip below the hero. Recommended: 3 features.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description: "Choose a Lucide icon",
              options: {
                list: [
                  { title: "File Text", value: "FileText" },
                  { title: "Layers", value: "Layers" },
                  { title: "Download", value: "Download" },
                  { title: "Ruler", value: "Ruler" },
                  { title: "Hammer", value: "Hammer" },
                  { title: "Star", value: "Star" },
                  { title: "Shield Check", value: "ShieldCheck" },
                  { title: "Zap", value: "Zap" },
                  { title: "Heart", value: "Heart" },
                  { title: "Clock", value: "Clock" },
                  { title: "Wrench", value: "Wrench" },
                  { title: "Package", value: "Package" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description: 'e.g., "Detailed Plans"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              description: "Short description of this feature",
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
  ],
  preview: {
    prepare() {
      return { title: "Features Section" };
    },
  },
});
