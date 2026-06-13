"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearAnalytics } from "@/lib/storage";
import { BarChart2, User, Users, Handshake, AlertTriangle, Search, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/analytics", label: "Dashboard", icon: <BarChart2 size={16} /> },
  { href: "/analytics/following", label: "Following", icon: <User size={16} /> },
  { href: "/analytics/followers", label: "Followers", icon: <Users size={16} /> },
  { href: "/analytics/mutual", label: "Mutual", icon: <Handshake size={16} /> },
  { href: "/analytics/not-following-back", label: "Not Following Back", icon: <AlertTriangle size={16} /> },
  { href: "/analytics/all-users", label: "All Users", icon: <Search size={16} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleClear() {
    if (confirm("Clear all data and return to home?")) {
      clearAnalytics();
      window.location.href = "/";
    }
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70,
        }}
      >
        {/* Logo */}
        <Link
          href="/analytics"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-primary), var(--highlight))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              boxShadow: "0 4px 15px rgba(255, 107, 53, 0.4)",
            }}
          >
            <BarChart2 size={20} color="white" strokeWidth={2.5} />
          </div>
          <span
            className="gradient-text"
            style={{
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.03em",
            }}
          >
            InstaAnalytics
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
          className="hidden-mobile"
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                style={{
                  position: "relative",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  transition: "color 0.3s ease",
                  padding: "8px 0",
                }}
              >
                {item.label}
                {/* Underline animation */}
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: active ? "100%" : "0%",
                    height: 2,
                    background: "linear-gradient(90deg, var(--accent-primary), var(--highlight))",
                    transition: "width 0.3s ease",
                    borderRadius: 2,
                  }}
                  className="nav-underline"
                />
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={handleClear}
            className="btn-secondary hidden-mobile"
            style={{ fontSize: 13, padding: "8px 16px" }}
          >
            Clear Data
          </button>
          <Link href="/" className="btn-primary hidden-mobile" style={{ fontSize: 13, padding: "8px 16px" }}>
            Upload New
          </Link>
          
          {/* Mobile Profile / Menu */}
          <div className="show-mobile" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-icon"
              aria-label="Toggle menu"
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--bg-slate)",
                  border: "1px solid var(--border-glass)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Tabs */}
      <div className="show-mobile" style={{ overflowX: "auto", padding: "0 24px 12px", display: "flex", gap: 8, scrollbarWidth: "none" }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flexShrink: 0,
                padding: "8px 16px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                color: active ? "white" : "var(--text-secondary)",
                background: active ? "linear-gradient(135deg, var(--accent-primary), var(--highlight))" : "transparent",
                border: active ? "none" : "1px solid var(--border-glass)",
                transition: "all 0.2s",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Full Screen Overlay Menu (Mobile) */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            top: 70, // Below header
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            padding: 32,
          }}
          className="animate-slide-in"
        >
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="btn-primary"
              style={{ justifyContent: "center" }}
            >
              Upload New Data
            </Link>
            <button
              onClick={handleClear}
              className="btn-secondary"
              style={{ justifyContent: "center" }}
            >
              Clear All Data
            </button>
          </div>
        </div>
      )}

      <style>{`
        .nav-link:hover .nav-underline { width: 100% !important; }
        .nav-link:hover { color: var(--text-primary) !important; }
        .show-mobile::-webkit-scrollbar { display: none; }
        
        @media (min-width: 992px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 991px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
