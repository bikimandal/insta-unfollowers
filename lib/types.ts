// Types for Instagram export data and processed analytics

export interface InstagramUser {
  username: string;
  href: string;
  timestamp: number;
}

export type FollowStatus = "following" | "follower" | "mutual" | "not-following-back";

export interface ProcessedUser extends InstagramUser {
  status: FollowStatus;
}

export interface AnalyticsData {
  following: InstagramUser[];
  followers: InstagramUser[];
  mutual: InstagramUser[];
  notFollowingBack: InstagramUser[];
  onlyFollowers: InstagramUser[];
  processedAt: number;
}

export interface Stats {
  totalFollowing: number;
  totalFollowers: number;
  mutual: number;
  notFollowingBack: number;
  onlyFollowers: number;
}

// Raw Instagram export shapes
export interface RawInstagramEntry {
  title?: string;
  string_list_data: Array<{
    href: string;
    value: string;
    timestamp: number;
  }>;
}

export type RawInstagramFile = RawInstagramEntry[] | { relationships_following: RawInstagramEntry[] };

export type SortField = "username" | "timestamp" | "status";
export type SortDirection = "asc" | "desc";
export type FilterStatus = "all" | "following" | "follower" | "mutual" | "not-following-back";
