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
    if (sortField !== field) return <span style={{ color: "var(--text-muted)", marginLeft: 4 }}>↕</span>;
    return <span style={{ color: "#818cf8", marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
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
      <div className="animate-fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
            <Users size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>All Users</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "4px 0 0" }}>
              {allUsers.length} unique users across all lists
            </p>
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="animate-fade-up" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", animationDelay: "40ms" }}>
        {STATUS_FILTERS.map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => { setStatusFilter(value); setPage(1); }}
            style={{
              padding: "7px 16px", borderRadius: 999, border: "1px solid", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              borderColor: statusFilter === value ? "rgba(99,102,241,0.5)" : "var(--bg-border)",
              background: statusFilter === value ? "rgba(99,102,241,0.12)" : "var(--bg-elevated)",
              color: statusFilter === value ? "#818cf8" : "var(--text-secondary)",
            }}
          >
            {label}{" "}
            <span style={{ background: statusFilter === value ? "rgba(99,102,241,0.2)" : "var(--bg-border)", padding: "1px 7px", borderRadius: 999, fontSize: 11, fontWeight: 700, marginLeft: 4 }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="card animate-fade-up" style={{ animationDelay: "80ms", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "16px 20px", borderBottom: "1px solid var(--bg-border)" }}>
          <div style={{ display: "flex", gap: 6, marginLeft: "auto", flexWrap: "wrap", alignItems: "center" }}>
            {/* View toggle */}
            <div style={{ display: "flex", background: "var(--bg-slate)", border: "1px solid var(--border-glass)", borderRadius: 10, padding: 4, gap: 4 }}>
              {(["table", "grid"] as const).map((mode) => {
                const isActive = viewMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    aria-pressed={isActive}
                    style={{
                      padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 13, cursor: "pointer",
                      background: isActive ? "linear-gradient(135deg, var(--accent-primary), var(--highlight))" : "transparent",
                      color: isActive ? "white" : "var(--text-muted)",
                      fontWeight: isActive ? 600 : 500,
                      boxShadow: isActive ? "0 4px 12px rgba(255, 107, 53, 0.3)" : "none",
                      transition: "all 0.2s ease",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    {mode === "table" ? <><LayoutList size={14} /> List</> : <><Grid size={14} /> Grid</>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => { downloadCSV(filtered, "all-users.csv"); show("CSV downloaded!", "success"); }}
              className="btn-secondary"
              style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
            >
              <Download size={14} /> CSV
            </button>
            <button
              onClick={handleCopyAll}
              className="btn-secondary"
              style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
            >
              <Copy size={14} /> Copy All
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={32} color="var(--text-muted)" />}
            title="No users found"
            description="Try a different filter."
          />
        ) : viewMode === "table" ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--bg-border)" }}>
                  {([
                    { field: "username" as SortField, label: "Username" },
                    { field: "status" as SortField, label: "Status" },
                    { field: "timestamp" as SortField, label: "Date Added" },
                  ]).map(({ field, label }) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
                    >
                      {label} {sortIcon(field)}
                    </th>
                  ))}
                  <th style={{ padding: "12px 20px" }} />
                </tr>
              </thead>
              <tbody>
                {paged.map((user, i) => (
                  <tr key={user.username} className="table-row" style={{ animationDelay: `${i * 15}ms` }}>
                    <td style={{ padding: "13px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: avatarColor(user.username), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>
                          {user.username[0]?.toUpperCase() ?? "?"}
                        </div>
                        <a
                          href={`https://www.instagram.com/${user.username}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#818cf8")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                        >
                          @{user.username}
                        </a>
                      </div>
                    </td>
                    <td style={{ padding: "13px 20px" }}>
                      <Badge status={user.status} />
                    </td>
                    <td style={{ padding: "13px 20px", fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {formatDate(user.timestamp)}
                    </td>
                    <td style={{ padding: "13px 20px", textAlign: "right" }}>
                      <button
                        onClick={() => handleCopyOne(user.username)}
                        className="btn-secondary"
                        style={{ fontSize: 12, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, padding: 20 }}>
            {paged.map((user, i) => (
              <div
                key={user.username}
                className="card animate-fade-up"
                style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10, animationDelay: `${i * 20}ms` }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: avatarColor(user.username), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>
                    {user.username[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <a
                      href={`https://www.instagram.com/${user.username}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: 13, textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      @{user.username}
                    </a>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatDate(user.timestamp)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <Badge status={user.status} />
                  <button
                    onClick={() => handleCopyOne(user.username)}
                    className="btn-secondary"
                    style={{ fontSize: 11, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}
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
