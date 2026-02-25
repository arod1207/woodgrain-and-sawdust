import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Woodgrain & Sawdust | Handcrafted Woodworking",
  description:
    "Discover beautifully handcrafted wooden furniture and home decor. Each piece is made with care using premium hardwoods.",
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cream text-charcoal`}
        >
          <ConvexClientProvider>
            <CartProvider>{children}</CartProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
