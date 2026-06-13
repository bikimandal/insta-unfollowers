"use client";

import { useEffect, useState } from "react";
import { loadAnalytics } from "@/lib/storage";
import type { AnalyticsData } from "@/lib/types";
import UserTable from "@/components/UserTable";
import { downloadCSV, downloadTXT } from "@/lib/parseInstagram";
import { useToast } from "@/components/Toast";
import { AlertTriangle, Copy, Download, CheckCircle2, Info } from "lucide-react";

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
    <div className="animate-fade-in">
      <ToastContainer />
      
      {/* Unified Hero Section */}
      <div className="relative mb-8 overflow-hidden rounded-[24px] border border-accent-primary/20 bg-gradient-to-br from-bg-slate via-bg-surface to-accent-primary/10 p-6 shadow-xl sm:p-8 animate-fade-up">
        {/* Decorative background glows */}
        <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-accent-primary/10 blur-[80px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-[300px] w-[300px] rounded-full bg-highlight/10 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5 sm:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-accent-primary to-highlight text-white shadow-[0_8px_30px_rgba(255,107,53,0.4)] transition-transform hover:scale-105">
              <AlertTriangle size={32} strokeWidth={2} />
            </div>
            <div>
              <h1 className="m-0 text-[28px] font-extrabold tracking-tight sm:text-[34px]">
                Not Following Back
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-text-secondary sm:text-[16px] max-w-[480px]">
                You are following <strong className="text-red-400 font-bold">{users.length}</strong> accounts that don't follow you back. 
                You can unfollow them directly on Instagram by clicking their usernames below.
              </p>
            </div>
          </div>

          {users.length > 0 && (
            <div className="mt-4 flex shrink-0 flex-col gap-5 sm:mt-0 sm:items-end">
              <button 
                onClick={handleCopyAll} 
                className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-accent-primary to-highlight px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(255,107,53,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(255,107,53,0.4)] hover:brightness-110 active:scale-95"
              >
                <Copy size={18} className="transition-transform group-hover:scale-110" /> 
                Copy All Usernames
              </button>
              
              <div className="flex w-full sm:w-auto items-center gap-2">
                <button
                  onClick={() => { downloadCSV(users, "not-following-back.csv"); show("CSV downloaded!", "success"); }}
                  className="group flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-slate-800/80 px-5 py-2.5 text-[14px] font-semibold text-text-primary shadow-sm border border-white/5 transition-all hover:bg-slate-700 hover:shadow-md hover:border-white/10 active:scale-95"
                >
                  <Download size={16} className="text-highlight transition-transform duration-300 group-hover:-translate-y-0.5" /> CSV
                </button>
                <button
                  onClick={() => { downloadTXT(users, "not-following-back.txt"); show("TXT downloaded!", "success"); }}
                  className="group flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-slate-800/80 px-5 py-2.5 text-[14px] font-semibold text-text-primary shadow-sm border border-white/5 transition-all hover:bg-slate-700 hover:shadow-md hover:border-white/10 active:scale-95"
                >
                  <Download size={16} className="text-highlight transition-transform duration-300 group-hover:-translate-y-0.5" /> TXT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[24px] border border-border-glass bg-bg-surface backdrop-blur-md animate-fade-up overflow-hidden [animation-delay:80ms]">
        <UserTable
          users={users}
          status="not-following-back"
          showExport={false}
          emptyIcon={<CheckCircle2 size={36} className="text-success" />}
          emptyTitle="Everyone follows you back!"
          emptyDescription="All accounts you follow also follow you back. You have fantastic engagement!"
        />
      </div>
    </div>
  );
}
