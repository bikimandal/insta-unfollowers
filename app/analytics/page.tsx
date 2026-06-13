"use client";

import { useEffect, useState } from "react";
import { loadAnalytics } from "@/lib/storage";
import type { AnalyticsData } from "@/lib/types";
import StatCard from "@/components/StatCard";
import { Users, User, Handshake, AlertTriangle } from "lucide-react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    setData(loadAnalytics());
  }, []);

  if (!data) return null;

  const totalUsers = new Set([
    ...data.following.map((u) => u.username),
    ...data.followers.map((u) => u.username),
  ]).size;

  const followRatio = data.following.length > 0 
    ? (data.followers.length / data.following.length).toFixed(2)
    : "0";

  return (
    <div>
      <div className="animate-fade-up" style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
          Dashboard Overview
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-secondary)", fontSize: 15 }}>
          <span>Analysis complete</span>
          <span style={{ color: "var(--border-glass)" }}>•</span>
          <span>{totalUsers.toLocaleString()} unique accounts processed</span>
        </div>
      </div>

      <div
        className="stagger"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        <div className="animate-fade-up">
          <StatCard
            title="Followers"
            value={data.followers.length}
            description="Accounts that follow your profile."
            href="/analytics/followers"
            icon={<Users size={28} color="var(--accent-primary)" />}
            trend={followRatio + "x ratio"}
            trendUp={parseFloat(followRatio) >= 1}
          />
        </div>
        <div className="animate-fade-up">
          <StatCard
            title="Following"
            value={data.following.length}
            description="Accounts you are currently following."
            href="/analytics/following"
            icon={<User size={28} color="var(--accent-primary)" />}
          />
        </div>
        <div className="animate-fade-up">
          <StatCard
            title="Mutual Connections"
            value={data.mutual.length}
            description="Accounts where you follow each other."
            href="/analytics/mutual"
            icon={<Handshake size={28} color="var(--accent-primary)" />}
          />
        </div>
        <div className="animate-fade-up">
          <StatCard
            title="Not Following Back"
            value={data.notFollowingBack.length}
            description="Accounts you follow but don't follow you back."
            href="/analytics/not-following-back"
            icon={<AlertTriangle size={28} color="var(--danger)" />}
          />
        </div>
      </div>
    </div>
  );
}
