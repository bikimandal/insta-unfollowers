"use client";

import Link from "next/link";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import { Users, Zap, Handshake, BarChart2, Download, Lock } from "lucide-react";

const FEATURES = [
  { icon: <Users size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "Follower Analysis", desc: "See exactly who follows you and who you follow back." },
  { icon: <Zap size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "Non-Reciprocal Finds", desc: "Quickly identify accounts you follow that don't follow back." },
  { icon: <Handshake size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "Mutual Connections", desc: "Discover shared followers and mutual relationships." },
  { icon: <BarChart2 size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "Detailed Stats", desc: "Rich charts and statistics about your Instagram network." },
  { icon: <Download size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "Export Data", desc: "Download CSV or TXT lists of any user group." },
  { icon: <Lock size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "100% Private", desc: "Your data never leaves your browser — fully client-side." },
];

export default function HomePage() {
  return (
    <main className="animate-bg-shift relative flex min-h-[100dvh] flex-col bg-gradient-to-br from-bg-dark via-bg-slate to-bg-dark bg-[length:200%_200%]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="animate-fade-up mb-6 text-[clamp(48px,8vw,72px)] font-extrabold leading-tight tracking-tight">
          Master Your <span className="gradient-text">Instagram Network</span>
        </h1>

        <p className="animate-fade-up mx-auto mb-12 max-w-[680px] text-[clamp(18px,4vw,22px)] font-normal leading-relaxed text-text-secondary [animation-delay:60ms]">
          Instantly discover who isn't following you back, find mutual connections, 
          and explore deep analytics. 100% secure and runs locally in your browser.
        </p>

        {/* Upload area */}
        <div className="animate-fade-up w-full [animation-delay:120ms]">
          <FileUpload />
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto w-full max-w-[1200px] px-6 py-20">
        <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="card animate-fade-up p-8"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-br from-accent-primary/10 to-highlight/10 text-3xl">
                {f.icon}
              </div>
              <h3 className="mb-2.5 text-lg font-bold text-text-primary">
                {f.title}
              </h3>
              <p className="m-0 text-[15px] leading-relaxed text-text-secondary">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
