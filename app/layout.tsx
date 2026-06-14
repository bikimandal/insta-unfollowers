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
  metadataBase: new URL('https://ghosters.vercel.app'),
  title: {
    default: `${APP_NAME} — Find Who Unfollowed You on Instagram | Free & Secure Tracker`,
    template: `%s | ${APP_NAME} - Instagram Tracker`,
  },
  description:
    "Find out exactly who unfollowed you on Instagram without logging in. Ghosters is a free, 100% private, client-side Instagram analytics tool to track unfollowers, ghost followers, and mutuals safely.",
  keywords: [
    "instagram unfollowers",
    "who unfollowed me on instagram",
    "instagram followers tracker",
    "check instagram unfollowers free",
    "instagram analytics",
    "instagram ghost followers",
    "safe instagram unfollower app",
    "instagram unfollowers no login",
    "instagram mutual followers tracker",
    "ghosters app"
  ],
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
    title: `${APP_NAME} — Track Your Instagram Unfollowers Securely`,
    description: "Find out exactly who unfollowed you on Instagram without logging in. 100% private, client-side tracking for ghost followers and mutuals.",
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Safe Instagram Unfollower Tracker`,
    description: "Find out who unfollowed you on Instagram instantly and securely. No login required.",
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
