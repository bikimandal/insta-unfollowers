import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import { APP_NAME, PORTFOLIO_URL, APP_ICON } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL('https://nofollow.app'),
  title: {
    default: `${APP_NAME} — The Ultimate Instagram Follower Analytics Tool`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Free, privacy-first Instagram follower analytics. Discover unfollowers, mutuals, and ghost followers securely in your browser. 100% private, no login required.",
  keywords: ["instagram", "followers", "analytics", "unfollowers", "not following back", "instagram tracker", "secure instagram tools", "client side"],
  authors: [{ name: "Biki", url: PORTFOLIO_URL }],
  creator: "Biki",
  icons: {
    icon: APP_ICON,
    apple: APP_ICON,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: `${APP_NAME} — The Ultimate Instagram Follower Analytics Tool`,
    description: "Discover unfollowers and analyze your Instagram network securely. 100% private, fully client-side.",
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Instagram Follower Analytics`,
    description: "Discover unfollowers and analyze your Instagram network securely.",
    creator: "@bikimandal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-dvh" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
