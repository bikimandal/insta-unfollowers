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
    <Link href={href} className="block h-full text-inherit no-underline">
      <div className="card relative flex h-full flex-col gap-4 overflow-hidden p-7">
        <div className="flex items-start justify-between">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-border-glass bg-gradient-to-br from-accent-primary/10 to-highlight/10 text-[26px]">
            {icon}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-semibold ${
                trendUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}
            >
              <span className="text-base">{trendUp ? "↑" : "↓"}</span> {trend}
            </div>
          )}
        </div>

        <div>
          <div className="gradient-text mb-2 text-[56px] font-extrabold leading-none tracking-[-0.03em]">
            {value.toLocaleString()}
          </div>
          <h3 className="mb-1 text-lg font-semibold text-text-primary">
            {title}
          </h3>
          <p className="m-0 text-[14px] leading-relaxed text-text-secondary">
            {description}
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -bottom-5 -right-5 h-[100px] w-[100px] rounded-full bg-[radial-gradient(circle,var(--color-accent-primary)_0%,transparent_70%)] opacity-5 blur-[20px]" />
      </div>
    </Link>
  );
}
