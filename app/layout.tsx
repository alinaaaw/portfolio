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
  title: "Observation Room — A Behavioral Experiment",
  description: "Four small decisions. A live trace of uncertainty, attention, and control.",
  openGraph: {
    title: "Observation Room",
    description: "You are not here to answer questions. You are here to be observed.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Observation Room behavioral experiment" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Observation Room",
    description: "Four small decisions. A behavioral trace—not a diagnosis.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/site.css" />
      </head>
      <body className={sans.variable + " " + mono.variable}>{children}</body>
    </html>
  );
}
