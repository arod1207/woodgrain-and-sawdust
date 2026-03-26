import { defineType, defineField } from "sanity";
import { StarIcon } from "@sanity/icons";

export const featuredPlansSection = defineType({
  name: "featuredPlansSection",
  title: "Featured Plans Section",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      description: 'e.g., "Featured Plans"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "viewAllText",
      title: "View All Link Text",
      type: "string",
      description: 'e.g., "View All"',
    }),
    defineField({
      name: "viewAllLink",
      title: "View All Link URL",
      type: "string",
      description: 'e.g., "/plans"',
    }),
    defineField({
      name: "emptyStateHeading",
      title: "Empty State Heading",
      type: "string",
      description: 'Shown when no plans are featured. e.g., "No featured plans yet"',
    }),
    defineField({
      name: "emptyStateText",
      title: "Empty State Description",
      type: "text",
      rows: 2,
      description: "Shown when no plans are featured.",
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
