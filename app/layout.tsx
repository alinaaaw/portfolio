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
  title: "Alina Wu — Code, Curiosity & People",
  description: "Alina's personal portfolio: thoughtful websites, algorithms, hardware, psychology, and small questions worth exploring.",
  openGraph: {
    title: "Alina Wu — Code, Curiosity & People",
    description: "A warm personal portfolio about building thoughtful systems and staying curious about people.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Alina Wu's personal portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alina Wu — Code, Curiosity & People",
    description: "Thoughtful systems, unfinished questions, and a fairly detailed Plan B.",
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
