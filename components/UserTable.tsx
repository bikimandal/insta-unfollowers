"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { InstagramUser, FollowStatus, SortField, SortDirection } from "@/lib/types";
import Badge from "./Badge";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import { formatDate, downloadCSV, downloadTXT } from "@/lib/parseInstagram";
import { useToast } from "./Toast";
import { ArrowDownUp, ArrowUp, ArrowDown, LayoutList, Grid, Copy, Download } from "lucide-react";
import type { ReactNode } from "react";

const PAGE_SIZE = 50;

interface UserTableProps {
  users: InstagramUser[];
  status: FollowStatus;
  showExport?: boolean;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function UserTable({
  users,
  status,
  showExport = true,
  emptyIcon = <ArrowDownUp size={32} />,
  emptyTitle = "No users found",
  emptyDescription = "No data available.",
}: UserTableProps) {
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const { show, ToastContainer } = useToast();

  // Reset page when users prop changes
  useEffect(() => { setPage(1); }, [users]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("instainsights_visited");
      if (stored) setVisited(new Set(JSON.parse(stored)));
    } catch { /* ignore */ }
  }, []);

  const handleVisit = useCallback((username: string) => {
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(username);
      try {
        localStorage.setItem("instainsights_visited", JSON.stringify(Array.from(next)));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const sorted = useMemo(() => {
    return [...users].sort((a, b) => {
      let cmp = 0;
      if (sortField === "username") cmp = a.username.localeCompare(b.username);
      else if (sortField === "timestamp") cmp = a.timestamp - b.timestamp;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [users, sortField, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  function sortIcon(field: SortField) {
    if (sortField !== field) return <ArrowDownUp size={14} className="ml-1 inline-block text-text-muted align-middle" />;
    return sortDir === "asc"
      ? <ArrowUp size={14} className="ml-1 inline-block text-indigo-400 align-middle" />
      : <ArrowDown size={14} className="ml-1 inline-block text-indigo-400 align-middle" />;
  }

  async function handleCopyAll() {
    const text = sorted.map((u) => u.username).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      show(`Copied ${sorted.length} usernames!`, "success");
    } catch {
      show("Failed to copy — please allow clipboard access.", "error");
    }
  }

  function handleCSV() {
    downloadCSV(sorted, `${status}-users.csv`);
    show("CSV downloaded!", "success");
  }

  function handleTXT() {
    downloadTXT(sorted, `${status}-users.txt`);
    show("TXT downloaded!", "success");
  }

  async function handleCopyOne(username: string) {
    try {
      await navigator.clipboard.writeText(username);
      show(`Copied @${username}`, "success");
    } catch {
      show("Failed to copy — please allow clipboard access.", "error");
    }
  }

  function avatarColor(username: string) {
    return `hsl(${(username.charCodeAt(0) * 40) % 360}, 60%, 30%)`;
  }

  return (
    <div>
      <ToastContainer />
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

          {showExport && (
            <>
              <button onClick={handleCopyAll} className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-[13px]">
                <Copy size={14} /> Copy All
              </button>
              <button onClick={handleCSV} className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-[13px]">
                <Download size={14} /> CSV
              </button>
              <button onClick={handleTXT} className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-[13px]">
                <Download size={14} /> TXT
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {sorted.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border-glass">
                {([
                  { field: "username" as SortField, label: "Username" },
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
                <th className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.05em] text-text-muted">
                  Status
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((user, i) => {
                const isWarning = status === "not-following-back";
                const isVisited = visited.has(user.username);
                
                return (
                  <tr
                    key={user.username}
                    className={`border-b border-border-glass transition-all duration-150 ${
                      isVisited 
                        ? "border-l-4 border-l-success bg-success/10 hover:bg-success/20" 
                        : isWarning 
                          ? "border-l-4 border-l-danger hover:border-l-danger hover:bg-danger/5" 
                          : "hover:border-l-2 hover:border-l-accent-primary hover:bg-white/5"
                    }`}
                    style={{ animationDelay: `${i * 15}ms` }}
                  >
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
                          onClick={() => handleVisit(user.username)}
                          className="text-[14px] font-medium text-text-primary no-underline transition-colors duration-150 hover:text-indigo-400"
                        >
                          @{user.username}
                        </a>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-text-muted">
                      {formatDate(user.timestamp)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge status={status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleCopyOne(user.username)}
                          className="btn-secondary flex items-center gap-1 px-2.5 py-1 text-[12px]"
                        >
                          <Copy size={12} /> Copy
                        </button>
                        <a
                          href={`https://www.instagram.com/${user.username}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleVisit(user.username)}
                          className="btn-primary flex items-center gap-1 px-2.5 py-1 text-[12px]"
                        >
                          Visit
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-5">
          {paged.map((user, i) => {
            const isWarning = status === "not-following-back";
            const isVisited = visited.has(user.username);
            
            return (
              <div
                key={user.username}
                className={`card animate-fade-up flex flex-col gap-2.5 p-4 ${
                  isVisited 
                    ? "border-l-4 border-l-success border-success/30 bg-success/10 hover:border-success hover:bg-success/20" 
                    : isWarning 
                      ? "border-l-4 border-l-danger hover:border-l-danger hover:bg-danger/20 hover:shadow-[0_25px_50px_-12px_rgba(239,68,68,0.2)]" 
                      : ""
                }`}
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <div className="flex items-center gap-2.5">
                  <div 
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                    style={{ background: avatarColor(user.username) }}
                  >
                    {user.username[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <a
                      href={`https://www.instagram.com/${user.username}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleVisit(user.username)}
                      className="block truncate whitespace-nowrap text-[14px] font-semibold text-text-primary no-underline transition-colors hover:text-indigo-400"
                    >
                      @{user.username}
                    </a>
                    <div className="text-[11px] text-text-muted">{formatDate(user.timestamp)}</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                  <Badge status={status} />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleCopyOne(user.username)}
                      className="btn-secondary flex items-center gap-1 px-2 py-1 text-[11px]"
                    >
                      <Copy size={11} /> Copy
                    </button>
                    <a
                      href={`https://www.instagram.com/${user.username}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleVisit(user.username)}
                      className="btn-primary flex items-center gap-1 px-2 py-1 text-[11px]"
                    >
                      Visit
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={sorted.length} pageSize={PAGE_SIZE} />
    </div>
  );
}
