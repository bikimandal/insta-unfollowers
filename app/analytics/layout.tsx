"use client";

import Navbar from "@/components/Navbar";
import { loadAnalytics } from "@/lib/storage";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { AnalyticsData } from "@/lib/types";

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const data = loadAnalytics();
    if (!data) {
      router.replace("/");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
        <div className="text-sm text-text-muted">Loading analytics…</div>
      </div>
    );
  }

  // Breadcrumbs
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...segments.map((seg, i) => ({
      label: seg
        .split("-")
        .map((w) => w[0]?.toUpperCase() + w.slice(1))
        .join(" "),
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      {/* Breadcrumb */}
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-1.5 border-b border-border-glass px-6 py-2.5 text-[13px] text-text-muted">
        {breadcrumbs.map((bc, i) => (
          <span key={bc.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-border-glass">›</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="font-medium text-text-secondary">{bc.label}</span>
            ) : (
              <Link
                href={bc.href}
                className="hover-link text-inherit"
              >
                {bc.label}
              </Link>
            )}
          </span>
        ))}
      </div>
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 pb-[60px] pt-8">
        {children}
      </main>
    </div>
  );
}
