import type { FollowStatus } from "@/lib/types";

export default function Badge({ status }: { status: FollowStatus }) {
  let label = "";
  let className = "badge ";

  switch (status) {
    case "following":
      label = "Following You"; // this was 'Following', changing label
      className += "badge-following";
      label = "Following";
      break;
    case "follower":
      label = "Follower";
      className += "badge-follower";
      break;
    case "mutual":
      label = "Mutual";
      className += "badge-mutual";
      break;
    case "not-following-back":
      label = "Not Following Back";
      className += "badge-no-follow";
      break;
  }

  return <span className={className}>{label}</span>;
}
