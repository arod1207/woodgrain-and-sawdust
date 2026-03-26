import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

const singletonTypes = [
  "heroSection",
  "aboutSection",
  "featuresSection",
  "featuredPlansSection",
];

export default defineConfig({
  name: "woodgrain-sawdust",
  title: "Woodgrain & Sawdust",

  projectId,
  dataset,

  basePath: "/studio",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Hero Section")
              .id("heroSection")
              .child(
                S.document()
                  .schemaType("heroSection")
                  .documentId("heroSection")
              ),
            S.listItem()
              .title("Features Section")
              .id("featuresSection")
              .child(
                S.document()
                  .schemaType("featuresSection")
                  .documentId("featuresSection")
              ),
            S.listItem()
              .title("Featured Plans Section")
              .id("featuredPlansSection")
              .child(
                S.document()
                  .schemaType("featuredPlansSection")
                  .documentId("featuredPlansSection")
              ),
            S.listItem()
              .title("About Section")
              .id("aboutSection")
              .child(
                S.document()
                  .schemaType("aboutSection")
                  .documentId("aboutSection")
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !singletonTypes.includes(item.getId() ?? "")
            ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
