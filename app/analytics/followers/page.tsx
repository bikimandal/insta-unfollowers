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
      <div className="relative mb-8 overflow-hidden rounded-[24px] border border-highlight/20 bg-gradient-to-br from-bg-slate via-bg-surface to-highlight/10 p-6 shadow-xl sm:p-8 animate-fade-up">
        {/* Decorative background glows */}
        <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-highlight/10 blur-[80px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-[300px] w-[300px] rounded-full bg-accent-primary/10 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5 sm:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-highlight to-accent-primary text-white shadow-[0_8px_30px_rgba(6,182,212,0.4)] transition-transform hover:scale-105">
              <Users size={32} strokeWidth={2} />
            </div>
            <div>
              <h1 className="m-0 text-[28px] font-extrabold tracking-tight sm:text-[34px]">
                Followers
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-text-secondary sm:text-[16px] max-w-[480px]">
                <strong className="text-highlight font-bold">{data.followers.length}</strong> accounts are following you. 
                You are not following <strong className="text-text-primary font-bold">{data.onlyFollowers.length}</strong> of them back.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-border-glass bg-bg-surface backdrop-blur-md animate-fade-up overflow-hidden [animation-delay:60ms]">
        <UserTable
          users={data.followers}
          status="follower"
          emptyIcon={<UserX size={32} className="text-text-muted" />}
          emptyTitle="No follower data"
          emptyDescription="Upload a followers.json file to see this list."
        />
      </div>
    </div>
  );
}
