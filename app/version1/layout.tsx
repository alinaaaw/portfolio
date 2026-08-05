import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alina - Pixels, Algorithms & People / Version 1",
  description: "Version 1: a personal space for websites, algorithms, hardware, and the complexity of being human.",
  openGraph: {
    title: "ALINA.WU - Pixels, Algorithms & People / Version 1",
    description: "A personal space for websites, algorithms, hardware, and the complexity of being human.",
    images: [{ url: "/versions/version1/og.png", width: 1200, height: 630, alt: "Alina's interactive personal workbench" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALINA.WU - Pixels, Algorithms & People / Version 1",
    description: "A personal space for websites, algorithms, hardware, and the complexity of being human.",
    images: ["/versions/version1/og.png"],
  },
};

export default function VersionOneLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <link rel="stylesheet" href="/styles/version1.css" />
      {children}
    </>
  );
}
