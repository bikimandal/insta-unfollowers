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
    if (sortField !== field) return <ArrowDownUp size={14} style={{ color: "var(--text-muted)", marginLeft: 4, verticalAlign: "middle" }} />;
    return sortDir === "asc"
      ? <ArrowUp size={14} style={{ color: "#818cf8", marginLeft: 4, verticalAlign: "middle" }} />
      : <ArrowDown size={14} style={{ color: "#818cf8", marginLeft: 4, verticalAlign: "middle" }} />;
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

          {showExport && (
            <>
              <button onClick={handleCopyAll} className="btn-secondary" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <Copy size={14} /> Copy All
              </button>
              <button onClick={handleCSV} className="btn-secondary" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <Download size={14} /> CSV
              </button>
              <button onClick={handleTXT} className="btn-secondary" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
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
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--bg-border)" }}>
                {([
                  { field: "username" as SortField, label: "Username" },
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
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Status
                </th>
                <th style={{ padding: "12px 20px" }} />
              </tr>
            </thead>
            <tbody>
              {paged.map((user, i) => (
                <tr
                  key={user.username}
                  className={`table-row ${status === "not-following-back" ? "warning-row" : ""} ${visited.has(user.username) ? "visited-row" : ""}`}
                  style={{ animationDelay: `${i * 15}ms` }}
                >
                  <td style={{ padding: "13px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: avatarColor(user.username), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>
                        {user.username[0]?.toUpperCase() ?? "?"}
                      </div>
                      <a
                        href={`https://www.instagram.com/${user.username}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleVisit(user.username)}
                        style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#818cf8")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                      >
                        @{user.username}
                      </a>
                    </div>
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {formatDate(user.timestamp)}
                  </td>
                  <td style={{ padding: "13px 20px" }}>
                    <Badge status={status} />
                  </td>
                  <td style={{ padding: "13px 20px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button
                        onClick={() => handleCopyOne(user.username)}
                        className="btn-secondary"
                        style={{ fontSize: 12, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Copy size={12} /> Copy
                      </button>
                      <a
                        href={`https://www.instagram.com/${user.username}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleVisit(user.username)}
                        className="btn-primary"
                        style={{ fontSize: 12, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        Visit
                      </a>
                    </div>
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
              className={`card animate-fade-up ${status === "not-following-back" ? "warning-card" : ""} ${visited.has(user.username) ? "visited-card" : ""}`}
              style={{ padding: "16px", animationDelay: `${i * 20}ms`, display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: avatarColor(user.username), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white", flexShrink: 0 }}>
                  {user.username[0]?.toUpperCase() ?? "?"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <a
                    href={`https://www.instagram.com/${user.username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleVisit(user.username)}
                    style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    @{user.username}
                  </a>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatDate(user.timestamp)}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <Badge status={status} />
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleCopyOne(user.username)}
                    className="btn-secondary"
                    style={{ fontSize: 11, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Copy size={11} /> Copy
                  </button>
                  <a
                    href={`https://www.instagram.com/${user.username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleVisit(user.username)}
                    className="btn-primary"
                    style={{ fontSize: 11, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    Visit
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={sorted.length} pageSize={PAGE_SIZE} />
    </div>
  );
}
