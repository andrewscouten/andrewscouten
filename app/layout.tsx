import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Andrew Scouten",
  description:
    "ML Engineer & Researcher — data pipelines, deep learning, and applied AI. CS student at Texas State University.",
  keywords: ["Andrew Scouten", "ML Engineer", "Machine Learning", "Research", "Texas State"],
  authors: [{ name: "Andrew Scouten" }],
  openGraph: {
    title: "Andrew Scouten — Building Systems That Learn from Data",
    description:
      "ML Engineer & Researcher building data pipelines, deep learning systems, and applied AI. CS student at Texas State University.",
    url: "https://andrewscouten.com",
    siteName: "Andrew Scouten",
    type: "website",
    images: [{ url: "https://andrewscouten.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Scouten — Building Systems That Learn from Data",
    description:
      "ML Engineer & Researcher building data pipelines, deep learning systems, and applied AI. CS student at Texas State University.",
    images: ["https://andrewscouten.com/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: "https://andrewscouten.com",
  mainEntity: {
    "@type": "Person",
    name: "Andrew Scouten",
    url: "https://andrewscouten.com",
    jobTitle: "ML Engineer & Researcher",
    alumniOf: "Texas State University",
    sameAs: [
      "https://github.com/andrewscouten",
      "https://linkedin.com/in/andrewscouten",
      "https://orcid.org/0009-0004-6418-7158",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmMono.variable}`}
      style={{ fontFamily: "var(--font-sans), sans-serif" }}
    >
      <body className="min-h-screen antialiased">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </body>
    </html>
  );
}
