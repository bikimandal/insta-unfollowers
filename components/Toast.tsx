"use client";

import { useEffect, useRef, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  const colors = {
    success: { bg: "bg-success/10", border: "border-success/30", icon: "✓", color: "text-success" },
    error: { bg: "bg-danger/10", border: "border-danger/30", icon: "✕", color: "text-danger" },
    info: { bg: "bg-accent-primary/10", border: "border-accent-primary/30", icon: "ℹ", color: "text-accent-primary" },
  };
  const c = colors[type];

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`animate-toast-in fixed bottom-6 right-6 z-[9999] flex min-w-[260px] max-w-[400px] items-center gap-3 rounded-xl border bg-bg-surface px-[18px] py-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${c.border}`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${c.bg} ${c.color}`}
      >
        {c.icon}
      </span>
      <span className="flex-1 text-[14px] text-text-primary">{message}</span>
      <button
        onClick={onClose}
        className="cursor-pointer border-none bg-transparent p-0.5 text-base leading-none text-text-muted transition-colors hover:text-text-primary"
      >
        ✕
      </button>
    </div>
  );
}

// Hook to imperatively show toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: "success" | "error" | "info" }>>([]);
  const counter = useRef(0);

  function show(message: string, type: "success" | "error" | "info" = "success") {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function ToastContainer() {
    return (
      <>
        {toasts.map((t, i) => (
          <div key={t.id} style={{ transform: `translateY(${-i * 64}px)`, transition: "transform 0.2s" }}>
            <Toast message={t.message} type={t.type} onClose={() => dismiss(t.id)} />
          </div>
        ))}
      </>
    );
  }

  return { show, ToastContainer };
}
