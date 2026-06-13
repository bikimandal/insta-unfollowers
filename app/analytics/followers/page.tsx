"use client";

import { useEffect, useState } from "react";
import { loadAnalytics } from "@/lib/storage";
import type { AnalyticsData } from "@/lib/types";
import UserTable from "@/components/UserTable";
import { Users, UserX } from "lucide-react";

export default function FollowersPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    setData(loadAnalytics());
  }, []);

  if (!data) return null;

  return (
    <div>
      <div className="animate-fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(16,185,129,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            <Users size={24} color="#10B981" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
              Followers
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "4px 0 0" }}>
              {data.followers.length} accounts follow you ·{" "}
              <span style={{ color: "#fbbf24" }}>
                {data.onlyFollowers.length} you don{"'"}t follow back
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="card animate-fade-up" style={{ animationDelay: "60ms", overflow: "hidden" }}>
        <UserTable
          users={data.followers}
          status="follower"
          emptyIcon={<UserX size={32} color="var(--text-muted)" />}
          emptyTitle="No follower data"
          emptyDescription="Upload a followers.json file to see this list."
        />
      </div>
    </div>
  );
}
