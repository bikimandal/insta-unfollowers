"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 text-red-500 shadow-[0_10px_30px_rgba(239,68,68,0.2)]">
        <AlertTriangle size={48} strokeWidth={1.5} />
      </div>
      <h2 className="mb-3 text-[32px] font-bold text-text-primary">Something went wrong!</h2>
      <p className="mb-8 max-w-[500px] text-lg text-text-secondary">
        We encountered an unexpected error while processing your request. Don't worry, your data is safe.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-xl bg-accent-primary px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_10px_20px_rgba(255,107,53,0.3)] active:scale-95"
        >
          <RotateCcw size={18} /> Try again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-text-primary transition-colors hover:bg-white/10 active:scale-95"
        >
          <Home size={18} /> Go home
        </Link>
      </div>
    </div>
  );
}
