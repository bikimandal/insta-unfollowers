"use client";

import { useEffect, useState } from "react";
import { loadAnalytics } from "@/lib/storage";
import type { AnalyticsData } from "@/lib/types";
import UserTable from "@/components/UserTable";
import { User, UserX } from "lucide-react";

export default function FollowingPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    setData(loadAnalytics());
  }, []);

  if (!data) return null;

  return (
    <div>
      <div className="animate-fade-up mb-7">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-[22px]">
            <User size={24} className="text-indigo-500" />
          </div>
          <div>
            <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">
              Following
            </h1>
            <p className="mt-1 text-[14px] text-text-muted">
              {data.following.length} accounts you follow ·{" "}
              <span className="text-red-400">
                {data.notFollowingBack.length} don{"'"}t follow back
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="card animate-fade-up overflow-hidden [animation-delay:60ms]">
        <UserTable
          users={data.following}
          status="following"
          emptyIcon={<UserX size={32} className="text-text-muted" />}
          emptyTitle="No following data"
          emptyDescription="Upload a following.json file to see this list."
        />
      </div>
    </div>
  );
}
