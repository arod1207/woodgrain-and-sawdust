import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const heroSection = {
  _id: "heroSection",
  _type: "heroSection",
  brandNameLine1: "Woodgrain",
  brandNameConnector: "&",
  brandNameLine2: "Sawdust",
  establishedText: "Est. 2024",
  brandLabel: "Woodgrain & Sawdust",
  heading: "Build Something Real",
  headingAccent: "Free Plans. No Paywall.",
  subheading:
    "Detailed PDF cut plans for woodworking projects of all skill levels. Download free — just enter your name and email.",
  ctaText: "Browse Plans",
  ctaLink: "/plans",
  seoTitle: "Woodgrain & Sawdust | Free Woodworking Cut Plans",
  seoDescription:
    "Free PDF woodworking cut plans — detailed cut lists, dimensions, and instructions. Download instantly, no paywall.",
};

const featuresSection = {
  _id: "featuresSection",
  _type: "featuresSection",
  features: [
    {
      _key: "feature-1",
      icon: "FileText",
      title: "Detailed Plans",
      description:
        "Cut lists, dimensions, and assembly instructions — everything you need before you touch a board.",
    },
    {
      _key: "feature-2",
      icon: "Hammer",
      title: "All Skill Levels",
      description:
        "Beginner-friendly builds to more ambitious projects. If you have a garage and some tools, you can build this.",
    },
    {
      _key: "feature-3",
      icon: "Download",
      title: "Free. Always.",
      description:
        "No paywall, no subscription. Just enter your name and email and your PDF downloads immediately.",
    },
  ],
};

const aboutSection = {
  _id: "aboutSection",
  _type: "aboutSection",
  heading: "Hi, I'm Armando.",
  subheading: "The Maker",
  body: "I'm a software developer by trade, but I spend my weekends in the garage building things with my hands.\n\nWoodworking is how I unplug — there's something satisfying about designing something on paper and then actually cutting it out of lumber. I'm still learning, still figuring things out, and I figured I'd share the plans along the way.\n\nAll the plans on this site are free. More are coming as I build them. If one helps you make something, that's the whole point.",
  stats: [
    { _key: "stat-1", value: "100%", label: "Free Plans" },
    { _key: "stat-2", value: "Texas", label: "Garage Built" },
  ],
};

async function seed() {
  console.log("Seeding Sanity content...\n");

  try {
    await client.createOrReplace(heroSection);
    console.log("✓ Hero section");

    await client.createOrReplace(featuresSection);
    console.log("✓ Features section");

    await client.createOrReplace(aboutSection);
    console.log("✓ About section");

    console.log("\nDone.");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

seed();
