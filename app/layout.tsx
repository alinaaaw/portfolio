import type { Metadata } from "next";
import { Noto_Sans_SC, Space_Mono } from "next/font/google";
import { site } from "@/content";
import "../public/site.css";

const publicOrigin = "https://alinawu.com";

const sans = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export function generateMetadata(): Metadata {
  const { title, description, ogAlt } = site.metadata;

  return {
    metadataBase: new URL(publicOrigin),
    title,
    description,
    alternates: { canonical: "/" },
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: "Alina Wu — Lab 17 Interactive Portfolio",
      images: [{ url: "/og.png", width: 1639, height: 960, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
