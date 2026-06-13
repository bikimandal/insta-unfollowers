"use client";

import FileUpload from "@/components/FileUpload";
import Link from "next/link";
import { useEffect, useState } from "react";
import { hasAnalytics } from "@/lib/storage";
import { Users, Zap, Handshake, BarChart2, Download, Lock } from "lucide-react";

const FEATURES = [
  { icon: <Users size={32} strokeWidth={1.5} color="var(--accent-primary)" />, title: "Follower Analysis", desc: "See exactly who follows you and who you follow back." },
  { icon: <Zap size={32} strokeWidth={1.5} color="var(--accent-primary)" />, title: "Non-Reciprocal Finds", desc: "Quickly identify accounts you follow that don't follow back." },
  { icon: <Handshake size={32} strokeWidth={1.5} color="var(--accent-primary)" />, title: "Mutual Connections", desc: "Discover shared followers and mutual relationships." },
  { icon: <BarChart2 size={32} strokeWidth={1.5} color="var(--accent-primary)" />, title: "Detailed Stats", desc: "Rich charts and statistics about your Instagram network." },
  { icon: <Download size={32} strokeWidth={1.5} color="var(--accent-primary)" />, title: "Export Data", desc: "Download CSV or TXT lists of any user group." },
  { icon: <Lock size={32} strokeWidth={1.5} color="var(--accent-primary)" />, title: "100% Private", desc: "Your data never leaves your browser — fully client-side." },
];

export default function HomePage() {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    setHasData(hasAnalytics());
  }, []);

  return (
    <main
      className="animate-bg-shift"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "linear-gradient(120deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        backgroundSize: "200% 200%",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: 70,
          background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/guide" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            How to Export
          </Link>
          {hasData && (
            <Link
              href="/analytics"
              className="btn-primary"
              style={{ fontSize: 14, padding: "10px 20px" }}
            >
              View Analytics →
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h1
          className="animate-fade-up"
          style={{
            fontSize: "clamp(48px, 8vw, 72px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            marginBottom: 24,
          }}
        >
          Master Your{" "}
          <span className="gradient-text">
            Instagram Network
          </span>
        </h1>

        <p
          className="animate-fade-up"
          style={{
            fontSize: "clamp(18px, 4vw, 22px)",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: 680,
            margin: "0 auto 48px",
            animationDelay: "60ms",
            fontWeight: 400,
          }}
        >
          Instantly discover who isn't following you back, find mutual connections, 
          and explore deep analytics. 100% secure and runs locally in your browser.
        </p>

        {/* Upload area */}
        <div className="animate-fade-up w-full" style={{ animationDelay: "120ms" }}>
          <FileUpload />
        </div>
      </section>

      {/* Features grid */}
      <section
        style={{
          padding: "80px 24px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          className="stagger"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="card animate-fade-up"
              style={{ padding: "32px", animationDelay: `${i * 60}ms` }}
            >
              <div
                style={{
                  fontSize: 32,
                  marginBottom: 20,
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(255,107,53,0.1), rgba(6,182,212,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 10,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
