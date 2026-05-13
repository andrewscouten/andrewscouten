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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
