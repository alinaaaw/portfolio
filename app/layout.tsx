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
  title: "Wenrui (Alina) Wu — Computer Science Portfolio",
  description: "Wenrui (Alina) Wu's interactive portfolio: computer science projects, human-centered research, hardware, algorithms, and software engineering.",
  openGraph: {
    title: "WENRUI (ALINA) WU — Computer Science Portfolio",
    description: "Interactive work across software, algorithms, hardware, and human-centered research.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Alina's Focus Field portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WENRUI (ALINA) WU — Computer Science Portfolio",
    description: "Interactive work across software, algorithms, hardware, and human-centered research.",
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

