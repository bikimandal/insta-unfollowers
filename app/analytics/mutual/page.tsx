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
      <div className="animate-fade-up mb-7">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 text-[22px]">
            <Handshake size={24} className="text-purple-500" />
          </div>
          <div>
            <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">
              Mutual Followers
            </h1>
            <p className="mt-1 text-[14px] text-text-muted">
              {data.mutual.length} accounts where you both follow each other
            </p>
          </div>
        </div>
      </div>

      <div className="card animate-fade-up overflow-hidden [animation-delay:60ms]">
        <UserTable
          users={data.mutual}
          status="mutual"
          emptyIcon={<SearchX size={32} className="text-text-muted" />}
          emptyTitle="No mutual followers"
          emptyDescription="Upload both followers.json and following.json to find mutual connections."
        />
      </div>
    </div>
  );
}
