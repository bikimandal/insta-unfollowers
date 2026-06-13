import type { AnalyticsData } from "./types";

const STORAGE_KEY = "instainsights_data";

export function saveAnalytics(data: AnalyticsData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save analytics to localStorage:", err);
  }
}

export function loadAnalytics(): AnalyticsData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AnalyticsData;
  } catch {
    return null;
  }
}

export function clearAnalytics(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasAnalytics(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(STORAGE_KEY);
}
