import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import Script from "next/script";
import "./globals.css";
import { getSiteUrl } from "@/lib/siteUrl";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = getSiteUrl();

const DEFAULT_TITLE = "Woodgrain & Sawdust | Woodworking Cut Plans";
const DEFAULT_DESCRIPTION =
  "Free PDF cut plans for woodworking projects of all skill levels. Download instantly — no account required.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Woodgrain & Sawdust",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/logo.jpg", width: 400, height: 400, alt: "Woodgrain & Sawdust" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${playfair.variable} ${lora.variable} antialiased bg-cream text-charcoal`}
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
          {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
            <Script
              defer
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
              strategy="afterInteractive"
            />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
