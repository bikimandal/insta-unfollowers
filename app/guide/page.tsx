import { ArrowLeft, ExternalLink, Download, Smartphone, Settings, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

interface Step {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  images?: string[];
}

const steps: Step[] = [
  {
    icon: <ExternalLink size={24} />,
    title: "Open Accounts Center",
    description: (
      <>
        Go to the{" "}
        <a
          href="https://accountscenter.instagram.com/info_and_permissions/dyi/?theme=dark"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--highlight)", textDecoration: "underline", fontWeight: 600 }}
        >
          Download Your Information
        </a>{" "}
        page in the Instagram Accounts Center.
      </>
    ),
  },
  {
    icon: <Download size={24} />,
    title: "Create Export",
    description: (
      <>
        Click the blue <strong style={{ color: "var(--accent-primary)" }}>&apos;Create export&apos;</strong> button.
        Then select the Instagram account you want to analyze.
      </>
    ),
    images: ["/guide/img1.png"],
  },
  {
    icon: <Smartphone size={24} />,
    title: "Export to Device",
    description: (
      <>
        When asked where to export, choose the{" "}
        <strong style={{ color: "var(--accent-primary)" }}>&apos;Export to device&apos;</strong> option.
      </>
    ),
    images: ["/guide/img2.png"],
  },
  {
    icon: <Settings size={24} />,
    title: "Customize Information",
    description: (
      <>
        Choose <strong style={{ color: "var(--text-primary)" }}>&apos;Customize information&apos;</strong> instead
        of all available data. Under the Connections section, check ONLY the{" "}
        <strong style={{ color: "var(--highlight)" }}>&apos;Followers and following&apos;</strong> option.
      </>
    ),
    images: ["/guide/img3.png", "/guide/img4.png"],
  },
  {
    icon: <Calendar size={24} />,
    title: "Format & Date Range",
    description: (
      <>
        Set the Date Range to <strong style={{ color: "var(--highlight)" }}>&apos;All time&apos;</strong> and the
        Format to <strong style={{ color: "var(--highlight)" }}>&apos;JSON&apos;</strong>. Media quality does not
        matter.
      </>
    ),
    images: ["/guide/img5.png"],
  },
  {
    icon: <CheckCircle2 size={24} />,
    title: "Download & Upload",
    description: (
      <>
        Submit your request. Instagram will email you a link when your file is ready.{" "}
        <strong style={{ color: "var(--text-primary)" }}>
          Download it, unzip it, and drop the files onto our home page!
        </strong>
      </>
    ),
  },
];

export default function GuidePage() {
  return (
    <main style={{ minHeight: "100dvh", padding: "40px 24px", background: "var(--bg-dark)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", textDecoration: "none", marginBottom: 32, fontWeight: 500, transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.03em" }}>
          How to get your <span className="gradient-text">Instagram Data</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 48, lineHeight: 1.6 }}>
          Follow these exact steps to export your followers and following data in the correct JSON format.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              className="card animate-fade-up"
              style={{ padding: 32, display: "flex", gap: 24, alignItems: "flex-start", animationDelay: `${i * 100}ms` }}
            >
              <div
                style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(255,107,53,0.1), rgba(6,182,212,0.1))",
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent-primary)", flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "var(--highlight)", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
                  Step {i + 1}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
                  {step.title}
                </h2>
                <div style={{ fontSize: 17, color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6, fontWeight: 400 }}>
                  {step.description}
                </div>

                {step.images && step.images.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
                    {step.images.map((img, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={img}
                        alt={`Step ${i + 1} screenshot ${imgIdx + 1}`}
                        style={{ maxWidth: "100%", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="animate-fade-up" style={{ marginTop: 48, textAlign: "center", animationDelay: "600ms" }}>
          <Link href="/" className="btn-primary" style={{ padding: "16px 40px", fontSize: 18, display: "inline-block", borderRadius: 12 }}>
            I have my files ready →
          </Link>
        </div>
      </div>
    </main>
  );
}
