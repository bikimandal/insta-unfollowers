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
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-glass bg-slate-900/30 px-5 py-3.5">
      {/* Item count */}
      <div className="whitespace-nowrap text-[13px] text-text-secondary">
        <strong className="text-text-primary">{startIdx}–{endIdx}</strong>
        {" "}of{" "}
        <strong className="text-text-primary">{totalItems}</strong>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border-glass bg-bg-surface text-text-secondary transition-all duration-150 ${page === 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-white/5 hover:text-text-primary'}`}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {pageNums.map((p, i, arr) => (
          <React.Fragment key={p}>
            {i > 0 && p - arr[i - 1] > 1 && (
              <span className="px-0.5 text-[13px] text-text-muted">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-1.5 text-[13px] transition-all duration-150 ${p === page ? 'bg-gradient-to-br from-accent-primary to-highlight font-bold text-white shadow-[0_3px_10px_rgba(255,107,53,0.35)]' : 'bg-transparent font-normal text-text-secondary hover:bg-white/5 hover:text-text-primary'}`}
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
          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border-glass bg-bg-surface text-text-secondary transition-all duration-150 ${page === totalPages ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-white/5 hover:text-text-primary'}`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
