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
  title: "Alina — Pixels, Algorithms & People",
  description: "A personal space for websites, algorithms, hardware, and the complexity of being human.",
  openGraph: {
    title: "ALINA.WU — Pixels, Algorithms & People",
    description: "A personal space for websites, algorithms, hardware, and the complexity of being human.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Alina's interactive personal workbench" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALINA.WU — Pixels, Algorithms & People",
    description: "A personal space for websites, algorithms, hardware, and the complexity of being human.",
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
