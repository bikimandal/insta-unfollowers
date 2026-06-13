"use client";

import { useCallback, useRef, useState } from "react";
import { readFileAsJSON, parseInstagramFile, buildAnalytics } from "@/lib/parseInstagram";
import { saveAnalytics } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadCloud, CheckCircle, AlertTriangle, FileJson, Users, User } from "lucide-react";

type UploadState = "idle" | "dragging" | "processing" | "success" | "error";

/** Classifies a file into "following", "followers", or null based on its name. */
function classifyFile(file: File): "following" | "followers" | null {
  const name = file.name.toLowerCase();
  // "follower" must come before "following" to avoid false match
  if (name.includes("follower") && !name.includes("following")) return "followers";
  if (name.includes("following") || name.includes("follow")) return "following";
  return null;
}

export default function FileUpload() {
  const router = useRouter();
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<{ step: string; pct: number } | null>(null);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const followingInputRef = useRef<HTMLInputElement>(null);
  const followersInputRef = useRef<HTMLInputElement>(null);

  // Use refs for the "pending" files so callbacks always read the latest value
  // without being recreated on every render.
  const pendingFollowingRef = useRef<File | null>(null);
  const pendingFollowersRef = useRef<File | null>(null);

  // Mirror refs into state so the UI can react to them
  const [pendingFollowing, _setPendingFollowing] = useState<File | null>(null);
  const [pendingFollowers, _setPendingFollowers] = useState<File | null>(null);

  function setPendingFollowing(f: File | null) {
    pendingFollowingRef.current = f;
    _setPendingFollowing(f);
  }
  function setPendingFollowers(f: File | null) {
    pendingFollowersRef.current = f;
    _setPendingFollowers(f);
  }

  async function processFiles(followingFile: File | null, followersFile: File | null) {
    if (!followingFile && !followersFile) {
      setError("Please upload at least one file (followers.json or following.json).");
      setState("error");
      return;
    }

    setState("processing");
    setError("");

    try {
      setProgress({ step: "Reading files…", pct: 10 });
      await new Promise((r) => setTimeout(r, 200));

      let followingUsers: ReturnType<typeof parseInstagramFile> = [];
      let followerUsers: ReturnType<typeof parseInstagramFile> = [];

      if (followingFile) {
        setProgress({ step: "Parsing following.json…", pct: 30 });
        const raw = await readFileAsJSON(followingFile);
        followingUsers = parseInstagramFile(raw);
      }

      if (followersFile) {
        setProgress({ step: "Parsing followers.json…", pct: 55 });
        const raw = await readFileAsJSON(followersFile);
        followerUsers = parseInstagramFile(raw);
      }

      setProgress({ step: "Building analytics…", pct: 80 });
      await new Promise((r) => setTimeout(r, 200));

      const analytics = buildAnalytics(followingUsers, followerUsers);
      saveAnalytics(analytics);

      setProgress({ step: "Done!", pct: 100 });
      await new Promise((r) => setTimeout(r, 400));

      setState("success");
      setTimeout(() => router.push("/analytics"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error processing files.");
      setState("error");
      setProgress(null);
    }
  }

  /** Merges a list of dropped/selected files into the current pending state. */
  function mergeFiles(files: File[]): { following: File | null; followers: File | null } {
    let newFollowing = pendingFollowingRef.current;
    let newFollowers = pendingFollowersRef.current;

    for (const f of files) {
      const type = classifyFile(f);
      if (type === "following") newFollowing = f;
      else if (type === "followers") newFollowers = f;
      else {
        // Unrecognised name — fill whichever slot is empty
        if (!newFollowing) newFollowing = f;
        else if (!newFollowers) newFollowers = f;
      }
    }
    return { following: newFollowing, followers: newFollowers };
  }

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setState("idle");
    const files = Array.from(e.dataTransfer.files).filter((f) => f.name.endsWith(".json"));
    if (!files.length) {
      setError("Please drop JSON files only.");
      setState("error");
      return;
    }

    const { following, followers } = mergeFiles(files);
    setPendingFollowing(following);
    setPendingFollowers(followers);

    if (following && followers) {
      await processFiles(following, followers);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onMainFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((f) => f.name.endsWith(".json"));
    e.target.value = ""; // Reset so the same files can be re-selected
    if (!files.length) return;

    const { following, followers } = mergeFiles(files);
    setPendingFollowing(following);
    setPendingFollowers(followers);

    if (following && followers) {
      await processFiles(following, followers);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "following" | "followers") => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;
    if (type === "following") setPendingFollowing(file);
    else setPendingFollowers(file);
  };

  async function handleAnalyze() {
    await processFiles(pendingFollowingRef.current, pendingFollowersRef.current);
  }

  const isDragging = state === "dragging";
  const fileCount = [pendingFollowing, pendingFollowers].filter(Boolean).length;

  return (
    <div style={{ width: "100%", maxWidth: 680, margin: "0 auto" }}>
      {/* Drop zone */}
      <div
        className={`upload-zone${isDragging ? " drag-over" : ""} animate-fade-up`}
        style={{
          padding: "60px 32px",
          textAlign: "center",
          cursor: "pointer",
          position: "relative",
          animation: isDragging ? "none" : "borderCycle 4s linear infinite, pulseUpload 4s infinite ease-in-out",
        }}
        onDragEnter={(e) => { e.preventDefault(); setState("dragging"); }}
        onDragOver={(e) => { e.preventDefault(); setState("dragging"); }}
        onDragLeave={(e) => { e.preventDefault(); setState("idle"); }}
        onDrop={onDrop}
        onClick={() => { if (state !== "processing") mainInputRef.current?.click(); }}
        role="button"
        aria-label="File upload area"
      >
        {state === "processing" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 72, height: 72, borderRadius: "50%",
                border: "4px solid rgba(255,107,53,0.2)",
                borderTopColor: "var(--accent-primary)",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>
                {progress?.step}
              </div>
              <div style={{ width: 300, height: 8, background: "var(--bg-slate)", borderRadius: 999, overflow: "hidden", margin: "0 auto", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)" }}>
                <div style={{ height: "100%", width: `${progress?.pct ?? 0}%`, background: "linear-gradient(90deg, var(--accent-primary), var(--highlight))", borderRadius: 999, transition: "width 0.4s ease", boxShadow: "0 0 10px rgba(6,182,212,0.5)" }} />
              </div>
            </div>
          </div>
        ) : state === "success" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--success), #34D399)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 10px 25px rgba(16,185,129,0.4)" }}>
              <CheckCircle size={40} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 6 }}>Upload Successful!</div>
              <div style={{ fontSize: 16, color: "var(--text-secondary)" }}>Redirecting to your dashboard...</div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 56, marginBottom: 20, lineHeight: 1, filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }}>
              <UploadCloud size={64} color="var(--accent-primary)" />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
              {isDragging ? "Drop files to analyze" : "Drag your Instagram export JSON files here"}
            </div>
            <div style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32 }}>
              or click to browse your files
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", fontSize: 14, color: "var(--text-secondary)" }}>
              {["followers.json", "following.json"].map((name) => (
                <span key={name} style={{ padding: "6px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>
                  {name}
                </span>
              ))}
            </div>
          </>
        )}
        <input type="file" accept=".json" multiple ref={mainInputRef} onChange={onMainFileSelect} style={{ display: "none" }} />
      </div>

      {/* Manual file selectors */}
      {state !== "processing" && state !== "success" && (
        <div className="animate-fade-up" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animationDelay: "100ms" }}>
          {([
            { ref: followingInputRef, type: "following" as const, label: "following.json", icon: <User size={28} />, desc: "People you follow", file: pendingFollowing },
            { ref: followersInputRef, type: "followers" as const, label: "followers.json", icon: <Users size={28} />, desc: "Your followers", file: pendingFollowers },
          ]).map(({ ref, type, label, icon, desc, file }) => (
            <div key={type}>
              <input ref={ref} type="file" accept=".json" style={{ display: "none" }} onChange={(e) => onFileChange(e, type)} id={`file-${type}`} />
              <label
                htmlFor={`file-${type}`}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  padding: "24px 16px",
                  background: file ? "rgba(255,107,53,0.1)" : "var(--bg-surface)",
                  border: `1px solid ${file ? "var(--accent-primary)" : "var(--border-glass)"}`,
                  borderRadius: 16, cursor: "pointer", transition: "all 0.3s",
                  textAlign: "center", backdropFilter: "blur(10px)",
                }}
                className={!file ? "card" : ""}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, filter: file ? "drop-shadow(0 0 8px var(--accent-primary))" : "none", color: file ? "var(--success)" : "var(--text-secondary)" }}>
                  {file ? <FileJson size={32} /> : icon}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                    {file ? file.name : label}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                    {file ? "Click to change" : desc}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {state === "error" && (
        <div className="animate-fade-up" style={{ marginTop: 20, padding: "16px 20px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, color: "#fca5a5", fontSize: 15, display: "flex", alignItems: "center", gap: 12, backdropFilter: "blur(10px)" }}>
          <AlertTriangle size={24} />
          <span>{error}</span>
        </div>
      )}

      {/* Analyze button */}
      {(pendingFollowing || pendingFollowers) && state !== "processing" && state !== "success" && (
        <div className="animate-fade-up" style={{ marginTop: 28, textAlign: "center" }}>
          <button onClick={handleAnalyze} className="btn-primary" style={{ fontSize: 18, padding: "16px 48px", borderRadius: 14 }} id="analyze-button">
            Analyze Data →
          </button>
          <div style={{ marginTop: 12, fontSize: 14, color: "var(--text-secondary)" }}>
            {fileCount} file{fileCount !== 1 ? "s" : ""} ready for processing
          </div>
        </div>
      )}

      {/* How to export guide */}
      {state === "idle" && !pendingFollowing && !pendingFollowers && (
        <div className="card animate-fade-up" style={{ marginTop: 40, padding: "32px", animationDelay: "200ms" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            How to get your data
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              <><a href="https://accountscenter.instagram.com/info_and_permissions/dyi/?theme=dark" target="_blank" rel="noopener noreferrer" style={{ color: "var(--highlight)", textDecoration: "none", fontWeight: 600 }}>Open the Download Your Information</a> page in the Instagram Accounts Center</>,
              'Select "Followers and following" and choose JSON format',
              "Request download and wait for the email from Instagram",
              'Unzip and upload the "followers.json" and "following.json" files here',
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(6,182,212,0.15))", color: "var(--accent-primary)", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,107,53,0.2)" }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Link href="/guide" className="btn-primary" style={{ display: "inline-block", padding: "10px 24px", fontSize: 15, borderRadius: 10 }}>
              View Detailed Guide with Images →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
