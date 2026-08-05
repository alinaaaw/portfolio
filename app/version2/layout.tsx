import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alina - Focus Field / Version 2",
  description: "Version 2: an animated, spatial portfolio explored through focus rather than controls.",
  openGraph: {
    title: "ALINA.WU - Focus Field / Version 2",
    description: "An animated, spatial portfolio explored through five signals and no controls to memorize.",
    images: [{ url: "/versions/version2/og.png", width: 1200, height: 630, alt: "Alina's Focus Field portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALINA.WU - Focus Field / Version 2",
    description: "An animated, spatial portfolio explored through five signals and no controls to memorize.",
    images: ["/versions/version2/og.png"],
  },
};

export default function VersionTwoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <link rel="stylesheet" href="/styles/version2.css" />
      {children}
    </>
  );
}
