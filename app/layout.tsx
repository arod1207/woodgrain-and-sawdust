import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import "./globals.css";

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
          className={`${playfair.variable} ${lora.variable} antialiased bg-cream text-charcoal`}
        >
          <ConvexClientProvider>
            <CartProvider>{children}</CartProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
