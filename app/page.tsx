"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import { APP_ICON } from "@/lib/constants";
import { Users, Zap, Handshake, BarChart2, Download, Lock } from "lucide-react";

import faqData from "@/data/faqs.json";

const FEATURES = [
  { icon: <Zap size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "Find Who Ghosted You", desc: "Instantly see exactly who you are following that isn't following you back." },
  { icon: <Lock size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "100% Private & Secure", desc: "Your data never leaves your browser. No login or passwords required." },
  { icon: <Users size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "Follower Analytics", desc: "Get a complete breakdown of everyone who follows you and who you follow." },
  { icon: <Handshake size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "Mutual Connections", desc: "Discover shared followers and perfectly reciprocal relationships." },
  { icon: <Download size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "Export Anywhere", desc: "Download beautifully formatted CSV or TXT lists of any user segment." },
  { icon: <BarChart2 size={32} strokeWidth={1.5} className="text-accent-primary" />, title: "Rich Statistics", desc: "Visualize your entire Instagram network with comprehensive charts." },
];

export default function HomePage() {
  return (
    <main className="animate-bg-shift relative flex min-h-[100dvh] flex-col bg-gradient-to-br from-bg-dark via-bg-slate to-bg-dark bg-[length:200%_200%]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="animate-fade-up mb-8 flex justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 shadow-[0_20px_40px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl transition-transform duration-500 hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,107,53,0.2)]">
            <Image src={APP_ICON} alt="Ghosters" width={90} height={90} className="drop-shadow-[0_10px_20px_rgba(255,107,53,0.4)]" />
          </div>
        </div>

        <h1 className="animate-fade-up mb-6 text-[clamp(48px,8vw,72px)] font-extrabold leading-tight tracking-tight [animation-delay:40ms]">
          Stop Wondering <span className="gradient-text">Who's Ghosting You</span>
        </h1>

        <div className="animate-fade-up mx-auto mb-12 max-w-[680px] text-[clamp(18px,4vw,22px)] font-normal leading-relaxed text-text-secondary [animation-delay:60ms]">
          <p className="mb-5">
            See exactly who's not following you back in seconds. Deep analytics instantly, with zero risk to your account.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[15px] sm:text-[17px] font-medium text-text-primary">
            <span className="flex items-center gap-1.5"><span className="text-highlight font-bold">✓</span> <strong className="gradient-text text-[20px] sm:text-[22px] font-extrabold">100%</strong> Secure</span>
            <span className="hidden text-white/20 sm:inline">•</span>
            <span className="flex items-center gap-1.5"><span className="text-highlight font-bold">✓</span> <strong className="gradient-text text-[20px] sm:text-[22px] font-extrabold">100%</strong> Private</span>
            <span className="hidden text-white/20 sm:inline">•</span>
            <span className="flex items-center gap-1.5"><span className="text-highlight font-bold">✓</span> <strong className="gradient-text text-[20px] sm:text-[22px] font-extrabold">100%</strong> Local Processing</span>
          </div>
        </div>

        {/* Upload area */}
        <div className="animate-fade-up w-full [animation-delay:120ms]">
          <FileUpload />
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto w-full max-w-[1200px] px-6 py-20">
        <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
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

      {/* FAQ Section */}
      <section className="mx-auto w-full max-w-[800px] px-6 py-20">
        <h2 className="mb-10 text-center text-[clamp(32px,5vw,48px)] font-bold text-text-primary">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>
        <div className="flex flex-col gap-4">
          {faqData.map((faq, index) => (
            <details
              key={index}
              className="group overflow-hidden rounded-[16px] border border-border-glass bg-bg-surface backdrop-blur-md transition-all duration-300 hover:border-accent-primary/30"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-lg font-semibold text-text-primary focus:outline-none">
                {faq.question}
                <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-xl font-light text-accent-primary transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-[15px] leading-relaxed text-text-secondary">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
