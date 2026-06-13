"use client";

import { useEffect, useState } from "react";
import { loadAnalytics } from "@/lib/storage";
import type { AnalyticsData } from "@/lib/types";
import UserTable from "@/components/UserTable";
import { downloadCSV, downloadTXT } from "@/lib/parseInstagram";
import { useToast } from "@/components/Toast";
import { AlertTriangle, Copy, Download, CheckCircle2 } from "lucide-react";

export default function NotFollowingBackPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const { show, ToastContainer } = useToast();

  useEffect(() => {
    setData(loadAnalytics());
  }, []);

  if (!data) return null;

  const users = data.notFollowingBack;

  async function handleCopyAll() {
    const text = users.map((u) => u.username).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      show(`Copied ${users.length} usernames to clipboard!`, "success");
    } catch {
      show("Failed to copy — please allow clipboard access.", "error");
    }
  }

  return (
    <div>
      <div className="animate-fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #ef4444, #f97316)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                flexShrink: 0,
                color: "white",
                boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)",
              }}
            >
              <AlertTriangle size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
                Not Following Back
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "4px 0 0" }}>
                {users.length} accounts you follow that don{"'"}t follow you back
              </p>
            </div>
          </div>
          {users.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={handleCopyAll} className="btn-primary" style={{ fontSize: 14, background: "linear-gradient(135deg, #ef4444, #f97316)", boxShadow: "0 10px 25px -5px rgba(239,68,68,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
                <Copy size={16} /> Copy All Usernames
              </button>
              <button
                onClick={() => { downloadCSV(users, "not-following-back.csv"); show("CSV downloaded!", "success"); }}
                className="btn-secondary"
                style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
              >
                <Download size={14} /> Download CSV
              </button>
              <button
                onClick={() => { downloadTXT(users, "not-following-back.txt"); show("TXT downloaded!", "success"); }}
                className="btn-secondary"
                style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
              >
                <Download size={14} /> Download TXT
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Warning banner */}
      {users.length > 0 && (
        <div
          className="animate-fade-up"
          style={{
            marginBottom: 20,
            padding: "14px 18px",
            background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15))",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 14,
            color: "#f87171",
            animationDelay: "40ms",
          }}
        >
          <AlertTriangle size={20} />
          <span>
            <strong>{users.length}</strong> accounts are not following you back. Click any username to
            visit their Instagram profile.
          </span>
        </div>
      )}

      <div className="card animate-fade-up" style={{ animationDelay: "80ms", overflow: "hidden" }}>
        <UserTable
          users={users}
          status="not-following-back"
          showExport={false}
          emptyIcon={<CheckCircle2 size={32} color="var(--success)" />}
          emptyTitle="Everyone follows you back!"
          emptyDescription="All accounts you follow also follow you back. Great engagement!"
        />
      </div>
    </div>
  );
}
