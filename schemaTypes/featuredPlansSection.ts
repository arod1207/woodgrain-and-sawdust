import { defineType, defineField } from "sanity";
import { StarIcon } from "@sanity/icons";

export const featuredPlansSection = defineType({
  name: "featuredPlansSection",
  title: "Featured Plans Section",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'Small uppercase text above the heading. e.g., "Free plans"',
    }),
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      description: 'e.g., "Prefer a head start?"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Short paragraph under the heading",
    }),
    defineField({
      name: "viewAllText",
      title: "View All Link Text",
      type: "string",
      description: 'e.g., "View all plans"',
    }),
    defineField({
      name: "viewAllLink",
      title: "View All Link URL",
      type: "string",
      description: 'e.g., "/plans"',
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
