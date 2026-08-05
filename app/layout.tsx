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
  title: "Alina — Code, People, and the Routes Between",
  description: "Alina's interactive personal portfolio: computer science, psychology, projects, thought traces, and life beyond the screen.",
  openGraph: {
    title: "ALINA.WU — Code, People, and the Routes Between",
    description: "An interactive personal portfolio about computer science, human complexity, projects, thought traces, and life beyond the screen.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Alina's Focus Field portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALINA.WU — Code, People, and the Routes Between",
    description: "An interactive personal portfolio about computer science, human complexity, projects, thought traces, and life beyond the screen.",
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

