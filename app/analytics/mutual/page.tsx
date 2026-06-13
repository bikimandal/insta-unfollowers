"use client";

import { useEffect, useState } from "react";
import { loadAnalytics } from "@/lib/storage";
import type { AnalyticsData } from "@/lib/types";
import UserTable from "@/components/UserTable";
import { Handshake, SearchX } from "lucide-react";

export default function MutualPage() {
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
              background: "rgba(168,85,247,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            <Handshake size={24} color="#a855f7" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
              Mutual Followers
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "4px 0 0" }}>
              {data.mutual.length} accounts where you both follow each other
            </p>
          </div>
        </div>
      </div>

      <div className="card animate-fade-up" style={{ animationDelay: "60ms", overflow: "hidden" }}>
        <UserTable
          users={data.mutual}
          status="mutual"
          emptyIcon={<SearchX size={32} color="var(--text-muted)" />}
          emptyTitle="No mutual followers"
          emptyDescription="Upload both followers.json and following.json to find mutual connections."
        />
      </div>
    </div>
  );
}
