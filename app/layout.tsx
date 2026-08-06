import type { Metadata } from "next";
import { Noto_Sans_SC, Space_Mono } from "next/font/google";
const sans = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Wenrui (Alina) Wu — Software, Research & Physical Computing",
  description: "University of Washington computer science student building software, allocation algorithms, hardware systems, and human-centered research.",
  openGraph: {
    title: "WENRUI (ALINA) WU — Personal Workbench",
    description: "Software engineering, allocation algorithms, physical computing, and research about how people judge relevance.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Wenrui Alina Wu's interactive personal workbench" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WENRUI (ALINA) WU — Personal Workbench",
    description: "Software engineering, allocation algorithms, physical computing, and human-centered research.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/site.css" />
      </head>
      <body className={`${sans.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
