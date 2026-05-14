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
    "ML Engineer & Researcher — data pipelines, deep learning, and applied AI. Texas State University.",
  keywords: ["Andrew Scouten", "ML Engineer", "Machine Learning", "Research", "Texas State"],
  authors: [{ name: "Andrew Scouten" }],
  openGraph: {
    title: "Andrew Scouten",
    description: "ML Engineer & Researcher",
    url: "https://andrewscouten.com",
    siteName: "Andrew Scouten",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
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
