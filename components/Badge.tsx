import type { FollowStatus } from "@/lib/types";

export default function Badge({ status }: { status: FollowStatus }) {
  let label = "";
  let className = "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-[0.06em] whitespace-nowrap border ";

  switch (status) {
    case "following":
      label = "Following";
      className += "bg-white/5 text-text-secondary border-white/10";
      break;
    case "follower":
      label = "Follower";
      className += "bg-highlight/10 text-highlight border-highlight/20";
      break;
    case "mutual":
      label = "Mutual";
      className += "bg-success/10 text-success border-success/20";
      break;
    case "not-following-back":
      label = "Not Following Back";
      className += "bg-accent-primary/10 text-accent-primary border-accent-primary/20 shadow-[0_0_10px_rgba(255,107,53,0.1)]";
      break;
  }

  return <span className={className}>{label}</span>;
}
