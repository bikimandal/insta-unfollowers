"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart2 } from "lucide-react";
import { hasAnalytics } from "@/lib/storage";
import { APP_NAME } from "@/lib/constants";

export default function Header() {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    setHasData(hasAnalytics());
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-[70px] items-center justify-between border-b border-white/5 bg-slate-900/40 px-8 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-primary to-highlight text-lg shadow-[0_4px_15px_rgba(255,107,53,0.4)]">
          <BarChart2 size={20} color="white" strokeWidth={2.5} />
        </div>
        <span className="gradient-text text-[20px] font-extrabold tracking-[-0.03em]">
          {APP_NAME}
        </span>
      </Link>
      
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/guide" className="hidden sm:inline-flex hover-link text-[14px] font-semibold text-text-secondary">
          How to Export
        </Link>
        {hasData && (
          <Link
            href="/analytics"
            className="btn-primary px-4 py-2 sm:px-5 sm:py-2.5 text-[13px] sm:text-[14px]"
          >
            Dashboard →
          </Link>
        )}
      </div>
    </header>
  );
}
