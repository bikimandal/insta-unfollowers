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
      <div className="animate-fade-up mb-10">
        <h1 className="mb-2 text-[32px] font-extrabold tracking-[-0.03em]">
          Dashboard Overview
        </h1>
        <div className="flex items-center gap-3 text-[15px] text-text-secondary">
          <span>Analysis complete</span>
          <span className="text-border-glass">•</span>
          <span>{totalUsers.toLocaleString()} unique accounts processed</span>
        </div>
      </div>

      <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        <div className="animate-fade-up">
          <StatCard
            title="Followers"
            value={data.followers.length}
            description="Accounts that follow your profile."
            href="/analytics/followers"
            icon={<Users size={28} className="text-accent-primary" />}
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
            icon={<User size={28} className="text-accent-primary" />}
          />
        </div>
        <div className="animate-fade-up">
          <StatCard
            title="Mutual Connections"
            value={data.mutual.length}
            description="Accounts where you follow each other."
            href="/analytics/mutual"
            icon={<Handshake size={28} className="text-accent-primary" />}
          />
        </div>
        <div className="animate-fade-up">
          <StatCard
            title="Not Following Back"
            value={data.notFollowingBack.length}
            description="Accounts you follow but don't follow you back."
            href="/analytics/not-following-back"
            icon={<AlertTriangle size={28} className="text-danger" />}
          />
        </div>
      </div>
    </div>
  );
}
