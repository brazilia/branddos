// app/layout.js
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/lib/i18n/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// A good default metadata setup for SEO and social sharing
export const metadata: Metadata = {
  title: "Brand Dos | Beautiful Social Media Growth",
  description:
    "We help businesses grow their online presence with authentic content and genuine community building. No stress, just beautiful results.",
  openGraph: {
    title: "Brand Dos | Beautiful Social Media Growth",
    description: "Authentic, stress-free social media management.",
    url: "https://your-domain.com", // Replace with your actual domain
    siteName: "Brand Dos",
    images: [
      {
        url: "https://your-domain.com/og-image.png", // Replace with a link to a great OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Dos | Beautiful Social Media Growth",
    description: "Authentic, stress-free social media management.",
    images: ["https://your-domain.com/og-image.png"], // Replace with your OG image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(geistSans.variable, "font-sans antialiased")}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}