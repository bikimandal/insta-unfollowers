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
      <div className="animate-fade-up mb-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-[28px] text-white shadow-[0_10px_25px_-5px_rgba(239,68,68,0.4)]">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">
                Not Following Back
              </h1>
              <p className="mt-1 text-[14px] text-text-muted">
                {users.length} accounts you follow that don{"'"}t follow you back
              </p>
            </div>
          </div>
          {users.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleCopyAll} 
                className="btn-primary flex items-center gap-1.5 bg-gradient-to-br from-red-500 to-orange-500 px-4 py-2 text-[14px] shadow-[0_10px_25px_-5px_rgba(239,68,68,0.3)] hover:from-red-600 hover:to-orange-600"
              >
                <Copy size={16} /> Copy All Usernames
              </button>
              <button
                onClick={() => { downloadCSV(users, "not-following-back.csv"); show("CSV downloaded!", "success"); }}
                className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-[13px]"
              >
                <Download size={14} /> Download CSV
              </button>
              <button
                onClick={() => { downloadTXT(users, "not-following-back.txt"); show("TXT downloaded!", "success"); }}
                className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-[13px]"
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
          className="animate-fade-up mb-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-orange-500/15 px-[18px] py-[14px] text-[14px] text-red-400 [animation-delay:40ms]"
        >
          <AlertTriangle size={20} />
          <span>
            <strong>{users.length}</strong> accounts are not following you back. Click any username to
            visit their Instagram profile.
          </span>
        </div>
      )}

      <div className="card animate-fade-up overflow-hidden [animation-delay:80ms]">
        <UserTable
          users={users}
          status="not-following-back"
          showExport={false}
          emptyIcon={<CheckCircle2 size={32} className="text-success" />}
          emptyTitle="Everyone follows you back!"
          emptyDescription="All accounts you follow also follow you back. Great engagement!"
        />
      </div>
    </div>
  );
}
