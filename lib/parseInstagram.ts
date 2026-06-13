import type { RawInstagramEntry, RawInstagramFile, InstagramUser, AnalyticsData } from "./types";

/**
 * Extracts an array of InstagramUser from raw Instagram JSON export.
 * Handles both array format and { relationships_following: [...] } format.
 */
export function parseInstagramFile(raw: unknown): InstagramUser[] {
  if (!raw) return [];

  let entries: RawInstagramEntry[] = [];

  if (Array.isArray(raw)) {
    entries = raw as RawInstagramEntry[];
  } else if (typeof raw === "object" && raw !== null) {
    // Try common wrapper keys
    const obj = raw as Record<string, unknown>;
    const key = Object.keys(obj).find(
      (k) => Array.isArray(obj[k]) && (obj[k] as unknown[]).length > 0
    );
    if (key) {
      entries = obj[key] as RawInstagramEntry[];
    }
  }

  const users: InstagramUser[] = [];

  for (const entry of entries) {
    if (!entry?.string_list_data?.length) continue;
    for (const item of entry.string_list_data) {
      const username = item.value || entry.title;
      if (!username) continue;
      
      users.push({
        username: username,
        href: item.href ?? `https://www.instagram.com/${username}/`,
        timestamp: item.timestamp ?? 0,
      });
    }
  }

  return users;
}

/**
 * Builds a comprehensive analytics object from two sets of users.
 */
export function buildAnalytics(
  followingUsers: InstagramUser[],
  followerUsers: InstagramUser[]
): AnalyticsData {
  const followersSet = new Set(followerUsers.map((u) => u.username.toLowerCase()));
  const followingSet = new Set(followingUsers.map((u) => u.username.toLowerCase()));

  const mutual = followingUsers.filter((u) => followersSet.has(u.username.toLowerCase()));
  const notFollowingBack = followingUsers.filter((u) => !followersSet.has(u.username.toLowerCase()));
  const onlyFollowers = followerUsers.filter((u) => !followingSet.has(u.username.toLowerCase()));

  return {
    following: followingUsers,
    followers: followerUsers,
    mutual,
    notFollowingBack,
    onlyFollowers,
    processedAt: Date.now(),
  };
}

/**
 * Reads a File as JSON, returns parsed object or throws.
 */
export async function readFileAsJSON(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target?.result as string));
      } catch {
        reject(new Error(`Failed to parse JSON from "${file.name}"`));
      }
    };
    reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
    reader.readAsText(file);
  });
}

/**
 * Formats a Unix timestamp to a readable date string.
 */
export function formatDate(ts: number): string {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Creates and triggers a CSV download from an array of InstagramUser.
 */
export function downloadCSV(users: InstagramUser[], filename: string) {
  const header = "Username,Profile URL,Date Added\n";
  const rows = users
    .map((u) => `"${u.username}","${u.href}","${formatDate(u.timestamp)}"`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a plain-text list of usernames.
 */
export function downloadTXT(users: InstagramUser[], filename: string) {
  const content = users.map((u) => u.username).join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
