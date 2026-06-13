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
      <div className="animate-fade-up mb-7">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-[22px]">
            <Users size={24} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">
              Followers
            </h1>
            <p className="mt-1 text-[14px] text-text-muted">
              {data.followers.length} accounts follow you ·{" "}
              <span className="text-amber-400">
                {data.onlyFollowers.length} you don{"'"}t follow back
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="card animate-fade-up overflow-hidden [animation-delay:60ms]">
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
