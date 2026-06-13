"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearAnalytics } from "@/lib/storage";
import { BarChart2, User, Users, Handshake, AlertTriangle, Search, Menu, X } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/analytics", label: "Dashboard", icon: <BarChart2 size={16} /> },
  { href: "/analytics/following", label: "Following", icon: <User size={16} /> },
  { href: "/analytics/followers", label: "Followers", icon: <Users size={16} /> },
  { href: "/analytics/not-following-back", label: "Not Following Back", icon: <AlertTriangle size={16} /> },
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
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1280px] items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/analytics"
          className="flex items-center gap-3 no-underline"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-primary to-highlight text-lg shadow-[0_4px_15px_rgba(255,107,53,0.4)]">
            <BarChart2 size={20} color="white" strokeWidth={2.5} />
          </div>
          <span className="gradient-text text-[20px] font-extrabold tracking-[-0.03em]">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative py-2 text-[14px] font-semibold no-underline transition-colors duration-300 ${active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {item.label}
                {/* Underline animation */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 rounded-sm bg-gradient-to-r from-accent-primary to-highlight transition-all duration-300 group-hover:w-full ${active ? 'w-full' : 'w-0'}`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleClear}
            className="hidden lg:inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-[13px] font-semibold text-red-500 transition-all hover:bg-red-500/20 active:scale-95"
          >
            Clear Data
          </button>
          <Link 
            href="/" 
            className="hidden lg:inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-white/20 active:scale-95"
          >
            Upload New
          </Link>
          
          {/* Mobile Profile / Menu */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border-glass bg-bg-slate text-text-secondary transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Tabs */}
      <div className="flex gap-2 overflow-x-auto px-6 pb-3 lg:hidden [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold no-underline transition-all duration-200 ${
                active 
                  ? "bg-gradient-to-br from-accent-primary to-highlight text-white border-transparent" 
                  : "border border-border-glass bg-transparent text-text-secondary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      </header>

      {/* Full Screen Overlay Menu (Mobile) */}
      {menuOpen && (
        <div className="fixed inset-0 top-[70px] z-40 flex flex-col bg-slate-900/95 p-8 backdrop-blur-xl animate-fade-in lg:hidden">
          <div className="mt-auto flex flex-col gap-4 pb-8">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-5 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-white/20 active:scale-95"
            >
              Upload New Data
            </Link>
            <button
              onClick={handleClear}
              className="flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3.5 text-[15px] font-semibold text-red-500 transition-all hover:bg-red-500/20 active:scale-95"
            >
              Clear All Data
            </button>
          </div>
        </div>
      )}
    </>
  );
}
