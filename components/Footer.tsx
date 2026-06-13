"use client";

import Link from "next/link";
import { BarChart2, ExternalLink, Heart } from "lucide-react";
import { BRAND_NAME, PORTFOLIO_URL, APP_NAME } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-slate-900/60 p-8 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6">
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex max-w-[280px] flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-primary to-highlight shadow-[0_4px_12px_rgba(255,107,53,0.3)]">
                <BarChart2 size={16} color="white" strokeWidth={2.5} />
              </div>
              <span className="gradient-text text-[17px] font-extrabold tracking-[-0.03em]">
                {APP_NAME}
              </span>
            </div>
            <p className="m-0 text-[13px] leading-relaxed text-text-secondary">
              Understand your Instagram network. 100% private — your data never leaves your browser.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col gap-2.5">
              <div className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
                App
              </div>
              {[
                { href: "/", label: "Home" },
                { href: "/analytics", label: "Dashboard" },
                { href: "/guide", label: "How to Export" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover-link text-[14px] text-text-secondary"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
                Analytics
              </div>
              {[
                { href: "/analytics/followers", label: "Followers" },
                { href: "/analytics/following", label: "Following" },
                { href: "/analytics/not-following-back", label: "Not Following Back" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover-link text-[14px] text-text-secondary"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* Bottom row */}
        <div className="flex flex-col-reverse sm:flex-row flex-wrap items-center justify-between gap-4 sm:gap-3 text-center sm:text-left">
          <span className="text-[13px] text-text-muted">
            © {year} {APP_NAME} · Processed locally
          </span>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <span className="flex items-center gap-1.5 text-[13px] text-text-muted">
              Made with <Heart size={12} className="text-danger" fill="currentColor" /> by
              <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-text-secondary transition-colors hover:text-accent-primary">
                {BRAND_NAME}
              </a>
            </span>
            <a
              href="https://accountscenter.instagram.com/info_and_permissions/dyi/?theme=dark"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-text-muted no-underline transition-colors duration-150 hover:text-highlight"
            >
              <ExternalLink size={13} /> Get Instagram Data
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
