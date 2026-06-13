"use client";

import { useEffect, useState } from "react";
import { loadAnalytics } from "@/lib/storage";
import type { AnalyticsData } from "@/lib/types";
import StatCard from "@/components/StatCard";
import faqsData from "@/data/faqs.json";
import { Users, User, Handshake, AlertTriangle, ChevronDown } from "lucide-react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setData(loadAnalytics());
  }, []);

  if (!data) return null;

  const totalUsers = new Set([
    ...data.following.map((u) => u.username),
    ...data.followers.map((u) => u.username),
  ]).size;

  const followRatio = data.following.length > 0 
    ? (data.followers.length / data.following.length).toFixed(2)
    : "0";

  return (
    <div>
      <div className="animate-fade-up mb-10">
        <h1 className="mb-2 text-[32px] font-extrabold tracking-[-0.03em]">
          Dashboard Overview
        </h1>
        <div className="flex items-center gap-3 text-[15px] text-text-secondary">
          <span>Analysis complete</span>
          <span className="text-border-glass">•</span>
          <span>{totalUsers.toLocaleString()} unique accounts processed</span>
        </div>
      </div>

      <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        <div className="animate-fade-up">
          <StatCard
            title="Followers"
            value={data.followers.length}
            description="Accounts that follow your profile."
            href="/analytics/followers"
            icon={<Users size={28} className="text-accent-primary" />}
            trend={followRatio + "x ratio"}
            trendUp={parseFloat(followRatio) >= 1}
          />
        </div>
        <div className="animate-fade-up">
          <StatCard
            title="Following"
            value={data.following.length}
            description="Accounts you are currently following."
            href="/analytics/following"
            icon={<User size={28} className="text-accent-primary" />}
          />
        </div>
        <div className="animate-fade-up">
          <StatCard
            title="Not Following Back"
            value={data.notFollowingBack.length}
            description="Accounts you follow but don't follow you back."
            href="/analytics/not-following-back"
            icon={<AlertTriangle size={28} className="text-danger" />}
          />
        </div>
      </div>

      {/* FAQs Section */}
      <div className="mt-20 animate-fade-up flex flex-col items-center">
        <div className="w-full max-w-[800px]">
          <h2 className="mb-8 text-center text-[26px] font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-3">
          {faqsData.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div 
                key={i} 
                className={`card overflow-hidden transition-all duration-300 ${isOpen ? 'border-accent-primary/30 shadow-[0_8px_30px_rgba(255,107,53,0.1)]' : ''}`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left text-[16px] font-semibold text-text-primary focus:outline-none"
                >
                  {faq.question}
                  <ChevronDown 
                    size={20} 
                    className={`shrink-0 text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-accent-primary" : ""}`} 
                  />
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="m-0 px-5 pb-5 text-[15px] leading-relaxed text-text-secondary">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
