import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  href: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({
  title,
  value,
  description,
  href,
  icon,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        className="card"
        style={{
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "linear-gradient(135deg, rgba(255,107,53,0.1), rgba(6,182,212,0.1))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              border: "1px solid var(--border-glass)",
            }}
          >
            {icon}
          </div>
          {trend && (
            <div
              style={{
                padding: "4px 10px",
                borderRadius: 999,
                background: trendUp ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                color: trendUp ? "var(--success)" : "var(--danger)",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {trendUp ? <span style={{ fontSize: 16 }}>↑</span> : <span style={{ fontSize: 16 }}>↓</span>} {trend}
            </div>
          )}
        </div>

        <div>
          <div
            className="gradient-text"
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1,
              marginBottom: 8,
              letterSpacing: "-0.03em",
            }}
          >
            {value.toLocaleString()}
          </div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 4px",
            }}
          >
            {title}
          </h3>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {description}
          </p>
        </div>

        {/* Decorative background glow */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: -20,
            width: 100,
            height: 100,
            background: "radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)",
            opacity: 0.05,
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />
      </div>
    </Link>
  );
}
