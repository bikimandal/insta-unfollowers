import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  totalItems: number;
  pageSize: number;
}

export default function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null;

  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, totalItems);

  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderTop: "1px solid var(--border-glass)",
        flexWrap: "wrap",
        gap: 12,
        background: "rgba(15,23,42,0.3)",
      }}
    >
      {/* Item count */}
      <div style={{ fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
        <strong style={{ color: "var(--text-primary)" }}>{startIdx}–{endIdx}</strong>
        {" "}of{" "}
        <strong style={{ color: "var(--text-primary)" }}>{totalItems}</strong>
      </div>

      {/* Page buttons */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          style={{
            width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border-glass)",
            background: "var(--bg-surface)", color: "var(--text-secondary)",
            cursor: page === 1 ? "not-allowed" : "pointer",
            opacity: page === 1 ? 0.4 : 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {pageNums.map((p, i, arr) => (
          <React.Fragment key={p}>
            {i > 0 && p - arr[i - 1] > 1 && (
              <span style={{ color: "var(--text-muted)", fontSize: 13, padding: "0 2px" }}>…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              style={{
                minWidth: 34, height: 34, borderRadius: 8, border: "none", padding: "0 6px",
                background: p === page
                  ? "linear-gradient(135deg, var(--accent-primary), var(--highlight))"
                  : "transparent",
                color: p === page ? "white" : "var(--text-secondary)",
                fontWeight: p === page ? 700 : 400,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: p === page ? "0 3px 10px rgba(255,107,53,0.35)" : "none",
              }}
              onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.background = "transparent"; }}
            >
              {p}
            </button>
          </React.Fragment>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          style={{
            width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border-glass)",
            background: "var(--bg-surface)", color: "var(--text-secondary)",
            cursor: page === totalPages ? "not-allowed" : "pointer",
            opacity: page === totalPages ? 0.4 : 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
