// Puts the Designer-focused homepage copy into Sanity.
// Replaces the Hero, Features, How It Works and Featured Plans singletons; leaves everything else alone.
//   node scripts/seed-designer-home.mjs --dry-run   (print what would be written)
//   node scripts/seed-designer-home.mjs
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const DRY_RUN = process.argv.includes("--dry-run");
const DESIGNER_NEW_URL = "https://designer.woodgrainandsawdust.com/new";

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
  brandLabel: "The Woodgrain & Sawdust Designer",
  heading: "Design It Your Size.",
  headingAccent: "Get the Cut List.",
  subheading:
    "Drag boards onto a workspace, trim them, join them — and walk away with a cut list and shopping list you can take straight to the lumber yard. No CAD experience needed. No math headaches either.",
  ctaText: "Start designing — it's free",
  ctaLink: DESIGNER_NEW_URL,
  secondaryCtaText: "See how it works",
  secondaryCtaLink: "#how-it-works",
  footnote: "Free forever for a real project. No card needed to start.",
  seoTitle: "Woodgrain & Sawdust | Design Your Build, Get Your Cut List",
  seoDescription:
    "Design woodworking projects at your size in minutes — drag boards, trim them, and get a cut list and shopping list you can take straight to the lumber yard. Free to start.",
};

const featuresSection = {
  _id: "featuresSection",
  _type: "featuresSection",
  features: [
    {
      _key: "feature-1",
      icon: "Ruler",
      title: "Your Size, Not Ours",
      description:
        'Drag a board\'s end or type 30 1/2" — fractions are how it talks. No CAD degree required.',
    },
    {
      _key: "feature-2",
      icon: "ClipboardList",
      title: "A Cut List That's Actually Right",
      description:
        "Every piece at the size you really cut it, miters and dados included. Print it big for the shop.",
    },
    {
      _key: "feature-3",
      icon: "ShoppingCart",
      title: "Know What to Buy",
      description:
        "A shopping list of real boards and hardware, so you only make one trip to the lumber yard. (Okay, maybe two.)",
    },
  ],
};

const howItWorksSection = {
  _id: "howItWorksSection",
  _type: "howItWorksSection",
  label: "How it works",
  heading: "From “I wonder if…” to a cut list in minutes",
  steps: [
    {
      _key: "step-1",
      title: "Start from a plan — or one board",
      description:
        "Open a ready-made project like a planter or bookshelf, or drag a 2x4 onto the workspace and freestyle it.",
    },
    {
      _key: "step-2",
      title: "Make it fit your space",
      description:
        "Resize, trim and join boards. Spin it around in 3D or flip to front, side and top drawings with every measurement on them.",
    },
    {
      _key: "step-3",
      title: "Take it to the shop",
      description:
        "Get your cut list and shopping list, print them, and go make some sawdust.",
    },
  ],
  ctaText: "Try the Designer",
  ctaLink: DESIGNER_NEW_URL,
};

const featuredPlansSection = {
  _id: "featuredPlansSection",
  _type: "featuredPlansSection",
  label: "Free plans",
  heading: "Prefer a head start?",
  description:
    "Grab a free PDF plan as-is, or open it in the Designer and tweak it to fit your patio, porch or that one weird corner.",
  viewAllText: "View all plans",
  viewAllLink: "/plans",
};

const documents = [heroSection, featuresSection, howItWorksSection, featuredPlansSection];

async function seed() {
  console.log(
    `${DRY_RUN ? "[dry run] " : ""}Seeding Designer homepage into "${process.env.NEXT_PUBLIC_SANITY_DATASET}"...\n`
  );

  try {
    for (const doc of documents) {
      if (DRY_RUN) {
        console.log(JSON.stringify(doc, null, 2), "\n");
        continue;
      }
      await client.createOrReplace(doc);
      console.log(`✓ ${doc._id}`);
    }
    console.log("\nDone.");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

seed();
