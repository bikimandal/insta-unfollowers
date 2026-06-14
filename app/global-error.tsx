"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-[#0B0E14] text-[#F3F4F6]">
        <div className="flex flex-col items-center p-6 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 text-red-500 shadow-[0_10px_30px_rgba(239,68,68,0.2)]">
            <AlertTriangle size={48} strokeWidth={1.5} />
          </div>
          <h2 className="mb-3 text-[32px] font-bold">Critical Error</h2>
          <p className="mb-8 max-w-[500px] text-lg text-gray-400">
            A critical error occurred in the application shell.
          </p>
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 rounded-xl bg-[#FF6B35] px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_10px_20px_rgba(255,107,53,0.3)] active:scale-95"
          >
            <RotateCcw size={18} /> Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
