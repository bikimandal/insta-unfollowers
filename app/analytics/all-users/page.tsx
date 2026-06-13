"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { loadAnalytics } from "@/lib/storage";
import type { AnalyticsData, InstagramUser, FollowStatus, SortField, SortDirection } from "@/lib/types";
import Badge from "@/components/Badge";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import { formatDate, downloadCSV, downloadTXT } from "@/lib/parseInstagram";
import { useToast } from "@/components/Toast";
import { LayoutList, Grid, Copy, Download, Users, Search } from "lucide-react";

const PAGE_SIZE = 50;

type StatusFilter = "all" | "following" | "follower" | "mutual" | "not-following-back";

interface EnrichedUser extends InstagramUser {
  status: FollowStatus;
}

function avatarColor(username: string) {
  return `hsl(${(username.charCodeAt(0) * 40) % 360}, 60%, 30%)`;
}

export default function AllUsersPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("username");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const { show, ToastContainer } = useToast();

  useEffect(() => {
    setData(loadAnalytics());
  }, []);

  const allUsers = useMemo<EnrichedUser[]>(() => {
    if (!data) return [];
    const followingSet = new Set(data.following.map((u) => u.username.toLowerCase()));
    const followerSet = new Set(data.followers.map((u) => u.username.toLowerCase()));
    const seen = new Set<string>();
    const result: EnrichedUser[] = [];

    const add = (u: InstagramUser, defaultStatus: FollowStatus) => {
      const key = u.username.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      const inFollowing = followingSet.has(key);
      const inFollowers = followerSet.has(key);
      let status: FollowStatus;
      if (inFollowing && inFollowers) status = "mutual";
      else if (inFollowing) status = "not-following-back";
      else if (inFollowers) status = "follower";
      else status = defaultStatus;
      result.push({ ...u, status });
    };

    data.following.forEach((u) => add(u, "following"));
    data.followers.forEach((u) => add(u, "follower"));
    return result;
  }, [data]);

  const filtered = useMemo(() => {
    let list = allUsers;
    if (statusFilter !== "all") {
      list = list.filter((u) => u.status === statusFilter);
    }
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === "username") cmp = a.username.localeCompare(b.username);
      else if (sortField === "timestamp") cmp = a.timestamp - b.timestamp;
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [allUsers, statusFilter, sortField, sortDir]);

  // Reset page when filter/sort changes
  useEffect(() => { setPage(1); }, [statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  }

  function sortIcon(field: SortField) {
    if (sortField !== field) return <span className="ml-1 text-text-muted">↕</span>;
    return <span className="ml-1 text-indigo-400">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  const handleCopyOne = useCallback(async (username: string) => {
    try {
      await navigator.clipboard.writeText(username);
      show(`Copied @${username}`, "success");
    } catch {
      show("Failed to copy — please allow clipboard access.", "error");
    }
  }, [show]);

  const handleCopyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(filtered.map((u) => u.username).join("\n"));
      show(`Copied ${filtered.length} usernames!`, "success");
    } catch {
      show("Failed to copy — please allow clipboard access.", "error");
    }
  }, [filtered, show]);

  if (!data) return null;

  const STATUS_FILTERS: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: allUsers.length },
    { value: "mutual", label: "Mutual", count: data.mutual.length },
    { value: "not-following-back", label: "Not Following Back", count: data.notFollowingBack.length },
    { value: "follower", label: "Followers Only", count: data.onlyFollowers.length },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="animate-fade-up mb-7">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
            <Users size={24} />
          </div>
          <div>
            <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">All Users</h1>
            <p className="mt-1 text-[14px] text-text-muted">
              {allUsers.length} unique users across all lists
            </p>
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="animate-fade-up mb-5 flex flex-wrap gap-2 [animation-delay:40ms]">
        {STATUS_FILTERS.map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => { setStatusFilter(value); setPage(1); }}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all duration-150 ${
              statusFilter === value 
                ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400" 
                : "border-border-glass bg-bg-elevated text-text-secondary hover:bg-white/5 hover:text-text-primary"
            }`}
          >
            {label}{" "}
            <span className={`ml-1 rounded-full px-1.5 py-[1px] text-[11px] font-bold ${
              statusFilter === value ? "bg-indigo-500/20" : "bg-border-glass"
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="card animate-fade-up overflow-hidden [animation-delay:80ms]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border-glass px-5 py-4">
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            {/* View toggle */}
            <div className="flex gap-1 rounded-[10px] border border-border-glass bg-bg-slate p-1">
              {(["table", "grid"] as const).map((mode) => {
                const isActive = viewMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    aria-pressed={isActive}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg border-none px-3.5 py-1.5 text-[13px] transition-all duration-200 ${
                      isActive 
                        ? "bg-gradient-to-br from-accent-primary to-highlight font-semibold text-white shadow-[0_4px_12px_rgba(255,107,53,0.3)]" 
                        : "bg-transparent font-medium text-text-muted"
                    }`}
                  >
                    {mode === "table" ? <><LayoutList size={14} /> List</> : <><Grid size={14} /> Grid</>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => { downloadCSV(filtered, "all-users.csv"); show("CSV downloaded!", "success"); }}
              className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-[13px]"
            >
              <Download size={14} /> CSV
            </button>
            <button
              onClick={handleCopyAll}
              className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-[13px]"
            >
              <Copy size={14} /> Copy All
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={32} className="text-text-muted" />}
            title="No users found"
            description="Try a different filter."
          />
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border-glass">
                  {([
                    { field: "username" as SortField, label: "Username" },
                    { field: "status" as SortField, label: "Status" },
                    { field: "timestamp" as SortField, label: "Date Added" },
                  ]).map(({ field, label }) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      className="cursor-pointer select-none whitespace-nowrap px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.05em] text-text-muted"
                    >
                      {label} {sortIcon(field)}
                    </th>
                  ))}
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {paged.map((user, i) => (
                  <tr key={user.username} className="hover:border-l-2 hover:border-l-accent-primary hover:bg-white/5 border-b border-border-glass transition-all duration-150" style={{ animationDelay: `${i * 15}ms` }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
                          style={{ background: avatarColor(user.username) }}
                        >
                          {user.username[0]?.toUpperCase() ?? "?"}
                        </div>
                        <a
                          href={`https://www.instagram.com/${user.username}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] font-medium text-text-primary no-underline transition-colors duration-150 hover:text-indigo-400"
                        >
                          @{user.username}
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge status={user.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-text-muted">
                      {formatDate(user.timestamp)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleCopyOne(user.username)}
                        className="btn-secondary flex items-center gap-1 px-2.5 py-1 text-[12px] ml-auto"
                      >
                        <Copy size={12} /> Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-5">
            {paged.map((user, i) => (
              <div
                key={user.username}
                className="card animate-fade-up flex flex-col gap-2.5 p-3.5"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <div className="flex items-center gap-2.5">
                  <div 
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
                    style={{ background: avatarColor(user.username) }}
                  >
                    {user.username[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <a
                      href={`https://www.instagram.com/${user.username}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate whitespace-nowrap text-[13px] font-semibold text-text-primary no-underline transition-colors hover:text-indigo-400"
                    >
                      @{user.username}
                    </a>
                    <div className="text-[11px] text-text-muted">{formatDate(user.timestamp)}</div>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                  <Badge status={user.status} />
                  <button
                    onClick={() => handleCopyOne(user.username)}
                    className="btn-secondary flex items-center gap-1 px-2 py-0.5 text-[11px]"
                  >
                    <Copy size={11} /> Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
