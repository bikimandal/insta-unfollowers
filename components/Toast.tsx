"use client";

import { useEffect, useRef, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  const colors = {
    success: { bg: "var(--success-light)", border: "rgba(16,185,129,0.3)", icon: "✓", color: "#34d399" },
    error: { bg: "var(--danger-light)", border: "rgba(239,68,68,0.3)", icon: "✕", color: "#f87171" },
    info: { bg: "var(--primary-light)", border: "rgba(99,102,241,0.3)", icon: "ℹ", color: "#818cf8" },
  };
  const c = colors[type];

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="animate-toast-in"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: "var(--bg-surface)",
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        minWidth: 260,
        maxWidth: 400,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: c.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          color: c.color,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {c.icon}
      </span>
      <span style={{ fontSize: 14, color: "var(--text-primary)", flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          fontSize: 16,
          padding: 2,
          lineHeight: 1,
        }}
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
