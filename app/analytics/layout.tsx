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
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid rgba(99,102,241,0.2)",
            borderTopColor: "#6366f1",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading analytics…</div>
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
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      {/* Breadcrumb */}
      <div
        style={{
          padding: "10px 24px",
          borderBottom: "1px solid var(--bg-border)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--text-muted)",
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {breadcrumbs.map((bc, i) => (
          <span key={bc.href} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <span style={{ color: "var(--bg-border)" }}>›</span>}
            {i === breadcrumbs.length - 1 ? (
              <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{bc.label}</span>
            ) : (
              <Link
                href={bc.href}
                style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {bc.label}
              </Link>
            )}
          </span>
        ))}
      </div>
      <main
        style={{
          flex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          padding: "32px 24px 60px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
