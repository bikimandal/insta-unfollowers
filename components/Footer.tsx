"use client";

import Link from "next/link";
import Image from "next/image";
import { Link2, User, Code, Briefcase } from "lucide-react";
import { BRAND_NAME, PORTFOLIO_URL, GITHUB_URL, APP_NAME, APP_ICON } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-slate-900/60 p-8 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Image priority loading="eager" fetchPriority="high" src={APP_ICON} alt={APP_NAME} width={32} height={32} className="h-8 w-8 drop-shadow-[0_4px_12px_rgba(255,107,53,0.2)]" />
              <span className="gradient-text text-[18px] font-extrabold tracking-[-0.03em]">
                {APP_NAME}
              </span>
              <span className="text-text-secondary font-medium text-[15px] hidden sm:inline">- Instagram Analytics Tool</span>
            </div>
            <p className="m-0 text-[14px] leading-relaxed text-text-secondary">
              Discover who doesn't follow you back. 100% private.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[15px] font-bold text-text-primary">
              <Link2 size={16} className="text-accent-primary" /> Quick Links
            </div>
            <div className="flex flex-col gap-2.5 mt-1">
              <Link href="/" className="hover-link text-[14px] text-text-secondary w-fit">Home</Link>
              <Link href="/analytics" className="hover-link text-[14px] text-text-secondary w-fit">Dashboard</Link>
              <Link href="/guide" className="hover-link text-[14px] text-text-secondary w-fit">How to Export</Link>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover-link text-[14px] text-text-secondary w-fit">GitHub</a>
            </div>
          </div>

          {/* Made by Biki */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[15px] font-bold text-text-primary">
              <User size={16} className="text-accent-primary" /> Made by {BRAND_NAME}
            </div>
            <div className="flex flex-col gap-2.5 mt-1">
              <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover-link text-[14px] text-text-secondary w-fit">
                <Briefcase size={14} /> Portfolio
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover-link text-[14px] text-text-secondary w-fit">
                <Code size={14} /> GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* Bottom row */}
        <div className="flex items-center justify-center text-center">
          <span className="text-[13px] text-text-muted">
            © {year} {APP_NAME} | All data processed locally on your device
          </span>
        </div>
      </div>
    </footer>
  );
}
