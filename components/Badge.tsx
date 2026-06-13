import type { FollowStatus } from "@/lib/types";

export default function Badge({ status }: { status: FollowStatus }) {
  let label = "";
  let className = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.03em] whitespace-nowrap text-white ";

  switch (status) {
    case "following":
      label = "Following";
      className += "bg-accent-primary";
      break;
    case "follower":
      label = "Follower";
      className += "bg-highlight";
      break;
    case "mutual":
      label = "Mutual";
      className += "bg-success";
      break;
    case "not-following-back":
      label = "Not Following Back";
      className += "bg-danger";
      break;
  }

  return <span className={className}>{label}</span>;
}
